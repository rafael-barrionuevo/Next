import Button from "../components/button";
import InputField from "../components/inputField";
import { Link } from "react-router-dom";
import Logo from "../assets/LogoNext.png";

// Filmes / séries
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

export default function Cadastro() {

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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4 pb-16 sm:pb-24">

      
      {/*  FUNDO PADRÃO */}
<div className="absolute inset-0 overflow-hidden">

  {/*  MOBILE */}
  <div className="absolute inset-0 flex items-center justify-center md:hidden">
    <div className="grid grid-cols-4 gap-2 rotate-12 scale-125">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          className="w-24 h-36 object-cover"
        />
      ))}
    </div>
  </div>

  {/*  DESKTOP */}
  <div className="hidden md:block absolute inset-0 overflow-hidden">
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
  </div>
</div>
  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/80"></div>

  
      <div className="
            relative z-10
            w-full
            max-w-sm
            mx-auto
            p-4

            md:max-w-md
            md:bg-black/40
            md:backdrop-blur-xl
            md:border md:border-white/10
            md:rounded-2xl
            md:p-8
          ">

        <img src={Logo} className="w-36 sm:w-32 mx-auto mb-6 sm:mb-8" />

        <form className="space-y-4">

          <InputField
            type="text"
            placeholder="Nome"
            className="w-full p-3 rounded-lg bg-black/50 text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <InputField
            type="email"
            placeholder="E-mail"
            className="w-full p-3 rounded-lg bg-black/50 text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <InputField
            type="email"
            placeholder="Confirmar E-mail"
            className="w-full p-3 rounded-lg bg-black/50 text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <InputField
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded-lg bg-black/50 text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg font-medium">
            <Link to="/planos">Cadastrar</Link>
          </Button>

        </form>

        <p className="text-gray-300 text-bases text-center mt-6">
          Já tem conta?
          <Link to="/login" className="text-purple-400 ml-1">
            Entrar
          </Link>
        </p>

      </div>

    </div>
  );
}