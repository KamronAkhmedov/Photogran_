import PostForm from '@/components/forms/PostForm'
import PokemonLoader from '@/components/shared/PokemonLoader'
import { useGetPostById } from '@/lib/react-query/queriesAndMutations'
import { useParams } from 'react-router-dom'

const EditPost = () => {
  const { id } = useParams()
  if (!id) throw new Error('post is not found')

  const { data: post, isPending } = useGetPostById(id)

  if (isPending) return (
    <div className='flex w-full h-full flex-center'>
      <PokemonLoader />
    </div>
  )

  return (
    <div className='flex flex-1'>
      <div className="common-container">
        <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
          <img src="/assets/icons/add-post.svg" alt="add-post icon" width={36} height={36} />

          <h2 className='h33-bold md:h2-bold text-left w-full'>Create Post</h2>
        </div>

        <PostForm action='Update' post={post} postId={id} />
      </div>
    </div>
  )
}

export default EditPost