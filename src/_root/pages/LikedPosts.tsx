import GridPostList from '@/components/shared/GridPostList'
import PokemonLoader from '@/components/shared/PokemonLoader'
import { useGetLikedPosts } from '@/lib/react-query/queriesAndMutations'
import { DocumentData } from 'firebase/firestore'

const LikedPosts = ({ userId }: { userId: string }) => {
  const { data: posts = [], isLoading } = useGetLikedPosts(userId)

  if (isLoading) {
    return (
      <div className='flex-center w-full h-full'>
        <PokemonLoader />
      </div>
    )
  }

  const documentPosts: DocumentData[] = posts

  return (
    <>
      <GridPostList posts={documentPosts} showStats={false} />
    </>
  )
}

export default LikedPosts