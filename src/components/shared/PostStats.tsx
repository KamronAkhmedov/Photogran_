import { hasUserSavedPost } from '@/lib/firebase/api'
import { useDeleteSavedPost, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutations'
import { checkIsLiked } from '@/lib/utils'
import { DocumentData } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'

type PostStatsProps = {
  post?: DocumentData,
  userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {

  const likesList = post?.likes.map((userId: string) => userId)

  // STATES
  const [likes, setLikes] = useState(likesList)
  const [isSaved, setIsSaved] = useState<boolean>(false)

  // QUERIES
  const { mutate: likePost } = useLikePost()
  const { mutate: savePost } = useSavePost()
  const { mutate: deleteSavedPost, isPending } = useDeleteSavedPost()

  hasUserSavedPost(userId, post?.postId || '').then((e) => {
    setIsSaved(!!e)
  }).catch((error) => {
    console.log('error checking post', error);

  })

  useEffect(() => {
    const fetchPostSaveStatus = async () => {
      const savedStatus = await hasUserSavedPost(userId, post?.postId)
      setIsSaved(!!savedStatus)

    }

    fetchPostSaveStatus()
  }, [userId, post?.postId])


  // LIKE POST
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    let newLikes = [...likes || '']

    const hasLiked = newLikes.includes(userId)

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId)
    } else {
      newLikes.push(userId)
    }

    setLikes(newLikes)
    likePost({ postId: post?.postId || '', likesArray: newLikes })
  }

  // SAVE POST
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    setIsSaved(prevSaved => !prevSaved)

    if (isSaved) {
      deleteSavedPost({ postId: post?.postId || '', userId })

    } else {
      savePost({ postId: post?.postId || '', userId: post?.userId || '', currentUser: userId })
    }
  }



  return (
    <div className={`flex justify-between items-center z-20 $`}>
      <div className='flex gap-1 mr-5 items-center'>
        <img src={checkIsLiked(likes, userId)
          ? '/assets/icons/liked.svg'
          : '/assets/icons/like.svg'}
          alt="like"
          width={31}
          height={31}
          onClick={(e) => { handleLikePost(e) }}
          className='cursor-pointer' />
        <p className='small-medium lg:base-medium'>{likes?.length}</p>
      </div>

      <div className='flex gap-2'>
        <img src={isSaved
          ? '/assets/icons/saved.svg'
          : '/assets/icons/bookmark.svg'
        }
          alt="like"
          width={25}
          height={33}
          onClick={(e) => { handleSavePost(e) }}
          className='cursor-pointer' />
      </div>
    </div>
  )
}

export default PostStats