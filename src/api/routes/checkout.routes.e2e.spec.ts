import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import request from 'supertest';
import { app } from '../app';
import { migrator } from '../../modules/@shared/infra/db/migrator';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { ProductModel as ProductAdmModel } from '../../modules/product-adm/repository/product.model';
import StoreCatalogProductModel from '../../modules/store-catalog/repository/product.model';
import TransactionModel from '../../modules/payment/repository/transaction.model';
import InvoiceModel from '../../modules/invoice/repository/invoice.model';

describe('Checkout E2E test', () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    sequelize.addModels([
      ClientModel,
      ProductAdmModel,
      StoreCatalogProductModel,
      TransactionModel,
      InvoiceModel,
    ]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  async function createClient() {
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
    return response.body.id;
  }

  async function createProduct(salesPrice: number) {
    const response = await request(app).post('/products').send({
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 40,
      stock: 10,
      salesPrice,
    });
    return response.body.id;
  }

  it('should place an order and approve payment with an invoice', async () => {
    const clientId = await createClient();
    const productId = await createProduct(150);

    const response = await request(app)
      .post('/checkout')
      .send({
        clientId,
        products: [{ productId }],
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('approved');
    expect(response.body.total).toBe(150);
    expect(response.body.invoiceId).toBeDefined();

    const invoiceResponse = await request(app).get(
      `/invoice/${response.body.invoiceId}`,
    );
    expect(invoiceResponse.status).toBe(200);
    expect(invoiceResponse.body.total).toBe(150);
  });

  it('should place an order and decline payment when amount is below 100', async () => {
    const clientId = await createClient();
    const productId = await createProduct(50);

    const response = await request(app)
      .post('/checkout')
      .send({
        clientId,
        products: [{ productId }],
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('declined');
    expect(response.body.total).toBe(50);
    expect(response.body.invoiceId).toBeUndefined();
  });
});
