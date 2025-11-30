import type { CreateOrderParameter, OrderResult, OrderStatus } from '../../domain/order'
import { InMemoryOrderRepository } from '../../repository/InMemoryOrderRepository'

// Application Service: Order use cases with business logic
export class OrderService {
  constructor(private orderRepository: InMemoryOrderRepository) {}

  async getOrderById(orderId: string): Promise<OrderResult | null> {
    return await this.orderRepository.findById(orderId)
  }

  async getAllOrders(): Promise<OrderResult[]> {
    return await this.orderRepository.findAll()
  }

  async createOrder(params: CreateOrderParameter): Promise<OrderResult> {
    const total = params.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    const order: OrderResult = {
      id: params.orderId,
      userId: params.userId,
      items: params.items,
      status: 'PENDING',
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.orderRepository.save(order)
    return order
  }

  async confirmOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'CONFIRMED', ['PENDING'])
  }

  async shipOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'SHIPPED', ['CONFIRMED'])
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'CANCELLED', ['PENDING', 'CONFIRMED', 'SHIPPED'])
  }

  private async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    allowedCurrentStatuses: OrderStatus[]
  ): Promise<void> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    if (!allowedCurrentStatuses.includes(order.status)) {
      throw new Error(`Cannot change status from ${order.status} to ${newStatus}`)
    }

    const updatedOrder = {
      ...order,
      status: newStatus,
      updatedAt: new Date(),
    }

    await this.orderRepository.save(updatedOrder)
  }
}
