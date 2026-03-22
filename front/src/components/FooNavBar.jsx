import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { TbHomeFilled } from "react-icons/tb";
import { FaInstagram, FaXTwitter} from "react-icons/fa6";
import { FaYoutube, FaFacebook } from "react-icons/fa";

function FooNavBar() {
    return (
      <>
      <div className='md:hidden fixed bottom-0 left-0 right-0 z-50'>
        <footer className='flex items-center justify-around bg-[#0d1117]/95 backdrop-blur-lg text-white/50 border-t border-white/10 pt-3 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]'>
        <div className='flex flex-col items-center cursor-pointer group'>
          <TbHomeFilled className='text-purple-600 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all' />
          <span className='text-[10px] mt-1 text-purple-500 font-bold'>Início</span>
        </div>
        
        <div className='flex flex-col items-center cursor-pointer group hover:text-white transition-all'>
          <IoMdAdd className='text-2xl' />
          <span className='text-[10px] mt-1'>Minha lista</span>
        </div>
        
        <div className='flex flex-col items-center cursor-pointer group hover:text-white transition-all'>
          <MdOutlineFileDownload className='text-2xl' />
          <span className='text-[10px] mt-1'>Salvos</span>
        </div>
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