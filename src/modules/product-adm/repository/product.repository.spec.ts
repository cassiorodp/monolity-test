import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import Id from '../../@shared/domain/value-object/id.value-object';
import Product from '../domain/product.entity';
import { ProductModel } from './product.model';
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

  it('should create a product', async () => {
    const productProps = {
      id: new Id('1'),
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    };
    const product = new Product(productProps);
    const productRepository = new ProductRepository();
    await productRepository.add(product);

    const productDb = await ProductModel.findOne({
      where: { id: productProps.id.id },
    });

    expect(productProps.id.id).toEqual(productDb.id);
    expect(productProps.name).toEqual(productDb.name);
    expect(productProps.description).toEqual(productDb.description);
    expect(productProps.purchasePrice).toEqual(productDb.purchasePrice);
    expect(productProps.stock).toEqual(productDb.stock);
  });

  it('should find a product', async () => {
    const productRepository = new ProductRepository();

    ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await productRepository.find('1');

    expect(product.id.id).toEqual('1');
    expect(product.name).toEqual('Product 1');
    expect(product.description).toEqual('Product 1 description');
    expect(product.purchasePrice).toEqual(100);
    expect(product.stock).toEqual(10);
  });
});
