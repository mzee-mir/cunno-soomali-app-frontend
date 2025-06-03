import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

type Props = {
    total: number;
    city: string;
}

const SearchResultsInfo = ({ total, city }: Props) => {
    const { t } = useTranslation();
    
    return (
        <div className="text-xl font-bold flex flex-col gap-3 justify-between lg:items-center lg:flex-row">
            <span>
            { total } {t('search.searchResults.restaurantsFound')}  { city }
                <Link 
                    to="/" 
                    className="ml-1 text-sm font-semibold underline cursor-pointer text-blue-500"
                >
                    {t('search.searchResults.changeLocation')}
                </Link>
            </span>
        </div>
    )
}

export default SearchResultsInfo;