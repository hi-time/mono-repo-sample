import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import type { Product } from '@repo/types'

export const productsRoute = new OpenAPIHono()

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'TypeScript実践ガイド',
    description: 'TypeScriptを実務で使いこなすための実践的なガイドブック',
    price: 3200,
    stock: 50,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Node.js完全入門',
    description: 'Node.jsの基礎から応用まで網羅した入門書',
    price: 2800,
    stock: 30,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '3',
    name: 'Webアプリケーション設計',
    description: 'スケーラブルなWebアプリケーションの設計手法',
    price: 4500,
    stock: 25,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '4',
    name: 'DDDドメイン駆動設計',
    description: 'ドメイン駆動設計の理論と実践',
    price: 5000,
    stock: 20,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
]

// GET /api/products - List all products
const listRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['products'],
  responses: {
    200: {
      description: 'List of products',
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              price: z.number(),
              stock: z.number(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
          ),
        },
      },
    },
  },
})

productsRoute.openapi(listRoute, (c) => {
  return c.json(mockProducts)
})

// GET /api/products/:id - Get product by ID
const getRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['products'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Product details',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            price: z.number(),
            stock: z.number(),
            createdAt: z.string(),
            updatedAt: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'Product not found',
    },
  },
})

productsRoute.openapi(getRoute, (c) => {
  const { id } = c.req.valid('param')
  const product = mockProducts.find((p) => p.id === id)
  
  if (!product) {
    return c.json({ error: 'Product not found' }, 404)
  }
  
  return c.json(product)
})
