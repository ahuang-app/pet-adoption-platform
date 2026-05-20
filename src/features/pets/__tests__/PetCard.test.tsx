import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { Pet } from '@/types'

vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    img: 'img',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    p: 'p',
    a: 'a',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

import PetCard from '../PetCard'

const mockPet: Pet = {
  id: 1,
  name: 'Buddy',
  age: 2,
  species_id: 1,
  breed_id: 1,
  size: 'large',
  traits: ['温顺', '活泼'],
  image_url: 'https://example.com/dog.jpg',
  health_status: '健康',
  shelter_info: '阳光救助中心',
  description: '一只可爱的金毛',
  is_adopted: false,
  created_at: '2026-01-01',
  species: { id: 1, name: '狗', icon: '🐕' },
  breed: { id: 1, name: '金毛寻回犬', species_id: 1 },
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('PetCard', () => {
  it('renders pet name and age', () => {
    renderWithRouter(<PetCard pet={mockPet} />)
    expect(screen.getByText('Buddy')).toBeDefined()
    expect(screen.getByText('2岁')).toBeDefined()
  })

  it('renders breed and size info', () => {
    renderWithRouter(<PetCard pet={mockPet} />)
    expect(screen.getByText(/金毛寻回犬/)).toBeDefined()
    expect(screen.getByText(/大型/)).toBeDefined()
  })

  it('renders trait tags', () => {
    renderWithRouter(<PetCard pet={mockPet} />)
    expect(screen.getByText('温顺')).toBeDefined()
    expect(screen.getByText('活泼')).toBeDefined()
  })

  it('links to correct pet detail page', () => {
    renderWithRouter(<PetCard pet={mockPet} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/pets/1')
  })
})
