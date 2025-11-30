import type { FastifyInstance } from 'fastify'
import { OrderService } from '../../application/services/OrderService'
import { InMemoryOrderRepository } from '../../repository/InMemoryOrderRepository'
import { CreateOrderParameter } from '../../domain/order'

const orderRepository = new InMemoryOrderRepository()
const orderService = new OrderService(orderRepository)

export async function ordersRoutes(fastify: FastifyInstance) {
  // GET /api/orders - Get all orders
  fastify.get('/orders', async (request, reply) => {
    try {
      const orders = await orderService.getAllOrders()
      return orders
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch orders' })
    }
  })

  // GET /api/orders/:id - Get order by ID
  fastify.get<{
    Params: { id: string }
  }>('/orders/:id', async (request, reply) => {
    try {
      const { id } = request.params
      const order = await orderService.getOrderById(id)

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' })
      }

      return order
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch order' })
    }
  })

  // POST /api/orders - Create new order
  fastify.post<{
    Body: {
      orderId: string
      userId: string
      items: Array<{ productId: string; quantity: number; price: number }>
    }
  }>('/orders', async (request, reply) => {
    try {
      const params = new CreateOrderParameter(
        request.body.orderId,
        request.body.userId,
        request.body.items
      )
      const order = await orderService.createOrder(params)
      return reply.status(201).send(order)
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message })
    }
  })

  // POST /api/orders/:id/confirm - Confirm order
  fastify.post<{
    Params: { id: string }
  }>('/orders/:id/confirm', async (request, reply) => {
    try {
      const { id } = request.params
      await orderService.confirmOrder(id)

      return { success: true, message: 'Order confirmed' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to confirm order'
      reply.status(400).send({ error: errorMessage })
    }
  })

  // POST /api/orders/:id/ship - Ship order
  fastify.post<{
    Params: { id: string }
  }>('/orders/:id/ship', async (request, reply) => {
    try {
      const { id } = request.params
      await orderService.shipOrder(id)

      return { success: true, message: 'Order shipped' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to ship order'
      reply.status(400).send({ error: errorMessage })
    }
  })

  // POST /api/orders/:id/cancel - Cancel order
  fastify.post<{
    Params: { id: string }
  }>('/orders/:id/cancel', async (request, reply) => {
    try {
      const { id } = request.params
      await orderService.cancelOrder(id)

      return { success: true, message: 'Order cancelled' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order'
      reply.status(400).send({ error: errorMessage })
    }
  })
}
