import Id from '../../../@shared/domain/value-object/id.value-object';
import Address from '../../../@shared/domain/value-object/address';
import UseCaseInterface from '../../../@shared/usecase/use-case.interface';
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm.facade.interface';
import ProductAdmFacadeInterface from '../../../product-adm/facade/product-adm.facade.interface';
import StoreCatalogFacadeInterface from '../../../store-catalog/facade/store-catalog.facade.interface';
import PaymentFacadeInterface from '../../../payment/facade/facade.interface';
import InvoiceFacadeInterface from '../../../invoice/facade/invoice.facade.interface';
import Client from '../../domain/client.entity';
import Order from '../../domain/order.entity';
import Product from '../../domain/product.entity';
import CheckoutGateway from '../../gateway/checkout.gateway';
import { PlaceOrderInputDto, PlaceOrderOutputDto } from './place-order.dto';

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _repository: CheckoutGateway;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    paymentFacade: PaymentFacadeInterface,
    invoiceFacade: InvoiceFacadeInterface,
    repository: CheckoutGateway,
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._paymentFacade = paymentFacade;
    this._invoiceFacade = invoiceFacade;
    this._repository = repository;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error('Client not found');
    }

    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId)),
    );

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      address: client.address,
    });

    const order = new Order({
      client: myClient,
      products: products,
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    order.status = payment.status === 'approved' ? 'approved' : 'declined';

    if (payment.status === 'approved') {
      const address = client.address as Address;
      const invoice = await this._invoiceFacade.generate({
        name: client.name,
        document: client.document,
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        items: products.map((p) => ({
          id: p.id.id,
          name: p.name,
          price: p.salesPrice,
        })),
      });
      order.invoiceId = invoice.id;
    }

    await this._repository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId: order.invoiceId,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => ({
        productId: p.id.id,
      })),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error('No products selected');
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(`Product ${p.productId} is not available in stock`);
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error('Product not found');
    }
    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
