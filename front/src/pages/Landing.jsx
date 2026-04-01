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
import FundoImg from "../assets/fundo.png";
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
import { Link } from "react-router-dom";


export default function Login() {
  const images = [
    // já existentes
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
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">

      {/* FUNDO MOBILE */}
      <div className="absolute inset-0 flex items-center justify-center md:hidden">
        <div className="
          grid grid-cols-4 gap-2
          rotate-12 scale-150
        ">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-28 h-40 object-cover"
            />
          ))}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <div className="
          grid grid-cols-6 md:grid-cols-8 gap-2
          rotate-12 scale-110
          w-[110%] h-[110%]
          -translate-x-[10%] -translate-y-[10%]
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

      {/* OVERLAY ESCURO GLOBAL */}
      <div className="hidden md:block absolute inset-0 bg-black/70"></div>

      {/* DEGRADÊ SUPERIOR */}
      <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-black via-black/70 to-transparent"></div>

      {/* DEGRADÊ INFERIOR */}
      <div className="md:hidden absolute bottom-0 w-full h-96 bg-gradient-to-t from-black via-black/100 to-transparent"></div>

      {/* HEADER (só desktop) */}
      <div className="hidden md:flex absolute top-0 left-0 w-full justify-between items-center px-12 py-6 z-20">
        <img src={Logo} className="w-32" />

        <button className="bg-gradient-to-r from-violet-500 to-fuchsia-600
        text-white px-5 py-2 rounded font-semibold
        hover:from-purple-600 hover:to-purple-800   shadow-md shadow-fuchsia-500/20
          transition">
          <Link to="/login">Entrar</Link>
        </button>
      </div>

     {/* CONTEÚDO */}
<div className="relative z-10 flex flex-col items-center justify-end h-full pb-10 px-6 text-center md:justify-center md:px-0">

  <div className="w-full max-w-2xl mx-auto flex flex-col items-center">

  {/* Logo */}
  <img src={Logo} className="w-40 mb-6 md:hidden" />

  {/* TEXTO PRINCIPAL MOBILE */}
  <h1 className="
  text-white font-bold
  text-2xl
  md:text-5xl
  leading-tight
  md:leading-[1.1]
  max-w-3xl
  mb-4
  md:hidden
  ">
    Todas os seus filmes, séries e muito mais. Agora em um só lugar.
  </h1>

  {/* TEXTO PRINCIPAL */}
  <h1 className="hidden md:block
      text-white font-bold
      text-2xl
      md:text-5xl
      leading-tight
      md:leading-[1.1]
      max-w-3xl
      mb-4 
    ">
      Filmes, séries e muito mais, sem limites
  </h1>

    {/* SUBTEXTO */}
  <p className="hidden md:block
      text-gray-300 
      text-sm
      md:text-xl
      mb-4 
  ">
    A partir de R$ 20,90. Cancele quando quiser.
  </p>

  {/* TEXTO AUXILIAR */}
  <p className="hidden md:block
      text-gray-400
      text-xs
      md:text-base
      mb-6 
  ">
      Quer assistir? Informe seu email para criar ou reiniciar sua assinatura.
  </p>

  {/* FORM DESKTOP (fica escondido no mobile) */}
  <div className="hidden md:flex w-full max-w-xl gap-3 mb-4 justify-center">
    <input
    type="email"
    placeholder="Email"
    className="
    flex-1 max-w-xl
    px-5 py-4
    rounded
    bg-black/60
    border border-violet-400
    text-white text-lg
    focus:outline-none
    focus:ring-2 focus:ring-fuchsia-500
    focus:border-fuchsia-500
    placeholder:text-gray-400
    transition
    "
    />

    <button className="
      bg-gradient-to-r from-violet-500 to-fuchsia-600
      px-8 py-4 rounded
      font-semibold text-lg
      text-white
      hover:from-violet-600 hover:to-fuchsia-700
      shadow-lg shadow-fuchsia-500/30
      transition
      ">
        <Link to="/login">Vamos lá →</Link>
    </button>
</div>

  {/* BOTÕES MOBILE (esconde no desktop) */}
  <div className="w-full md:hidden">
    <button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-semibold py-3 rounded-md mb-3"><Link to="/cadastro">Experimente o Teste Gratuito</Link>
      
    </button>

    <button className="w-full border border-violet-400 text-violet-400 hover:bg-violet-500/10 py-3 rounded-md mb-3">
      <Link to="/login">Login</Link>
    </button>

    <p className="text-gray-200 text-sm">
      ou <span className="text-violet-400
hover:text-fuchsia-400"><Link to="/cadastro">Criar Conta</Link></span>
    </p>
  </div>

</div>

  </div>
    </div>
  );
}