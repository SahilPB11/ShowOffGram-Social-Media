import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce";
import { useGetPost, useSearchPosts } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
    const { ref, inView } = useInView();
    const { data: posts, fetchNextPage, hasNextPage } = useGetPost();


    const [searchValue, setSearchValue] = useState('');
    const deBounceValue = useDebounce(searchValue, 500);
    const { data: searchedPosts, isFetching: isSearchfetching } = useSearchPosts(deBounceValue);
    useEffect(() => {
        if (inView && !searchValue) fetchNextPage();
    }, [inView, searchValue])

    if (!posts) {
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        )
    }

    const shouldshowSearchResults = searchValue !== '';
    const shouldShowPosts = !shouldshowSearchResults && posts?.pages?.every((item) => item?.documents?.length === 0)

    // on this page we are shoeing all post by all uses also we have search input in that u can find specific post so here we are exploring
    return (
        <div className="explore-container">
            <div className="explore-inner_container">
                <h3 className="h3-bold md:h2 bold w-full">Sarch Post</h3>
                <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
                    <img src="/assets/icons/search.svg" alt="search" height={24} width={24} />

                    <Input
                        type="text"
                        placeholder="Search"
                        className="explore-search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-between w-full max-w-5xl mt-16 mb-7">
                <h3 className="body-bold md:h3-bold">Popular Today</h3>
                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base-medium text-light-2">All</p>
                    <img src="/assets/icons/filter.svg" height={20} width={20} alt="filter" />
                </div>
            </div>
            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {shouldshowSearchResults ? (
                    <SearchResults
                        isSearchfetching={isSearchfetching}
                        searchedPosts={searchedPosts}
                    />
                ) : shouldShowPosts ? (
                    <p className="text-light-4 mt-10 text-center w-full">End Of Bottom</p>
                ) : posts.pages.map((item, index) => (
                    <GridPostList key={`page-${index}`} posts={item?.documents} />
                ))}
            </div>

            {hasNextPage && !searchValue && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Explore