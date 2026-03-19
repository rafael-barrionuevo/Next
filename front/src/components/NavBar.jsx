import { IoMdSearch } from "react-icons/io";
import { PiScreencastBold } from "react-icons/pi";
import logo from '../assets/logo.png';
function NavBar() {
  return (
    <nav className='flex flex-col bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5'>
      <div className='flex justify-between items-center px-6 py-4'>
        <img src={logo} alt="Next Logo" className='w-20'/>
        <PiScreencastBold className='text-2xl text-white/70 hover:text-purple-500 cursor-pointer transition-colors'/>
      </div>
      
      <div className='flex justify-around items-center py-2 text-sm font-medium text-white/60'>
        <a className='hover:text-purple-500 transition-colors cursor-pointer'><IoMdSearch className='text-2xl'/></a>
        <a className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Filmes</a>
        <a className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Séries</a>
        <a className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Animes</a>
      </div>
    </nav>
  )
}

export default NavBar;