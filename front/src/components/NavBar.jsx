import { IoMdSearch } from "react-icons/io";
import { PiScreencastBold } from "react-icons/pi";

function NavBar() {
  return (
    <>
      <nav className='flex items-center
        flex-col bg-slate-900 text-gray-200 font-bold '>
        <div className='justify-between flex w-full p-4'>
          <p className=''>Next</p>
          <p className=''>
            <PiScreencastBold className='text-2xl'/>
          </p>
        </div>
        <div className='bg-slate-800 flex justify-around w-full p-2'>
          <a className='flex items-center gap-2'>
            <IoMdSearch className='text-2xl'/>
          </a>
          <a className=''>Filmes</a>
          <a className=''>Séries</a>
          <a className=''>Animes</a>
        </div>
      </nav>
    </>
  )
}
export default NavBar