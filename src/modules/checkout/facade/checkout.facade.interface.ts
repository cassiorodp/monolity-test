import {
  PlaceOrderInputDto,
  PlaceOrderOutputDto,
} from '../usecase/place-order/place-order.dto';

export interface CheckoutFacadeInputDto extends PlaceOrderInputDto {}
export interface CheckoutFacadeOutputDto extends PlaceOrderOutputDto {}

export default interface CheckoutFacadeInterface {
  checkout(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto>;
}
