import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import Address from '../../modules/@shared/domain/value-object/address';
import ClientAdmFacadeFactory from '../../modules/client-adm/factory/client-adm.facade.factory';

export const clientRoute = express.Router();

clientRoute.post('/', async (req: Request, res: Response) => {
  const facade = ClientAdmFacadeFactory.create();

  try {
    const id = req.body.id || uuid();

    const address = new Address(
      req.body.address.street,
      req.body.address.number,
      req.body.address.complement,
      req.body.address.city,
      req.body.address.state,
      req.body.address.zipCode,
    );

    await facade.add({
      id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address,
    });

    res.status(201).send({
      id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: {
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
    });
  } catch (err: any) {
    res.status(400).send({ message: err.message });
  }
});
