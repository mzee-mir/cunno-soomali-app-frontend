import landing from '../assets/landing.png'
import playstore from '../assets/appDownload.png'
import { useNavigate } from 'react-router-dom';
import SearchBar, { SearchForm } from '@/components/SearchBar';

const HomePage=() => {
  const navigate = useNavigate();
  const handleSearchSubmit = (searchFormValue:SearchForm)=> {
    navigate({
      pathname:`/search/${searchFormValue.searchQuery}`,
    });
  }
  return (
    <div className='flex flex-col gap-12'>
        <div className='md:px-32 bg-white rounded-lg shadow-md py-10 flex flex-col text-center -mt-16'>
            <h1 className='text-5xl font-bold tracking-tight text-blue-600 mb-4'> Kacun meel waliba aad joogto cunno Somali ah.</h1>
            <span className='text-xl mb-4' > Hadaba maxaad sugaysaa! </span>
            <SearchBar placeHolder="Search by City or Town" onSubmit={handleSearchSubmit} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
        <img src={landing} alt=""/>
        
        <div className='flex flex-col items-center justify-center gap-4 text-center'>
            <span className='font-bold text-3xl tracking-tighter'>Dhaqso dalbo</span>
            <span> la soodag App-ka si aad cunadaada u hesho dhaqso</span>
            <img src={playstore} alt="" />
            </div>
        </div>
    </div>
  )
}
export default HomePage;