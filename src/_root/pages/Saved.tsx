import GridPostList from '@/components/shared/GridPostList'
import PokemonLoader from '@/components/shared/PokemonLoader'
import { useUserContext } from '@/context/AuthContext'
import { useGetSavedPosts } from '@/lib/react-query/queriesAndMutations'

const Saved = () => {
  const { user } = useUserContext()

  const { data: savedPosts, isLoading } = useGetSavedPosts(user.id)

  return (
    <div className='saved-container'>
      <div className='flex gap-2 w-full max-w-5xl'>
        <img
          src='/assets/icons/save.svg'
          alt="save"
          width={36}
          height={36}
          className='invert-white'
        />
        <h2 className='h3-bold md:h2-bold text-left w-full'>Saved Posts</h2>
      </div>

      {isLoading ? (
        <PokemonLoader />
      ) : (
        <ul className='w-full flex justify-center max-w-5xl gap-9'>
          {savedPosts?.length === 0 ? (
            <p className='text-light-4'>No saved posts yet</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  )
}

export default Saved