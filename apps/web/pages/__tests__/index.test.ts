import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '../index.vue'

describe('IndexPage', () => {
  it('renders project title', async () => {
    const component = await mountSuspended(IndexPage)
    expect(component.text()).toContain('Turborepo DDD Sample')
  })

  it('displays OpenAPI documentation links', async () => {
    const component = await mountSuspended(IndexPage)
    const html = component.html()
    
    expect(html).toContain('API仕様書 (Swagger UI)')
    expect(html).toContain('/documentation')
    expect(html).toContain('/documentation/json')
    expect(html).toContain('/documentation/yaml')
  })

  it('shows tech stack information', async () => {
    const component = await mountSuspended(IndexPage)
    const text = component.text()
    
    expect(text).toContain('Fastify 5')
    expect(text).toContain('Nuxt 4')
    expect(text).toContain('OpenAPI 3.1')
  })

  it('includes health check link', async () => {
    const component = await mountSuspended(IndexPage)
    const html = component.html()
    expect(html).toContain('/health')
    expect(html).toContain('ヘルスチェック')
  })
})
