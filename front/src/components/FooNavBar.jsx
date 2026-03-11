import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { TbHomeFilled } from "react-icons/tb";

function FooNavBar() {
    return (
      <footer className='flex items-center justify-around bg-slate-800 text-gray-200 rounded-t-2xl pt-4'>
        <div className='flex flex-col items-center'>
          <TbHomeFilled className='text-violet-600 text-2xl' />
          <a href='#' className=''>Início</a>
        </div>
        <div className='flex flex-col items-center'>
          <IoMdAdd className='text-white text-2xl'/>
          <a href='#' className=''>Minha lista</a>
        </div>
        <div className='flex flex-col items-center '>
          <MdOutlineFileDownload className='text-white text-2xl'/>
          <a href='#' className=''>Salvos</a>
        </div>
      </footer>
    )
}
export default FooNavBar