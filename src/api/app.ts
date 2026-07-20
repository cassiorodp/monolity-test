import express, { Express, NextFunction, Request, Response } from 'express';
import { productRoute } from './routes/product.routes';
import { clientRoute } from './routes/client.routes';
import { checkoutRoute } from './routes/checkout.routes';
import { invoiceRoute } from './routes/invoice.routes';

export const app: Express = express();

app.use(express.json());

app.use('/products', productRoute);
app.use('/clients', clientRoute);
app.use('/checkout', checkoutRoute);
app.use('/invoice', invoiceRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
});
