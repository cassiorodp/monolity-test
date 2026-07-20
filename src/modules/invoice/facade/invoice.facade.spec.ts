import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import InvoiceModel from '../repository/invoice.model';
import InvoiceFacadeFactory from '../factory/invoice.facade.factory';
import { migrator } from '../../@shared/infra/db/migrator';

describe('Invoice facade integration test', () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    await sequelize.addModels([InvoiceModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it('should generate and find an invoice through the facade', async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: 'Alice',
      document: '111222333',
      street: 'Rua Central',
      number: '77',
      complement: 'Casa',
      city: 'Joinville',
      state: 'SC',
      zipCode: '89200-000',
      items: [
        { id: '10', name: 'Consulting', price: 100 },
        { id: '11', name: 'Support', price: 50 },
      ],
    };

    const generated = await facade.generate(input);
    const found = await facade.find({ id: generated.id });

    expect(generated.id).toBeDefined();
    expect(generated.total).toBe(150);
    expect(found.id).toBe(generated.id);
    expect(found.name).toBe(input.name);
    expect(found.document).toBe(input.document);
    expect(found.address.street).toBe(input.street);
    expect(found.items).toHaveLength(2);
    expect(found.total).toBe(150);
  });
});
