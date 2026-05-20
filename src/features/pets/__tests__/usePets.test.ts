import { describe, it, expect } from 'vitest'

function buildFilters(filters: {
  species_id?: number
  age_min?: number
  age_max?: number
  size?: string
}) {
  const result: Record<string, unknown> = {}
  if (filters.species_id) result.species_id = filters.species_id
  if (filters.size) result.size = filters.size
  if (filters.age_min !== undefined) result.age_min = filters.age_min
  if (filters.age_max !== undefined) result.age_max = filters.age_max
  return result
}

describe('pet filter logic', () => {
  it('empty filters return empty object', () => {
    expect(buildFilters({})).toEqual({})
  })

  it('includes species filter', () => {
    expect(buildFilters({ species_id: 1 })).toEqual({ species_id: 1 })
  })

  it('includes size filter', () => {
    expect(buildFilters({ size: 'small' })).toEqual({ size: 'small' })
  })

  it('includes age range', () => {
    expect(buildFilters({ age_min: 1, age_max: 5 })).toEqual({ age_min: 1, age_max: 5 })
  })

  it('combines multiple conditions', () => {
    expect(buildFilters({ species_id: 2, size: 'medium', age_max: 3 }))
      .toEqual({ species_id: 2, size: 'medium', age_max: 3 })
  })
})
