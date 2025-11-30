// Domain: Create Order Parameter
export class CreateOrderParameter {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly items: Array<{
      productId: string
      quantity: number
      price: number
    }>
  ) {
    if (!orderId) throw new Error('orderId is required')
    if (!userId) throw new Error('userId is required')
    if (!items || items.length === 0) throw new Error('items cannot be empty')
  }
}
