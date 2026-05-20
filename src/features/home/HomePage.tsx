import HeroSection from './HeroSection'
import SearchBar from './SearchBar'
import SuccessStoriesScroll from './SuccessStoriesScroll'
import ShelterWall from './ShelterWall'
import FooterCTA from './FooterCTA'
import PetCardGrid from '@/features/pets/PetCardGrid'
import { usePets } from '@/features/pets/usePets'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'

export default function HomePage() {
  const { data: pets, isLoading, error, refetch } = usePets()

  return (
    <>
      <HeroSection />
      <SearchBar />
      <section className="py-16 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-earth-700 text-center mb-8">等待领养的可爱伙伴</h2>
          {isLoading && <LoadingState rows={1} cols={4} />}
          {error && <ErrorState message="加载宠物列表失败" onRetry={() => refetch()} />}
          {pets && <PetCardGrid pets={pets.slice(0, 4)} />}
        </div>
      </section>
      <SuccessStoriesScroll />
      <ShelterWall />
      <FooterCTA />
    </>
  )
}
