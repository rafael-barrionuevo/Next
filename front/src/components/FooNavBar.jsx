import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { TbHomeFilled } from "react-icons/tb";

function FooNavBar() {
    return (
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
    )
}

export default FooNavBar