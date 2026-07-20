import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import request from 'supertest';
import { app } from '../app';
import { migrator } from '../../modules/@shared/infra/db/migrator';
import { ClientModel } from '../../modules/client-adm/repository/client.model';

describe('Client E2E test', () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    sequelize.addModels([ClientModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it('should create a client', async () => {
    const response = await request(app)
      .post('/clients')
      .send({
        name: 'Client 1',
        email: 'client1@test.com',
        document: '123456789',
        address: {
          street: 'Rua 1',
          number: '100',
          complement: 'Apto 1',
          city: 'Criciúma',
          state: 'SC',
          zipCode: '88888-000',
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('Client 1');
    expect(response.body.email).toBe('client1@test.com');
    expect(response.body.document).toBe('123456789');
    expect(response.body.address.street).toBe('Rua 1');
  });
});
