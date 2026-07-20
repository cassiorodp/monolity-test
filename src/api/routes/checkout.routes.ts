import express, { Request, Response } from 'express';
import CheckoutFacadeFactory from '../../modules/checkout/factory/checkout.facade.factory';

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
  const facade = CheckoutFacadeFactory.create();

  try {
    const output = await facade.checkout({
      clientId: req.body.clientId,
      products: req.body.products,
    });

    res.status(201).send(output);
  } catch (err: any) {
    res.status(400).send({ message: err.message });
  }
});
