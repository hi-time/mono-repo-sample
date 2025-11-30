// Domain: Order Result
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export class OrderResult {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly status: OrderStatus,
    public readonly total: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
