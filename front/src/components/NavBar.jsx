import { IoMdSearch } from "react-icons/io";
import { PiScreencastBold } from "react-icons/pi";
import { IoNotificationsOutline, IoChevronDownOutline } from "react-icons/io5";
import { Link } from "react-router-dom"; // Importante usar Link para não resetar o Redux
import { useSelector } from "react-redux";
import logo from '../assets/logo.png';

function NavBar() {
  const user = useSelector(state => state.user);

  console.log("Dados do usuário no Redux:", user);
  console.log("Role atual:", user.role);
  return (
    <nav className='bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5'>
      
      {/* MOBILE */}
      <div className='md:hidden flex flex-col'>
        <div className='flex justify-between items-center px-6 py-4'>
          <img src={logo} alt="Next Logo" className='w-20'/>
          <div className="flex items-center gap-4">
            <IoMdSearch className='text-2xl text-white/70 hover:text-purple-500 cursor-pointer transition-colors'/>
            <PiScreencastBold className='text-2xl text-white/70 hover:text-purple-500 cursor-pointer transition-colors'/>
          </div>
        </div>
        
        <div className='flex flex-wrap justify-center gap-x-6 gap-y-2 items-center pb-4 px-4 text-sm font-medium text-white/60'>
          <a className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Filmes</a>
          <a className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Séries</a>
          <a className='hover:text-white transition-all cursor-pointer border-b-2 border-transparent hover:border-purple-600 pb-1'>Animes</a>
          {/* Admin Mobile */}
          {user.role === 'admin' && (
            <Link to="/admin" className='text-purple-500 font-bold border-b-2 border-transparent hover:border-purple-600 pb-1'>Admin</Link>
          )}
        </div>
      </div>

      {/* DESKTOP */}
      <div className='hidden md:flex w-full items-center justify-between px-8 py-4 max-w-7xl mx-auto'>
        <div className='flex items-center gap-10'>
          <img src={logo} alt="Next Logo" className='w-24'/>
          
          <div className='flex items-center gap-6 text-sm font-medium text-white/80'>
            <a className='hover:text-white transition-colors cursor-pointer'>Início</a>
            <a className='hover:text-white transition-colors cursor-pointer'>Séries</a>
            <a className='hover:text-white transition-colors cursor-pointer'>Filmes</a>
            <a className='hover:text-white transition-colors cursor-pointer'>Minha Lista</a>
          </div>
        </div>

        <div className='flex items-center gap-6 text-sm font-medium text-white/80'>
          <IoMdSearch className='text-2xl hover:text-white cursor-pointer transition-colors' />
          
          <a className='hover:text-white transition-colors cursor-pointer'>Gêneros</a>
          
          {/* PAINEL ADMIN AO LADO DAS NOTIFICACOES */}
          {user.role === 'admin' && (
            <Link 
              to="/admin" 
              className='text-purple-500 font-bold hover:text-purple-400 transition-colors'
            >
              Painel Admin
            </Link>
          )}

          <div className='relative cursor-pointer hover:text-white transition-colors'>
            <IoNotificationsOutline className='text-2xl' />
            <span className='absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
              14
            </span>
          </div>

          <div className='flex items-center gap-2 cursor-pointer group'>
            <img 
              src="https://picsum.photos/32/32?random=profile" 
              alt="Avatar do Usuário" 
              className='w-8 h-8 rounded border border-transparent group-hover:border-white transition-colors'
            />
            <IoChevronDownOutline className='text-white/80 group-hover:text-white transition-colors' />
          </div>
        </div>
      </div>

    </nav>
  )
}

export default NavBar;