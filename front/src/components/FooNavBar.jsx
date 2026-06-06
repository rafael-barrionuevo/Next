import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { TbHomeFilled } from "react-icons/tb";
import { FaInstagram, FaXTwitter} from "react-icons/fa6";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function FooNavBar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (
      <>
      <div className='fixed inset-x-0 bottom-0 z-50 md:hidden'>
        <footer className='flex items-center justify-around bg-slate-900/95 backdrop-blur-lg text-white/50 border-t border-white/10 pt-3 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]'>
        <Link to="/home" className='group flex cursor-pointer flex-col items-center transition-all'>
          <TbHomeFilled className={`text-2xl transition-all group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] ${isActive('/home') ? 'text-purple-500' : 'text-white/50 group-hover:text-white'}`} />
          <span className={`mt-1 text-[10px] font-bold transition-colors ${isActive('/home') ? 'text-purple-500' : 'text-white/50 group-hover:text-white'}`}>Início</span>
        </Link>
        
        <Link to="/wishList" className='group flex cursor-pointer flex-col items-center transition-all'>
          <IoMdAdd className={`text-2xl transition-all group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] ${isActive('/wishList') ? 'text-purple-500 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]' : 'text-white/50 group-hover:text-white'}`} />
          <span className={`mt-1 text-[10px] font-bold transition-colors ${isActive('/wishList') ? 'text-purple-500' : 'text-white/50 group-hover:text-white'}`}>Minha lista</span>
        </Link>
        
        <Link to="/downloads" className='group flex cursor-pointer flex-col items-center transition-all'>
          <MdOutlineFileDownload className={`text-2xl transition-all group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] ${isActive('/downloads') ? 'text-purple-500 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]' : 'text-white/50 group-hover:text-white'}`} />
          <span className={`mt-1 text-[10px] font-bold transition-colors ${isActive('/downloads') ? 'text-purple-500' : 'text-white/50 group-hover:text-white'}`}>Downloads</span>
        </Link>
      </footer>
    </div>
    <footer className='hidden md:block relative z-10 max-w-7xl mx-auto w-full px-8 mt-20 pb-10 text-gray-400 text-sm'>
        <div className='flex gap-6 mb-6'>
          {}
          <span className='cursor-pointer hover:text-white'><FaFacebook /></span>
          <span className='cursor-pointer hover:text-white'><FaInstagram /></span>
          <span className='cursor-pointer hover:text-white'><FaXTwitter /></span>
          <span className='cursor-pointer hover:text-white'><FaYoutube /></span>
        </div>
        <div className='grid grid-cols-4 gap-4 mb-6'>
          <a href="#" className='hover:underline'>Audiodescrição</a>
          <a href="#" className='hover:underline'>Central de ajuda</a>
          <a href="#" className='hover:underline'>Cartão pré-pago</a>
          <a href="#" className='hover:underline'>Imprensa</a>
          <a href="#" className='hover:underline'>Relação com investidores</a>
          <a href="#" className='hover:underline'>Carreiras</a>
          <a href="#" className='hover:underline'>Termos de uso</a>
          <a href="#" className='hover:underline'>Privacidade</a>
          <a href="#" className='hover:underline'>Avisos legais</a>
          <a href="#" className='hover:underline'>Preferências de cookies</a>
          <a href="#" className='hover:underline'>Informações corporativas</a>
          <a href="#" className='hover:underline'>Entre em contato</a>
        </div>
        <p className='text-xs text-gray-500'>© 2026 Next, Inc.</p>
      </footer>
    </>
    )
}

export default FooNavBar