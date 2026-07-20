import { Sequelize } from 'sequelize-typescript';
import { app } from './app';
import { migrator } from '../modules/@shared/infra/db/migrator';
import { ClientModel } from '../modules/client-adm/repository/client.model';
import { ProductModel as ProductAdmModel } from '../modules/product-adm/repository/product.model';
import StoreCatalogProductModel from '../modules/store-catalog/repository/product.model';
import TransactionModel from '../modules/payment/repository/transaction.model';
import InvoiceModel from '../modules/invoice/repository/invoice.model';

export async function bootstrap() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './db.sqlite3',
    logging: false,
  });

  sequelize.addModels([
    ClientModel,
    ProductAdmModel,
    StoreCatalogProductModel,
    TransactionModel,
    InvoiceModel,
  ]);

  await migrator(sequelize).up();

  return sequelize;
}

if (require.main === module) {
  bootstrap()
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
}
