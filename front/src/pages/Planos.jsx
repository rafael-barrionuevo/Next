import { useState } from "react";
import Button from "../components/button";
import { Link } from "react-router-dom";
import posterImages from "../constants/posterImages";

import { useDispatch } from "react-redux";
import { selecionarPlano } from "../store/userSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
 


export default function Planos() {

  const navigate = useNavigate();

  const user = useSelector(state => state.user);

  const [planoSelecionado, setPlanoSelecionado] = useState(0);
  


  const dispatch = useDispatch();

  // const subscription = useSelector(state => state.subscription);
  //console.log("SUBSCRIPTION:", user.assinatura?.tipo_plano);
 
  const planos = [
  {
    nome: "Básico",
    qualidade: "720p",
    preco: "R$ 19,90",
    download: "Não",
    telas: "1 dispositivo",
    anuncios: "Sim",
    exclusivo: "Não",
    gradiente: "from-blue-500 to-purple-900"
  },
  {
    nome: "Padrão",
    qualidade: "1080p",
    preco: "R$ 39,90",
    download: "Sim",
    telas: "2 dispositivos",
    anuncios: "Não",
    exclusivo: "Sim",
    gradiente: "from-blue-500 to-yellow-400"
  },
  {
    nome: "Premium",
    qualidade: "4K + HDR",
    preco: "R$ 54,90",
    download: "Sim",
    telas: "4 dispositivos",
    anuncios: "Não",
    exclusivo: "Sim",
    gradiente: "from-blue-500 to-red-500"
  }
];

const planoAtual = planos[planoSelecionado];

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col items-center py-10 text-white">

    {/* FUNDO + OVERLAY */}
<div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

    
    <p>Plano: {user.assinatura?.tipo_plano}</p>


  {/* IMAGENS */}
   <div className="absolute inset-0 overflow-hidden w-full max-w-full pointer-events-none ">

   <div className="
   grid grid-cols-6 md:grid-cols-8 gap-2
  rotate-12
 w-[120%] h-[120%]
-translate-x-[10%] -translate-y-[10%]
pointer-events-none 
">
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
  <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>

</div>

      {/* CONTAINER DESKTOP */}
 <div className="
  relative z-10
  w-full
  max-w-md
  mx-auto

  bg-black/30        
  p-6                

  md:max-w-3xl
  md:bg-black/10
  md:backdrop-blur-xl
  border border-white/10 
  rounded-3xl
  backdrop-blur-xl
  md:border md:border-white/10 
  md:rounded-2xl 
  md:p-8
">

      <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center  text-white">
        Escolha o melhor plano para você
      </h2>

      <div className="grid grid-cols-3 gap-3 w-full  mb-10">

        {planos.map((plano, index) => {

          const selecionado = planoSelecionado === index;

          return (

            <div
              key={index}
              /* onClick={() => setPlanoSelecionado(index)} */
              onClick={() => {
                setPlanoSelecionado(index);;
              }}
              className={`
                p-4 sm:p-5 rounded-xl text-center cursor-pointer
                transition duration-300 ease-in-out
                hover:scale-100  hover:shadow-xl hover:-translate-y-1 
                ${selecionado 
                  ? `bg-gradient-to-br ${plano.gradiente} text-white shadow-lg scale-100 `
                  : "border  border-gray-600 bg-black/40 text-gray-300"}
              `}
            >

              <h3 className="font-semibold text-lg">
                {plano.nome}
              </h3>

              <p className={`${selecionado ? "text-white/90" : "text-gray-400"}`}>
                {plano.qualidade}
              </p>

            </div>

          );
        })}

      </div>
      
      
  
      <div className="w-full  space-y-4 mb-8">

        <div className="flex justify-between border-b  pb-3 text-sm text-white">
          <span className="font-bold text-base">Preço mensal:</span>
          <span className="font-extralight text-base">{planoAtual.preco}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white ">
          <span className="font-bold text-base">Qualidade de vídeo:</span>
          <span className="font-extralight text-base">{planoAtual.qualidade}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Permite download:</span>
          <span className="font-extralight text-base">{planoAtual.download}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Telas simultâneas:</span>
          <span className="font-extralight text-base">{planoAtual.telas}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Com anúncios:</span>
          <span className="font-extralight text-base">{planoAtual.anuncios}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Acesso a conteúdo exclusivo:</span>
          <span className="font-extralight text-base">{planoAtual.exclusivo}</span>
        </div>

      </div>

   
      
        <Button 
        onClick={() => {
          // console.log("CLICOU");
          // console.log("PLANO SELECIONADO:", planos[planoSelecionado]);

          // dispatch(setPlan(planos[planoSelecionado]));
          dispatch(selecionarPlano(planos[planoSelecionado].nome));


          navigate("/pagamento");
            }}
          
          className="relative z-50 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition font-medium">
          Selecionar plano
        </Button>
      
      </div> 
    </div>
  );
}
