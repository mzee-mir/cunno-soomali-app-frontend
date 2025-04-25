import { useSearchRestaurants } from "@/api/RestaurentApi";
import CuisineFilter from "@/components/CuinesFilter";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultsInfo from "@/components/searchResdultsInfo";
import SearchResultsCard from "@/components/SearchResultsCard";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState = {
    searchQuery: string;
    page: number;
    selectedCuisines: string[];
    sortOption: string;
  };

const SearchPage =() => {
    const {city} = useParams();
    const [searchState, setSearchState] = useState<SearchState>({
        searchQuery:"",
        page: 1,
        selectedCuisines: [],
        sortOption: 'bestMatch',
    });

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const {results, isLoading } = useSearchRestaurants(searchState, city);

    const setSelectedCuisines = (selectedCuisines:string[]) => {
        setSearchState((prevState) => ({
            ...prevState,
            selectedCuisines,
            page:1,

        }))
    }
    const setSortOption = (sortOption:string) => {
        setSearchState((prevState) => ({
            ...prevState,
            sortOption,
            page:1,

        }))
    }

    const setPage = (page:number) => {
         setSearchState((prevState) => ({
            ...prevState,
            page,
        }));
    };
    const setSearchQuery = (searchFormData: SearchForm) => {
        setSearchState((prevState)=> ({
            ...prevState,
            searchQuery: searchFormData.searchQuery,
            page: 1,
        }));
    }

    const resetSearch = () => {
        setSearchState((prevState)=> ({
            ...prevState,
            searchQuery: "",
            page: 1,
        }));
    }

if(!results?.data || !city){
    return <span>No Results Found</span>;
}

if(isLoading){
    return <span>No Results Found</span>;
}
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5" >
            <div id="cuisines-list" > 
            <CuisineFilter
            isExpanded={isExpanded}
            onExpandedClick={() => setIsExpanded((prevIsExpanded)=> !prevIsExpanded)} 
            selectedCuisines={searchState.selectedCuisines} 
            onChange={setSelectedCuisines}
            />    
            </div>
            <div id="main-content" className="flex flex-col gap-5" >
                <SearchBar 
                searchQuery={searchState.searchQuery}
                onSubmit={setSearchQuery} placeHolder="search by cuisine or restaurant name" 
                onReset={resetSearch} />
                <div className="flex justify-between flex-col gap-3 lg:flex-row" >
                <SearchResultsInfo total={results.pagination.total} city={city} />
                <SortOptionDropdown 
                    sortOption={searchState.sortOption} onChange={(value)=> setSortOption(value)} />
                </div>
                {results.data.map((restaurant) => (
                    <SearchResultsCard key={restaurant._id} restaurant={restaurant} />
                    
                ))}
                <PaginationSelector 
                page={results.pagination.page} 
                pages={results.pagination.pages} onPageChange={setPage} />
            </div>
        </div>
    )
}

export default SearchPage;