import type { OrderResult } from '../domain/order'

// Repository: In-memory implementation for Order data
export class InMemoryOrderRepository {
  private orders: Map<string, OrderResult> = new Map()

  constructor() {
    this.seedData()
  }

  private seedData(): void {
    const order1: OrderResult = {
      id: 'order-1',
      userId: 'user-1',
      items: [
        { productId: 'product-1', quantity: 2, price: 3200 },
        { productId: 'product-2', quantity: 1, price: 2800 },
      ],
      status: 'PENDING',
      total: 9200,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    }

    const order2: OrderResult = {
      id: 'order-2',
      userId: 'user-2',
      items: [
        { productId: 'product-3', quantity: 1, price: 4500 },
      ],
      status: 'CONFIRMED',
      total: 4500,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-11'),
    }

    this.orders.set(order1.id, order1)
    this.orders.set(order2.id, order2)
  }

  async findById(id: string): Promise<OrderResult | null> {
    return this.orders.get(id) || null
  }

  async findAll(): Promise<OrderResult[]> {
    return Array.from(this.orders.values())
  }

  async save(order: OrderResult): Promise<void> {
    this.orders.set(order.id, order)
  }

  async delete(id: string): Promise<void> {
    this.orders.delete(id)
  }
}
