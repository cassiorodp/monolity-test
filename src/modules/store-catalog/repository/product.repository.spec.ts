import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import ProductModel from './product.model';
import ProductRepository from './product.repository';
import { migrator } from '../../@shared/infra/db/migrator';

describe('ProductRepository test', () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    await sequelize.addModels([ProductModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it('should find all products', async () => {
    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100,
    });

    await ProductModel.create({
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      salesPrice: 200,
    });

    const productRepository = new ProductRepository();
    const products = await productRepository.findAll();

    expect(products.length).toBe(2);
    expect(products[0].id.id).toBe('1');
    expect(products[0].name).toBe('Product 1');
    expect(products[0].description).toBe('Description 1');
    expect(products[0].salesPrice).toBe(100);
    expect(products[1].id.id).toBe('2');
    expect(products[1].name).toBe('Product 2');
    expect(products[1].description).toBe('Description 2');
    expect(products[1].salesPrice).toBe(200);
  });

  it('should find a product', async () => {
    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 100,
    });

    const productRepository = new ProductRepository();
    const product = await productRepository.find('1');

    expect(product.id.id).toBe('1');
    expect(product.name).toBe('Product 1');
    expect(product.description).toBe('Description 1');
    expect(product.salesPrice).toBe(100);
  });
});
