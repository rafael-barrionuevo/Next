import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import Button from "../components/button";
import InputField from "../components/inputField";
import posterImages from "../constants/posterImages";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { atualizarPlano } from "../store/AssinaturaSlice";

export default function Pagamento() {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: ""
  });

  const [cpf, setCpf] = useState("");

  function handleInput(e) {
    let { name, value } = e.target;

    if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 16);
    } 
    else if (name === "cvc") {
      value = value.replace(/\D/g, "").slice(0, 3); 
    } 
    else if (name === "name") {
      value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""); 
    } 
    else if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }
    }

    setCardData({
      ...cardData,
      [name]: value
    });
  }

  function handleCpf(e) {
  
    let value = e.target.value.replace(/\D/g, "").slice(0, 11);


    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    setCpf(value);
  }

  function handleFocus(e) {
    setCardData({
      ...cardData,
      focus: e.target.name
    });
  }

  const user = useSelector(state => state.user);
  const assinatura = useSelector(state => state.assinatura);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handlePagamento(e) {
    e.preventDefault();

    if (!user?.id && !user?.token) {
      alert("Usuário não encontrado. Faça o cadastro ou login novamente.");
      return;
    }

    if (!assinatura.assinaturaEmSelecao?.plano_id) {
      alert("Selecione um plano antes de iniciar a assinatura.");
      return;
    }

    if (cardData.number.length < 15) {
      alert("Número do cartão inválido.");
      return;
    }
    if (cardData.name.trim().length < 3) {
      alert("Insira o nome completo impresso no cartão.");
      return;
    }
    if (cardData.expiry.length < 5) {
      alert("Data de validade inválida. Use o formato MM/AA.");
      return;
    }
    if (cardData.cvc.length < 3) {
      alert("Código de segurança (CVC) inválido.");
      return;
    }
    if (cpf.length < 14) {
      alert("CPF incompleto.");
      return;
    }

    try {
      await dispatch(
        atualizarPlano({
         /*  id: user.id,
          tipo_plano: user.assinatura?.tipo_plano, */
          plano_id: assinatura.assinaturaEmSelecao?.plano_id,
          tipo_pagamento: "credito" 
        })
      ).unwrap();
      
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* FUNDO */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="grid w-[120%] -translate-x-[10%] rotate-12 grid-cols-6 gap-2 md:grid-cols-8">
          {posterImages.map((img, index) => (
            <img key={index} src={img} className="h-full w-full object-cover" alt="" />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* CONTEÚDO */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-8 backdrop-blur-xl md:max-w-lg md:border-white/10 md:bg-black/40 md:backdrop-blur-xl">

          {/* CARTÃO */}
          <div className="mb-6 flex justify-center">
            <div className="scale-90 sm:scale-100">
              <Cards
                number={cardData.number}
                name={cardData.name}
                expiry={cardData.expiry}
                cvc={cardData.cvc}
                focused={cardData.focus}
              />
            </div>
          </div>

          <p className="mb-6 text-center text-lg font-semibold">
            Informe os dados do seu cartão
          </p>

          {/* FORM */}
          <form onSubmit={handlePagamento} className="space-y-4">
            <InputField
              name="number"
              value={cardData.number}
              placeholder="Número do cartão"
              maxLength={16} 
              className="w-full rounded-lg border border-purple-400 bg-white/10 p-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleInput}
              onFocus={handleFocus}
            />

            <InputField
              name="name"
              value={cardData.name}
              placeholder="Nome no cartão"
              maxLength={50} 
              className="w-full rounded-lg border border-purple-400 bg-white/10 p-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleInput}
              onFocus={handleFocus}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="expiry"
                value={cardData.expiry}
                placeholder="MM/AA"
                maxLength={5} 
                className="w-full rounded-lg border border-purple-400 bg-white/10 p-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
                onChange={handleInput}
                onFocus={handleFocus}
              />

              <InputField
                name="cvc"
                type="text" 
                value={cardData.cvc}
                placeholder="CVV"
                maxLength={4} 
                className="w-full rounded-lg border border-purple-400 bg-white/10 p-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
                onChange={handleInput}
                onFocus={handleFocus}
              />
            </div>

            <InputField
              name="cpf"
              value={cpf}
              placeholder="CPF do titular"
              maxLength={14} 
              className="w-full rounded-lg border border-purple-400 bg-white/10 p-3 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleCpf}
            />

            <Button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 py-3 font-medium text-white transition hover:from-purple-600 hover:to-purple-800"
            >
              Iniciar assinatura
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}