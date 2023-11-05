import { Models } from 'appwrite'
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
    isSearchfetching: boolean;
    searchedPosts: Models.Document[];
}

const SearchResults = ({ isSearchfetching, searchedPosts }: SearchResultsProps) => {
    if (isSearchfetching) return <Loader />

    if (searchedPosts && searchedPosts?.documents?.length > 0) {
        return (
            <GridPostList posts={searchedPosts?.documents} />
        )
    }
    return (
        <p className='text-light-4 mt-10 text-center w-full'>No Results Found</p>
    )
}

export default SearchResults;