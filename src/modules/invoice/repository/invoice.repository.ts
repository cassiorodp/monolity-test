import Address from '../../@shared/domain/value-object/address';
import Id from '../../@shared/domain/value-object/id.value-object';
import Invoice from '../domain/invoice.entity';
import InvoiceItem from '../domain/invoice-item.entity';
import InvoiceGateway from '../gateway/invoice.gateway';
import InvoiceModel from './invoice.model';

export default class InvoiceRepository implements InvoiceGateway {
  async add(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipcode: invoice.address.zipCode,
      items: JSON.stringify(
        invoice.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
        })),
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }

  async find(id: string): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.findOne({ where: { id } });

    if (!invoiceModel) {
      throw new Error('Invoice not found');
    }

    const parsedItems = JSON.parse(invoiceModel.items || '[]') as Array<{
      id: string;
      name: string;
      price: number;
    }>;

    return new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: new Address(
        invoiceModel.street,
        invoiceModel.number,
        invoiceModel.complement,
        invoiceModel.city,
        invoiceModel.state,
        invoiceModel.zipcode,
      ),
      items: parsedItems.map(
        (item) =>
          new InvoiceItem({ id: item.id, name: item.name, price: item.price }),
      ),
      createdAt: invoiceModel.createdAt,
      updatedAt: invoiceModel.updatedAt,
    });
  }
}
