import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import ProductAdmFacadeFactory from '../../modules/product-adm/factory/facade.factory';

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
  const facade = ProductAdmFacadeFactory.create();

  try {
    const id = req.body.id || uuid();

    const salesPrice = req.body.salesPrice ?? req.body.purchasePrice;

    await facade.addProduct({
      id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
      salesPrice,
    });

    res.status(201).send({
      id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
      salesPrice,
    });
  } catch (err: any) {
    res.status(400).send({ message: err.message });
  }
});
