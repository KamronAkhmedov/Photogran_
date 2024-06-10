import { DocumentData } from 'firebase/firestore'
import GridPostList from './GridPostList'
import PokemonLoader from './PokemonLoader'

type searchedPostsProps = {
  isSearchFetching: boolean
  searchedPosts: DocumentData | undefined
}

const SearchResults = ({ isSearchFetching, searchedPosts }: searchedPostsProps) => {
  if (isSearchFetching) return <PokemonLoader />

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