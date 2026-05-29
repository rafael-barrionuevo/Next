import Button from "../components/button";
import InputField from "../components/inputField";
import { Link } from "react-router-dom";
import Logo from "../assets/LogoNext.png";
import posterImages from "../constants/posterImages";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../store/userSlice.js";
import { useState } from "react";

export default function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState(""); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogin(e){
     e.preventDefault();

    //  console.log("1 - entrou");

    const result = await dispatch(loginUsuario({ email, senha }));


    console.log("2 - result:", result);
    
    
    if (result.type === "user/loginUsuario/fulfilled") {
      console.log("3 - sucesso");
      navigate("/perfil");
    }else{
      console.log("4 - erro:", result.payload);
      alert(result.payload);
    }
  };


  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 pb-24">

     {/* FUNDO PADRAO */}
<div className="absolute inset-0 overflow-hidden">

  {/* MOBILE */}
  <div className="absolute inset-0 flex items-center justify-center md:hidden">
    <div className="grid grid-cols-4 gap-2 rotate-12 scale-125">
      {posterImages.map((img, index) => (
        <img
          key={index}
          src={img}
          className="w-24 h-36 object-cover"
        />
      ))}
    </div>
  </div>

  {/* DESKTOP */}
  <div className="hidden md:block absolute inset-0 overflow-hidden">
    <div className="grid w-[120%] -translate-x-[10%] rotate-12 grid-cols-6 gap-2 md:grid-cols-8">
      {posterImages.map((img, index) => (
        <img
          key={index}
          src={img}
          className="w-full h-full object-cover"
        />
      ))}
    </div>
  </div>

  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/70"></div>

</div>
          {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 mx-auto w-full max-w-sm p-4 md:max-w-md md:rounded-2xl md:border md:border-white/10 md:bg-black/40 md:p-8 md:backdrop-blur-xl">

        <img src={Logo} className="w-36 sm:w-32 mx-auto mb-6 sm:mb-8" alt="Next Logo" />

        <form onSubmit={handleLogin} className="space-y-4">

          <InputField
            type="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-purple-400 bg-black/50 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <InputField
            type="password"
            placeholder="Senha"
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-lg border border-purple-400 bg-black/50 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <Button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 py-3 font-medium text-white"
          >
            Entrar
          </Button>

        </form>

        <p className="text-gray-300 text-base sm:text-sm text-center mt-5 sm:mt-6">
          Sua primeira vez aqui?
          <Link to="/cadastro" className="text-purple-400 ml-1">
            Crie sua conta
          </Link>
        </p>

      </div>

    </div>
  );
}
