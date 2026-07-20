import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import CheckoutFacadeInterface, {
  CheckoutFacadeInputDto,
  CheckoutFacadeOutputDto,
} from './checkout.facade.interface';

export interface UseCaseProps {
  placeOrderUseCase: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
  private _placeOrderUseCase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._placeOrderUseCase = props.placeOrderUseCase;
  }

  async checkout(
    input: CheckoutFacadeInputDto,
  ): Promise<CheckoutFacadeOutputDto> {
    return await this._placeOrderUseCase.execute(input);
  }
}
