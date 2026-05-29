import { useState, useEffect } from "react";
import Button from "../components/button";
import { Link } from "react-router-dom";
import posterImages from "../constants/posterImages";
import api from "../services/api";

import { useDispatch } from "react-redux";
import { selecionarPlano } from "../store/AssinaturaSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
 


export default function Planos() {

  const navigate = useNavigate();
  const dispatch = useDispatch();



  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planos, setPlanos] = useState([]);


  

  // const subscription = useSelector(state => state.subscription);
  //console.log("SUBSCRIPTION:", user.assinatura?.tipo_plano);
 
  /* const planos = [
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
]; */

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    try {
      const response = await api.get("/planos");
      setPlanos(response.data);

      if (response.data.length > 0) {
        setPlanoSelecionado(response.data[0]); // Seleciona o primeiro plano por padrão
      }

    } catch (e) {
      alert("Erro ao carregar planos: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function simOuNao(valor) {
    return valor ? "Sim" : "Não";
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando planos...</div>;
  }

  if (!planoSelecionado) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Nenhum plano disponível.</div>;
  }


// const planoAtual = planos[planoSelecionado];

  return (
    <div className="relative flex h-screen flex-col items-center overflow-hidden bg-black py-10 text-white">

    {/* FUNDO + OVERLAY */}
<div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

    
    {/* <p>Plano: {user.assinatura?.tipo_plano}</p> */}


  {/* IMAGENS */}
   <div className="pointer-events-none absolute inset-0 w-full max-w-full overflow-hidden">
   <div className="pointer-events-none grid h-[120%] w-[120%] -translate-x-[10%] -translate-y-[10%] rotate-12 grid-cols-6 gap-2 md:grid-cols-8">
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
  <div className="pointer-events-none absolute inset-0 bg-black/80"></div>

</div>

      {/* CONTAINER DESKTOP */}
 <div className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl md:max-w-3xl md:rounded-2xl md:bg-black/10 md:p-8">
      <h2 className="mb-8 text-center text-xl font-bold text-white sm:text-2xl">
        Escolha o melhor plano para você
      </h2>

      <div className="mb-10 grid w-full grid-cols-3 gap-3">

        {planos.map((plano) => {

          const selecionado = planoSelecionado?._id === plano._id;

          return (

            <div
              key={plano._id}
              /* onClick={() => setPlanoSelecionado(index)} */
              onClick={() => {
                setPlanoSelecionado(plano);;
              }}
              className={`
                cursor-pointer rounded-xl p-4 text-center sm:p-5
                transition duration-300 ease-in-out
                hover:-translate-y-1 hover:scale-100 hover:shadow-xl 
                ${selecionado
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-gray-600 bg-black/40 text-gray-300"}
              `}
            >

              <h3 className="font-semibold text-lg">
                {plano.nome}
              </h3>

              <p className={`${selecionado ? "text-white/90" : "text-gray-400"}`}>
                {plano.qualidade_video}
              </p>

            </div>

          );
        })}

      </div>
      
      
  
      <div className="w-full  space-y-4 mb-8">

        <div className="flex justify-between border-b  pb-3 text-sm text-white">
          <span className="font-bold text-base">Preço mensal:</span>
          <span className="font-extralight text-base">{formatarPreco(planoSelecionado.preco)}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white ">
          <span className="font-bold text-base">Qualidade de vídeo:</span>
          <span className="font-extralight text-base">{planoSelecionado.qualidade_video}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Permite download:</span>
          <span className="font-extralight text-base">{simOuNao(planoSelecionado.permite_download)}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Telas simultâneas:</span>
          <span className="font-extralight text-base">{planoSelecionado.telas_simultaneas}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Com anúncios:</span>
          <span className="font-extralight text-base">{simOuNao(planoSelecionado.tem_anuncios)}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Acesso a conteúdo exclusivo:</span>
          <span className="font-extralight text-base">{simOuNao(planoSelecionado.conteudo_exclusivo)}</span>
        </div>

      </div>

   
      
        <Button 
        onClick={() => {
          /* dispatch(selecionarPlano(planos[planoSelecionado].nome)); */
          dispatch(selecionarPlano({
            plano_id: planoSelecionado._id,
            tipo_plano: planoSelecionado.nome,
            limite_perfis: planoSelecionado.limite_perfis
          }));


          navigate("/pagamento");
            }}
          
          className="relative z-50 w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-700">
          Selecionar plano
        </Button>
      
      </div> 
    </div>
  );
}
