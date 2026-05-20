export type PetSize = 'small' | 'medium' | 'large'
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface Species {
  id: number
  name: string
  icon: string
}

export interface Breed {
  id: number
  species_id: number
  name: string
}

export interface Pet {
  id: number
  name: string
  age: number
  species_id: number
  breed_id: number
  size: PetSize
  traits: string[]
  image_url: string
  health_status: string
  shelter_info: string
  description: string
  is_adopted: boolean
  created_at: string
  species?: Species
  breed?: Breed
}

export interface UserProfile {
  id: string
  name: string
  avatar_url: string | null
  phone: string | null
  email: string | null
  created_at: string
}

export interface Favorite {
  id: number
  user_id: string
  pet_id: number
  created_at: string
  pet?: Pet
}

export interface AdoptionApplication {
  id: number
  user_id: string
  pet_id: number
  name: string
  phone: string
  message: string
  status: ApplicationStatus
  created_at: string
  updated_at: string
  pet?: Pet
}

export interface SuccessStory {
  id: number
  pet_name: string
  before_image: string
  after_image: string
  story_text: string
  adopter_name: string
  created_at: string
}

export interface Notification {
  id: number
  user_id: string
  application_id: number
  message: string
  is_read: boolean
  created_at: string
  application?: AdoptionApplication
}

export interface PetFilters {
  species_id?: number
  age_min?: number
  age_max?: number
  size?: PetSize
}
