import PokemonLoader from "@/components/shared/PokemonLoader";
import PostCard from "@/components/shared/PostCard";
import { getUser } from "@/lib/firebase/api";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations"
import { IRecentPost } from "@/types";
import { useEffect, useState } from "react";




const Home = () => {
  const [post, setPost] = useState<IRecentPost[]>([])

  const { data: posts, isPending: isPostLoading, isError } = useGetRecentPosts()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (posts) {
          const promises = posts.map(async (post: IRecentPost) => {

            const userData = await getUser(post.creator)

            if (userData) {
              const posts: IRecentPost = {
                postId: post.postId,
                creator: post.creator,
                caption: post.caption,
                location: post.location,
                imagePath: post.imagePath,
                imageUrl: post.imageUrl,
                tags: post.tags,
                likes: post.likes,
                createdAt: post.createdAt,
                name: userData.name,
                username: userData.username,
                userImage: userData.imageUrl,
              }
              return posts
            }
            return null
          })

          const resolvedPosts = await Promise.all(promises)

          const filteredPosts = resolvedPosts.filter((post) => post !== null) as IRecentPost[]


          setPost(filteredPosts)
        }

      } catch (error) {
        console.log(error);

      }
    }

    fetchData()
  }, [posts])

  if (isError) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">
            Something went wrong 🤔
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Home Feed
          </h2>
          {isPostLoading || !post ? (
            <PokemonLoader />
          ) : (
            <ul className="flex flex-1 flex-col gap-9 w-full">
              {post?.map((post: IRecentPost) => (
                <PostCard post={post} key={post.postId} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
