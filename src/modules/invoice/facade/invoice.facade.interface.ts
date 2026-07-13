import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from '../usecase/generate-invoice/generate-invoice.usecase';
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from '../usecase/find-invoice/find-invoice.usecase';

export interface GenerateInvoiceFacadeInputDto extends GenerateInvoiceUseCaseInputDto {}
export interface GenerateInvoiceFacadeOutputDto extends GenerateInvoiceUseCaseOutputDto {}
export interface FindInvoiceFacadeInputDto extends FindInvoiceUseCaseInputDTO {}
export interface FindInvoiceFacadeOutputDto extends FindInvoiceUseCaseOutputDTO {}

export default interface InvoiceFacadeInterface {
  generate(
    input: GenerateInvoiceFacadeInputDto,
  ): Promise<GenerateInvoiceFacadeOutputDto>;
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}
