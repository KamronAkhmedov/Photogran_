import { DocumentData } from 'firebase/firestore'
import Loader from './Loader'
import GridPostList from './GridPostList'

type searchedPostsProps = {
  isSearchFetching: boolean
  searchedPosts: DocumentData[]
}

const SearchResults = ({ isSearchFetching, searchedPosts }: searchedPostsProps) => {
  if (isSearchFetching) return <Loader />

  console.log(searchedPosts);


  if (searchedPosts && searchedPosts.length > 0) {
    return (
      <GridPostList posts={searchedPosts} />
    )
  }

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchResults