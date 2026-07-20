import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import Id from '../../@shared/domain/value-object/id.value-object';
import Transaction from '../domain/transaction';
import TransactionModel from './transaction.model';
import TransactionRepostiory from './transaction.repository';
import { migrator } from '../../@shared/infra/db/migrator';

describe('TransactionRepository test', () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    await sequelize.addModels([TransactionModel]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it('should save a transaction', async () => {
    const transaction = new Transaction({
      id: new Id('1'),
      amount: 100,
      orderId: '1',
    });
    transaction.approve();

    const repository = new TransactionRepostiory();
    const result = await repository.save(transaction);

    expect(result.id.id).toBe(transaction.id.id);
    expect(result.status).toBe('approved');
    expect(result.amount).toBe(transaction.amount);
    expect(result.orderId).toBe(transaction.orderId);
  });
});
