import PokemonLoader from '@/components/shared/PokemonLoader'
import UserCard from '@/components/shared/UserCard'
import { useToast } from '@/components/ui/use-toast'
import { useGetUsers } from '@/lib/react-query/queriesAndMutations'

const AllUsers = () => {
  const { toast } = useToast()

  const { data: creators, isLoading, isError } = useGetUsers(20)

  if (isError) {
    toast({ title: 'Something went wrong' })

    return
  }

  return (
    <div className='common-container'>
      <div className='user-container'>
        <h2 className='h3-bold md:h2-bold text-left w-full'>All Creators </h2>
        {isLoading && !creators ? (
          <PokemonLoader />
        ) : (
          <ul className='user-grid'>
            {creators?.map(creator => (
              <li key={creator.accountId} className='flex-1 min-w-[200px] w-full'>
                <UserCard userData={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AllUsers