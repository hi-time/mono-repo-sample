import { describe, it, expect } from 'vitest'

// Sample composable for testing
function useGreeting(name: string) {
  const greeting = `Hello, ${name}!`
  const length = greeting.length
  
  return {
    greeting,
    length
  }
}

describe('useGreeting', () => {
  it('returns formatted greeting', () => {
    const { greeting } = useGreeting('World')
    expect(greeting).toBe('Hello, World!')
  })

  it('calculates greeting length', () => {
    const { length } = useGreeting('Vue')
    expect(length).toBe(11) // "Hello, Vue!"
  })

  it('handles empty name', () => {
    const { greeting } = useGreeting('')
    expect(greeting).toBe('Hello, !')
  })
})
