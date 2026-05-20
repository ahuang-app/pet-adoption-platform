import { useParams } from 'react-router-dom'
import { usePet } from '@/features/pets/usePets'
import ApplicationForm from './ApplicationForm'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'

export default function AdoptPage() {
  const { petId } = useParams<{ petId: string }>()
  const { data: pet, isLoading, error } = usePet(petId ? Number(petId) : undefined)

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-16"><LoadingState rows={1} cols={1} /></div>
  if (error || !pet) return <div className="max-w-2xl mx-auto px-4 py-16"><ErrorState message="宠物信息加载失败" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex gap-6 mb-8 p-4 bg-white rounded-2xl shadow-sm">
        <img src={pet.image_url} alt={pet.name} className="w-24 h-24 object-cover rounded-xl" />
        <div>
          <h2 className="font-bold text-lg text-earth-700">{pet.name}</h2>
          <p className="text-earth-400 text-sm">{pet.breed?.name ?? pet.species?.name}</p>
          <p className="text-earth-400 text-sm">{pet.shelter_info}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <ApplicationForm petId={pet.id} petName={pet.name} />
      </div>
    </div>
  )
}
