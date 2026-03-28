import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import Button from "../components/button";
import InputField from "../components/inputField";
import { Link } from "react-router-dom";

// IMAGENS
import JohnWickImg from "../assets/John-Wick.jpg";
import MatrixImg from "../assets/The-Matrix.jpg";
import AlquimiaImg from "../assets/alquimia-das-almas.jpg";
import AttackOnTitanImg from "../assets/Attack-on-Titan.jpg";
import AvatarImg from "../assets/Avatar.jpg";
import BatmanImg from "../assets/batman.jpg";
import BreakingBadImg from "../assets/breaking-bad.jpg";
import DarkImg from "../assets/Dark.jpg";
import DevoradoresDeEstrelasImg from "../assets/devoradoresDeEstrelas.jpg";
import FullmetalImg from "../assets/Fullmetal-Alchemist-Brotherhood.jpg";
import GameOfThronesImg from "../assets/game-of-thrones.jpg";
import GladiatorImg from "../assets/Gladiator.jpg";
import HoraDoMalImg from "../assets/horaDoMal.jpg";
import HouseDragonImg from "../assets/House-of-the-Dragon.jpg";
import InceptionImg from "../assets/Inception.jpg";
import InterestelarImg from "../assets/interestelar.jpg";
import InvocacaoImg from "../assets/invoca.jpg";
import JogadorN1Img from "../assets/jogadorn1.jpg";
import JujutsuImg from "../assets/jujutsuKaisen.jpg";
import MadMaxImg from "../assets/Mad-Max.jpg";
import MartyImg from "../assets/martySupreme.jpg";
import OnePieceImg from "../assets/onePiece.jpg";
import PeakyBlindersImg from "../assets/Peaky-Blinders.jpg";
import SpiritedAwayImg from "../assets/Spirited-Away.jpg";
import StarWarsImg from "../assets/starwars.jpg";
import StrangerThingsImg from "../assets/stranger-things.jpg";
import The100Img from "../assets/the-100.jpg";
import TheCrownImg from "../assets/the-crown.jpg";
import LastOfUsImg from "../assets/The-Last-of-Us.jpg";
import MandalorianImg from "../assets/The-Mandalorian.jpg";
import RevenantImg from "../assets/The-Revenant.jpg";
import WitcherImg from "../assets/The-Witcher.jpg";
import TheBoysImg from "../assets/theboys.jpg";
import GodfatherImg from "../assets/theGodfather.jpg";
import TitanicImg from "../assets/Titanic.jpg";
import VikingsImg from "../assets/Vikings.jpg";
import WW84Img from "../assets/ww84.jpg";
import YourNameImg from "../assets/yourname.jpg";
import ZootopiaImg from "../assets/zootopia.jpg";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSubscription } from "../store/subscriptionSlice";

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

  const subscription = useSelector(state => state.subscription);

  console.log("SUBSCRIPTION:", subscription);

  

  const dispatch = useDispatch();

  function handlePagamento() {

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

  // salva no Redux
  dispatch(setSubscription({
    tipo_plano: subscription.tipo_plano,
    tipo_pagamento: "credito",
    status: "ativo"
  }));

  console.log("pagamento feito com sucesso");

  // redireciona
  navigate("/perfil");
}

  const navigate = useNavigate();

  const images = [
    AttackOnTitanImg,
    AvatarImg,
    DarkImg,
    FullmetalImg,
    GladiatorImg,
    HouseDragonImg,
    InceptionImg,
    JohnWickImg,
    MadMaxImg,
    MartyImg,
    PeakyBlindersImg,
    SpiritedAwayImg,
    MatrixImg,
    LastOfUsImg,
    MandalorianImg,
    RevenantImg,
    WitcherImg,
    TitanicImg,
    VikingsImg,
    BatmanImg,
    BreakingBadImg,
    DevoradoresDeEstrelasImg,
    GameOfThronesImg,
    HoraDoMalImg,
    InterestelarImg,
    JujutsuImg,
    OnePieceImg,
    StarWarsImg,
    StrangerThingsImg,
    The100Img,
    TheBoysImg,
    GodfatherImg,
    WW84Img,
    YourNameImg,
    ZootopiaImg,
    TheCrownImg,
    JogadorN1Img,
    InvocacaoImg,
    AlquimiaImg,
  ];

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
          {images.map((img, index) => (
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

            <InputField
              name="cep"
              placeholder="CEP"
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