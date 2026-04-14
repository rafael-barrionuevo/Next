import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import Button from "../components/button";
import InputField from "../components/inputField";
import { Link } from "react-router-dom";
import posterImages from "../constants/posterImages";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { atualizarPlano } from "../store/userSlice";


export default function Pagamento() {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: ""
  });

  function handleInput(e) {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  }

  function handleFocus(e) {
    setCardData({
      ...cardData,
      focus: e.target.name
    });
  }

  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  async function handlePagamento() {
    console.log("USER:", user);
    if (!user?.id) {
      alert("Usuário não encontrado. Faça o cadastro ou login novamente.");
      return;
    }

    if (!user.assinatura?.tipo_plano) {
      alert("Selecione um plano antes de iniciar a assinatura.");
      return;
    }
 /*  // validação simples
  if (!numeroCartao || numeroCartao.length < 16) {
    alert("Cartão inválido");
    return;
  }

  if (!nome.trim()) {
    alert("Nome obrigatório");
    return;
  }

  if (!cvv || cvv.length < 3) {
    alert("CVV inválido");
    return;
  } */
try {
    await dispatch(
      atualizarPlano({
        id: user.id,
        tipo_plano: user.assinatura?.tipo_plano,
        tipo_pagamento: "credito" // ou vindo do input
      })
    ).unwrap();
     navigate("/login");
    } catch (err) {
    alert(err);
  }
  
 
}

  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-white">

      {/* FUNDO */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="
          grid grid-cols-6 md:grid-cols-8 gap-2
          rotate-12
          w-[120%]
          -translate-x-[10%]
        ">
          {posterImages.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-full h-full object-cover"
            />
          ))}
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* CONTEÚDO */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen
       px-4 
       md:min-h-screen
  md:justify-center">

          <div className="
              w-full max-w-md
              md:max-w-lg
              md:bg-black/40
              bg-black/20
              md:backdrop-blur-xl
              backdrop-blur-xl
              md:border md:border-white/10
              border border-white/10
              md:
              rounded-2xl
              p-8
            ">



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
          <form 
          onSubmit={(e) => {
            e.preventDefault();
            handlePagamento();
          }}
          className="space-y-4">

            <InputField
              name="number"
              placeholder="Número do cartão"
              className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={handleInput}
              onFocus={handleFocus}
            />

            <InputField
              name="name"
              placeholder="Nome no cartão"
              className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={handleInput}
              onFocus={handleFocus}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="expiry"
                placeholder="MM/AA"
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
                onChange={handleInput}
                onFocus={handleFocus}
              />

              <InputField
                name="cvc"
                placeholder="CVV"
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
                onChange={handleInput}
                onFocus={handleFocus}
              />
            </div>

            <InputField
              name="cpf"
              placeholder="CPF"
              className="w-full p-3 rounded-lg bg-white/10 border border-purple-400 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
            />

            <Button
              type="submit"
              
              className="w-full 
              bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg font-medium"
            >
              Iniciar assinatura
            </Button>

          </form>

        </div>
      </div>
    </div>
  );
}
