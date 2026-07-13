import GenerateInvoiceUseCase from './generate-invoice.usecase';
import InvoiceGateway from '../../gateway/invoice.gateway';
import Invoice from '../../domain/invoice.entity';

const MockRepository = () => ({
  add: jest.fn(async (_invoice: Invoice) => undefined),
  find: jest.fn(async (_id: string) => {
    throw new Error('Not implemented');
  }),
});

describe('Generate Invoice use case unit test', () => {
  it('should generate an invoice', async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const input = {
      name: 'John Doe',
      document: '123456789',
      street: 'Rua da Paz',
      number: '100',
      complement: 'Sala 1',
      city: 'Criciúma',
      state: 'SC',
      zipCode: '88800-000',
      items: [
        { id: '1', name: 'Product A', price: 50 },
        { id: '2', name: 'Product B', price: 45 },
      ],
    };

    const result = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
    expect(result.items).toEqual(input.items);
    expect(result.total).toBe(95);
  });
});
