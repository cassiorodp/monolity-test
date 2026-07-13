import InvoiceRepository from '../repository/invoice.repository';
import GenerateInvoiceUseCase from '../usecase/generate-invoice/generate-invoice.usecase';
import FindInvoiceUseCase from '../usecase/find-invoice/find-invoice.usecase';
import InvoiceFacade from '../facade/invoice.facade';

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacade {
    const repository = new InvoiceRepository();
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const findUsecase = new FindInvoiceUseCase(repository);

    return new InvoiceFacade({
      generateUsecase,
      findUsecase,
    });
  }
}
