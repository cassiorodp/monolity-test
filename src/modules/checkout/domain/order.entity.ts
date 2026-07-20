import BaseEntity from '../../@shared/domain/entity/base.entity';
import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface';
import Id from '../../@shared/domain/value-object/id.value-object';
import Client from './client.entity';
import Product from './product.entity';

type OrderProps = {
  id?: Id;
  client: Client;
  products: Product[];
  status?: string;
  invoiceId?: string;
};

export default class Order extends BaseEntity implements AggregateRoot {
  private _client: Client;
  private _products: Product[];
  private _status: string;
  private _invoiceId?: string;

  constructor(props: OrderProps) {
    super(props.id);
    this._client = props.client;
    this._products = props.products;
    this._status = props.status || 'pending';
    this._invoiceId = props.invoiceId;
  }

  get client(): Client {
    return this._client;
  }

  get products(): Product[] {
    return this._products;
  }

  get status(): string {
    return this._status;
  }

  set status(status: string) {
    this._status = status;
  }

  get invoiceId(): string | undefined {
    return this._invoiceId;
  }

  set invoiceId(invoiceId: string | undefined) {
    this._invoiceId = invoiceId;
  }

  get total(): number {
    return this._products.reduce(
      (total, product) => total + product.salesPrice,
      0,
    );
  }
}
