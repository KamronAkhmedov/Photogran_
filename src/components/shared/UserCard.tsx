import { DocumentData } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { useUserContext } from '@/context/AuthContext'

const UserCard = ({ userData }: { userData: DocumentData }) => {
  const { user } = useUserContext()

  const isCurrentUser = user.id === userData.accountId

  return (
    <Link to={`/profile/${userData.accountId}`} className='user-card hover:bg-dark-3'>
      <img src={userData.imageUrl || '/assets/images/profile.jpg'} alt="creator" className='rounded-full w-14 h-14 object-cover' />

      <div className='flex-center flex-col gap-1'>
        <p className='base-medium text-light-1 text-center line-clamp-1'>
          {userData.name}
        </p>
        <p className='small-regular text-light-3 text-center line-clamp-1'>
          @{userData.username}
        </p>
      </div>

      <Button
        type='button'
        size='sm'
        className={`shad-button_primary px-5 ${isCurrentUser && '!invisible'} `}>
        Follow
      </Button>
    </Link>
  )
}

export default UserCard