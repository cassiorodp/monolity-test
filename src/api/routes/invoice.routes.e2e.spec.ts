import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import request from 'supertest';
import { app } from '../app';
import { migrator } from '../../modules/@shared/infra/db/migrator';
import InvoiceModel from '../../modules/invoice/repository/invoice.model';
import InvoiceFacadeFactory from '../../modules/invoice/factory/invoice.facade.factory';

describe('Invoice E2E test', () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    sequelize.addModels([InvoiceModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it('should find an invoice', async () => {
    const facade = InvoiceFacadeFactory.create();
    const generated = await facade.generate({
      name: 'Client 1',
      document: '123456789',
      street: 'Rua 1',
      number: '100',
      complement: 'Apto 1',
      city: 'Criciúma',
      state: 'SC',
      zipCode: '88888-000',
      items: [{ id: '1', name: 'Product 1', price: 100 }],
    });

    const response = await request(app).get(`/invoice/${generated.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(generated.id);
    expect(response.body.name).toBe('Client 1');
    expect(response.body.document).toBe('123456789');
    expect(response.body.total).toBe(100);
  });

  it('should return 404 when invoice is not found', async () => {
    const response = await request(app).get('/invoice/non-existent-id');

    expect(response.status).toBe(404);
  });
});
