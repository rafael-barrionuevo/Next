import Button from "../components/button";
import InputField from "../components/inputField";
import {Link} from "react-router-dom";
import Logo from "../assets/LogoNext.png"
import "../style/Cadastro.css";

export default function Cadastro(){

  return(
    <div className="container-cadastro">
          <div className="overlay-cadastro"></div>
    
          <div className="cadastro-box">
            <img src={Logo} className="logo"/>
    
            <form>
              <InputField type="text" placeholder="Nome" className="input-cadastro"/>
              <InputField type="email" placeholder="E-mail" className="input-cadastro"/>
              <InputField type="email" placeholder="Confirmar E-mail" className="input-cadastro"/>
              <InputField type="password" placeholder="Senha" className="input-cadastro"/>
    
              <Link to="/planos">
                <Button type="submit" className="button-cadastro">Cadastrar</Button>
              </Link>
            </form>
        </div>
        </div>
  );
}