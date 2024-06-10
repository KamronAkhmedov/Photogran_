import { useUserContext } from '@/context/AuthContext'
import { db } from '@/lib/firebase/config'
import { DocumentData, doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import { IPost } from '@/types'

type Propsdata = {
  posts: DocumentData
  showUser?: boolean
  showStats?: boolean
  showPostLength?: boolean
  showInfo?: boolean
}

const GridPostList = ({ posts, showUser = true, showStats = true, showPostLength = false, showInfo = true }: Propsdata) => {
  const { user } = useUserContext()
  const [userData, setUserData] = useState<DocumentData>([])

  useEffect(() => {
    const fetchUsersData = async () => {
      const userDataPromises = posts.map(async (post: DocumentData) => {
        const userDocRef = doc(db, 'users', post.creator)
        const userDocSnapshot = await getDoc(userDocRef)
        return userDocSnapshot.data()
      })

      const resolvedUserData = await Promise.all(userDataPromises)
      setUserData(resolvedUserData)
    }

    fetchUsersData()
  }, [posts])

  if (posts.length <= 0) {
    return (
      <>
        {showInfo && (
          <div className='h-full w-full flex flex-col items-center mt-10 ' >
            <img
              src="/assets/icons/noPost.svg"
              alt="No post"
              width={50}
            />
            <p className='h2-bold text-center'>
              No posts yet
            </p>
          </div>

        )}
      </>
    )
  }


  return (
    <div>
      {showPostLength && (
        <p className='h3-bold text-left w-full px-5 mb-5'>
          {posts.length} posts
        </p>
      )}
      <ul className='grid-container'>
        {posts.map((post: IPost, index: number) =>
          <li key={post.postId} className='relative min-w-80 h-80 hover:scale-105 transition duration-300'>
            <Link to={`/posts/${post.postId}`} className='grid-post_link'>
              <img src={post.imageUrl} className='h-full w-full object-cover' />
            </Link>

            <div className='grid-post_user'>
              {showUser && userData[index] && (
                <div className='flex flex-center gap-2'>
                  <img
                    src={userData[index]?.imageUrl || '/assets/images/profile.jpg'}
                    className='h-10 w-10 rounded-full'
                  />
                  <p className='line-clamp-1'>{userData[index]?.name}</p>
                </div>
              )}
              {showStats && userData[index] && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default GridPostList