import BaseEntity from '../../@shared/domain/entity/base.entity';
import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface';
import Id from '../../@shared/domain/value-object/id.value-object';

type ProductProps = {
  id?: Id;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
  salesPrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Product extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _description: string;
  private _purchasePrice: number;
  private _stock: number;
  private _salesPrice?: number;

  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._purchasePrice = props.purchasePrice;
    this._stock = props.stock;
    this._salesPrice = props.salesPrice;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get purchasePrice(): number {
    return this._purchasePrice;
  }

  get stock(): number {
    return this._stock;
  }

  get salesPrice(): number | undefined {
    return this._salesPrice;
  }

  set name(name: string) {
    this._name = name;
  }

  set stock(stock: number) {
    this._stock = stock;
  }

  set description(description: string) {
    this._description = description;
  }

  set purchasePrice(purchasePrice: number) {
    this._purchasePrice = purchasePrice;
  }

  set salesPrice(salesPrice: number | undefined) {
    this._salesPrice = salesPrice;
  }
}
