import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Example Test', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true)
  })

  it('should render text', () => {
    render(<div>Test Component</div>)
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })
})
