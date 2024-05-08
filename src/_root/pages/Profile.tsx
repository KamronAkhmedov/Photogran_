import GridPostList from '@/components/shared/GridPostList'
import { Button } from '@/components/ui/button'
import { useUserContext } from '@/context/AuthContext'
import { useGetUserById, useGetUserPosts } from '@/lib/react-query/queriesAndMutations'
import { Link, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import LikedPosts from './LikedPosts'
import { useToast } from '@/components/ui/use-toast'
import PokemonLoader from '@/components/shared/PokemonLoader'

const Profile = () => {
  const { id } = useParams()
  const { user } = useUserContext()
  const { pathname } = useLocation()
  const { toast } = useToast()

  const { data: currentUser, isLoading: loadingUser } = useGetUserById(id || '')
  const { data: posts, isLoading: loadingPosts } = useGetUserPosts(id || '')

  if (loadingPosts || loadingUser || !posts) {
    return (
      <div className='flex-center w-full h-hull'>
        <PokemonLoader />
      </div>
    )

  }

  const handleFollow = () => {
    toast({ title: 'Will be added soon' })
  }

  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <div className='flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7'>
          <img
            src={currentUser?.imageUrl || '/assets/images/profile.jpg'}
            alt="profile img"
            className='w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover'
          />

          <div className='flex flex-col  flex-1 justify-between md:mt-2  '>
            <div className='flex flex-col w-full'>
              <h1 className='text-center xl:text-left h3-bold md:h1-semibold w-full'>
                {currentUser?.name}
              </h1>

              <p className='small-regular md:body-medium text-light-3 text-center xl:text-left'>
                @{currentUser?.username}
              </p>

            </div>

            {currentUser?.bio && (
              <p className='small-medium md:base-medium text-center xl:text-left mt-5 max-w-screen-sm'>
                {currentUser?.bio}
              </p>
            )}
          </div>

          <div className='flex justify-center gap-4 mt-2'>
            <div className={`${user.id !== currentUser?.accountId && 'hidden'}`}>
              <Link
                to={`/update-profile/${currentUser?.accountId}`}
                className={`h-12 bg-dark-4 hover:bg-dark-3 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser?.accountId && 'hidden'}`}
              >
                <img
                  src='/assets/icons/edit.svg'
                  alt="edit"
                  width={26}
                  height={26}
                />
                <p className='flex whitespace-nowrap small-medium'>
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && 'hidden'}`}>
              <Button
                type='button'
                className='shad-button_primary py-[23px] px-8 '
                onClick={() => handleFollow()}
              >
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser?.accountId === user.id && (
        <div className='flex max-w-5xl w-full'>
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && '!bg-dark-3'}`}
          >
            <img
              src='/assets/icons/posts.svg'
              alt="like"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && '!bg-dark-3'}`}
          >
            <img
              src="/assets/icons/like.svg"
              alt="like"
              width={27}
              height={27}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={posts} showUser={false} showPostLength={true} />}
        />
        {currentUser?.accountId === user.id && (
          <Route path='/liked-posts' element={<LikedPosts userId={user.id} />} />
        )}
      </Routes>
      <Outlet />
    </div>
  )
}

export default Profile