import PokemonLoader from '@/components/shared/PokemonLoader'
import PostStats from '@/components/shared/PostStats'
import { Button } from '@/components/ui/button'
import { useUserContext } from '@/context/AuthContext'
import { useDeletePost, useGetPostById, useGetUserById } from '@/lib/react-query/queriesAndMutations'
import { timeAgo } from '@/lib/utils'
import { Link, useNavigate, useParams } from 'react-router-dom'

const PostDetails = () => {
  const { id } = useParams()
  if (!id) throw Error
  const navigate = useNavigate()

  const { data: post, isPending: postLoading } = useGetPostById(id)
  const { data: userData, isPending: userLoading } = useGetUserById(post?.creator)
  const { mutate: deletePost } = useDeletePost()
  const { user } = useUserContext()

  if (postLoading || userLoading || !userData || !post) {
    return (
      <div className='flex w-full h-full flex-center'>
        <PokemonLoader />
      </div>
    )
  }

  if (!userData) {
    return null
  }

  const handleDeletePost = () => {
    deletePost({ postId: id, imagePath: post?.imagePath })
    navigate(-1)
  }

  return (
    <div className='post_details-container'>
      <div className='post_details-card'>
        <img
          src={post?.imageUrl}
          alt="image"
          className='post_details-img'
        />
        <div className='post_details-info'>
          <div className='flex-between w-full'>

            <Link to={`/profile/${post?.creator}`} className='flex items-center gap-3'>
              <img src={userData?.imageUrl || '/assets/images/profile.jpg'} alt="user photo" className='rounded-full w-9 h-9 lg:h-12 lg:w-12 object-cover' />

              <div className='flex flex-col'>
                <p className='base-medium lg:body-bold text-light-1'>
                  {userData?.username}
                </p>

                <div className='flex-center gap-2 text-light-3'>
                  <p className='subtle-semibold lg:small-regular'>
                    {timeAgo(post?.createdAt.seconds)}
                  </p>
                  -
                  <p className='subtle-semibold lg:small-regular'>
                    {post?.location}
                  </p>
                </div>
              </div>
            </Link>

            <div className='flex-center gap-1'>
              <Link
                to={`/update-post/${post?.postId}`}
                className={`brightness-50 hover:filter-none ${user.id !== post?.creator ? 'hidden' : ''}`}
              >
                <img src="/assets/icons/edit.svg" width={30} />
              </Link>

              <Button
                onClick={handleDeletePost}
                variant='ghost'
                className={`ghost_details-delete_btn brightness-50 hover:filter-none ${user.id !== post?.creator && 'hidden'}`}
              >
                <img
                  src="/assets/icons/delete.svg"
                  alt="delete svg"
                  width={36} />
              </Button>
            </div>
          </div>

          <hr className='border w-full border-dark-4/70' />

          <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
            <p>{post?.caption}</p>
            <ul className='flex gap-1 mt-2'>
              {post?.tags?.map((tag: string) => (
                <li key={tag} className='text-light-3'>
                  #{tag}
                </li>
              ))}
            </ul>
          </div>

          <div className='w-full'>
            <PostStats post={post} userId={user.id} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default PostDetails