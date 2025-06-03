import landing from '../assets/landing.png';
import playstore from '../assets/appDownload.png';
import { useNavigate } from 'react-router-dom';
import SearchBar, { SearchForm } from '@/components/SearchBar';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleSearchSubmit = (searchFormValue: SearchForm) => {
        navigate({
            pathname: `/search/${searchFormValue.searchQuery}`,
        });
    };

    return (
        <div className='flex flex-col gap-12 bg-background text-foreground'>
            <div className='md:px-32 bg-card rounded-lg shadow-md py-10 flex flex-col text-center -mt-16 border-border'>
                <h1 className='text-5xl font-bold tracking-tight text-primary mb-4'>
                    {t("homePage.title")}
                </h1>
                <span className='text-xl mb-4 text-muted-foreground'>
                    {t("homePage.subtitle")}
                </span>
                <SearchBar 
                    placeHolder={t("homePage.searchPlaceholder")} 
                    onSubmit={handleSearchSubmit} 
                />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                <img 
                    src={landing} 
                    alt="Landing visual" 
                    className="rounded-lg border-border menu-item-image"
                />
                
                <div className='flex flex-col items-center justify-center gap-4 text-center border-border'>
                    <span className='font-bold text-3xl tracking-tighter text-primary'>
                        {t("homePage.appSection.title")}
                    </span>
                    <span className='text-muted-foreground'>
                        {t("homePage.appSection.subtitle")}
                    </span>
                    <img 
                        src={playstore} 
                        alt="Download from Play Store" 
                        className="menu-item-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;