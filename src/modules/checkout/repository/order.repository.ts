import Order from '../domain/order.entity';
import CheckoutGateway from '../gateway/checkout.gateway';

export default class OrderRepository implements CheckoutGateway {
  private static orders: Map<string, Order> = new Map();

  async addOrder(order: Order): Promise<void> {
    OrderRepository.orders.set(order.id.id, order);
  }

  async findOrder(id: string): Promise<Order | null> {
    return OrderRepository.orders.get(id) || null;
  }
}
