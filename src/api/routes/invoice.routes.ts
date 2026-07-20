import express, { Request, Response } from 'express';
import InvoiceFacadeFactory from '../../modules/invoice/factory/invoice.facade.factory';

export const invoiceRoute = express.Router();

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
  const facade = InvoiceFacadeFactory.create();

  try {
    const output = await facade.find({ id: req.params.id });

    res.status(200).send(output);
  } catch (err: any) {
    res.status(404).send({ message: err.message });
  }
});
