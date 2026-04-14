import PerfilFeminino from "../assets/perfil-feminino.png";

import { useSelector } from "react-redux";

//import { useDispatch } from "react-redux";
//import { logout } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";


export default function Perfil() {

  //const dispatch = useDispatch();
  const navigate = useNavigate();

  /* function handleLogout(){
    dispatch(logout());//limpa usuario do Redux
    // dispatch(resetSubscription());//limpa dados do usuario do Redux
    localStorage.removeItem("appState"); //limpa localStorage
    
    navigate("/")
  } */

  function handleUser(){
    
    
    navigate("/home");
  }

  const user = useSelector(state => state.user);
  // const subscription = useSelector(state => state.subscription);

  // console.log("USER:",user);
  // console.log("SUBSCRIPTION",subscription);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1f2a44] to-black text-white">

  
     {/*  <Button onClick={handleLogout} className="absolute top-4 right-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">
        Sair da conta
      </Button> */}
    

      {/* TÃTULO */}
      <h1 className="text-2xl font-semibold mb-10">
        Quem vai assistir?
      </h1>

      {/* <p className="mb-6 text-gray-300">
        UsuÃ¡rio: {user.nome} ({user.email})
      </p> */}

      {/* <p className="mb-6 text-gray-300">
        Plano: {user.assinatura?.tipo_plano  || "Nenhum plano selecionado"}
      </p> */}

      {/* PERFIL */}
      <div onClick={handleUser} className="flex gap-10 flex-wrap justify-center">
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-purple-500 transition">
            <img
              src={PerfilFeminino}
              alt={user.nome}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="mt-2 text-sm text-gray-300 group-hover:text-white">
            {user.nome}
          </p>
        </div>
      </div>

    </div>
  );
}
