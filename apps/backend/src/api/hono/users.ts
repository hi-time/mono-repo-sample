import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import type { User } from '@repo/types'

export const usersRoute = new OpenAPIHono()

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@example.com',
    name: 'Alice Smith',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'bob@example.com',
    name: 'Bob Johnson',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    email: 'carol@example.com',
    name: 'Carol Williams',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
]

// GET /api/users - List all users
const listRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['users'],
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              id: z.string(),
              email: z.string(),
              name: z.string(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
          ),
        },
      },
    },
  },
})

usersRoute.openapi(listRoute, (c) => {
  return c.json(mockUsers)
})

// GET /api/users/:id - Get user by ID
const getRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['users'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'User details',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            email: z.string(),
            name: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
          }),
        },
      },
    },
    404: {
      description: 'User not found',
    },
  },
})

usersRoute.openapi(getRoute, (c) => {
  const { id } = c.req.valid('param')
  const user = mockUsers.find((u) => u.id === id)
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json(user)
})
