import landing from '../assets/landing.png';
import playstore from '../assets/appDownload.png';
import { useNavigate } from 'react-router-dom';
import SearchBar, { SearchForm } from '@/components/SearchBar';

const HomePage = () => {
  const navigate = useNavigate();
  const handleSearchSubmit = (searchFormValue: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValue.searchQuery}`,
    });
  };

  return (
    <div className='flex flex-col gap-12 bg-background text-foreground'>
      {/* Main search card - uses card variables */}
      <div className='md:px-32 bg-card rounded-lg shadow-md py-10 flex flex-col text-center -mt-16 border-border'>
        <h1 className='text-5xl font-bold tracking-tight text-primary mb-4'>
          Kacun meel waliba aad joogto cunno Somali ah.
        </h1>
        <span className='text-xl mb-4 text-muted-foreground'>
          Hadaba maxaad sugaysaa!
        </span>
        <SearchBar 
          placeHolder="Search by City or Town" 
          onSubmit={handleSearchSubmit} 

        />
      </div>

      {/* Image and app download section */}
      <div className="grid md:grid-cols-2 gap-5">
        <img 
          src={landing} 
          alt="Landing visual" 
          className="rounded-lg border-border menu-item-image" // Adds hover effect from global CSS
        />
        
        <div className='flex flex-col items-center justify-center gap-4 text-center border-border'>
          <span className='font-bold text-3xl tracking-tighter text-primary'>
            Dhaqso dalbo
          </span>
          <span className='text-muted-foreground'>
            la soodag App-ka si aad cunadaada u hesho dhaqso
          </span>
          <img 
            src={playstore} 
            alt="Download from Play Store" 
            className="menu-item-image" // Adds hover effect
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;