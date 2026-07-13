export interface InvoiceItemProps {
  id: string;
  name: string;
  price: number;
}

export default class InvoiceItem {
  private _id: string;
  private _name: string;
  private _price: number;

  constructor(props: InvoiceItemProps) {
    this._id = props.id;
    this._name = props.name;
    this._price = props.price;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
