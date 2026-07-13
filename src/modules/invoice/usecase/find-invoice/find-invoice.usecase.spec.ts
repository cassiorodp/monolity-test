import Address from '../../../@shared/domain/value-object/address';
import Id from '../../../@shared/domain/value-object/id.value-object';
import Invoice from '../../domain/invoice.entity';
import InvoiceItem from '../../domain/invoice-item.entity';
import FindInvoiceUseCase from './find-invoice.usecase';

const MockRepository = () => ({
  add: jest.fn(async (_invoice: Invoice) => undefined),
  find: jest.fn(async (id: string) => {
    return new Invoice({
      id: new Id(id),
      name: 'Jane Doe',
      document: '987654321',
      address: new Address(
        'Rua do Sol',
        '20',
        'Apto 2',
        'Florianópolis',
        'SC',
        '88000-000',
      ),
      items: [new InvoiceItem({ id: '10', name: 'Service', price: 120 })],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    });
  }),
});

describe('Find Invoice use case unit test', () => {
  it('should find an invoice', async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const result = await usecase.execute({ id: 'invoice-1' });

    expect(repository.find).toHaveBeenCalledWith('invoice-1');
    expect(result.id).toBe('invoice-1');
    expect(result.name).toBe('Jane Doe');
    expect(result.document).toBe('987654321');
    expect(result.address.street).toBe('Rua do Sol');
    expect(result.items[0].name).toBe('Service');
    expect(result.total).toBe(120);
    expect(result.createdAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
  });
});
