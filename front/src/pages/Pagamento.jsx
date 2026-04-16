import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import Button from "../components/button";
import InputField from "../components/inputField";
import posterImages from "../constants/posterImages";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { atualizarPlano } from "../store/userSlice";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handlePagamento(e) {
    e.preventDefault();

    if (!user?.id) {
      alert("Usuário não encontrado. Faça o cadastro ou login novamente.");
      return;
    }

    if (!user.assinatura?.tipo_plano) {
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
          id: user.id,
          tipo_plano: user.assinatura?.tipo_plano,
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
        <div className="grid grid-cols-6 md:grid-cols-8 gap-2 rotate-12 w-[120%] -translate-x-[10%]">
          {posterImages.map((img, index) => (
            <img key={index} src={img} className="w-full h-full object-cover" alt="" />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* CONTEÚDO */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md md:max-w-lg md:bg-black/40 bg-black/20 md:backdrop-blur-xl backdrop-blur-xl md:border md:border-white/10 border border-white/10 rounded-2xl p-8">

          {/* CARTÃO */}
          <div className="flex justify-center mb-6">
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

          <p className="text-lg font-semibold text-center mb-6">
            Informe os dados do seu cartão
          </p>

          {/* FORM */}
          <form onSubmit={handlePagamento} className="space-y-4">
            <InputField
              name="number"
              value={cardData.number}
              placeholder="Número do cartão"
              maxLength={16} 
              className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={handleInput}
              onFocus={handleFocus}
            />

            <InputField
              name="name"
              value={cardData.name}
              placeholder="Nome no cartão"
              maxLength={50} 
              className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={handleInput}
              onFocus={handleFocus}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="expiry"
                value={cardData.expiry}
                placeholder="MM/AA"
                maxLength={5} 
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={handleInput}
                onFocus={handleFocus}
              />

              <InputField
                name="cvc"
                type="text" 
                value={cardData.cvc}
                placeholder="CVV"
                maxLength={4} 
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={handleInput}
                onFocus={handleFocus}
              />
            </div>

            <InputField
              name="cpf"
              value={cpf}
              placeholder="CPF do titular"
              maxLength={14} 
              className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={handleCpf}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg font-medium transition hover:from-purple-600 hover:to-purple-800"
            >
              Iniciar assinatura
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}