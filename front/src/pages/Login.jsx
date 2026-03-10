import Button from "../components/button";
import InputField from "../components/inputField";
import { Link } from "react-router-dom";
import Logo from "../assets/LogoNext.png";

import "../style/Login.css"

export default function Login() {
  return (
    <div className="container-login">
      <div className="overlay-login"></div>

      <div className="login-box">
        <img src={Logo} className="logo"/>

        <form>
          <InputField type="email" placeholder="E-mail" className="input-login"/>
          <InputField type="password" placeholder="Senha" className="input-login"/>

          <Button className="button-login" type="submit">Entrar</Button>
        </form>

        <p className="register">
          Sua primeira vez aqui?
          <Link to="/cadastro"> Crie sua conta</Link>
        </p>
    </div>
    </div>
  );
}
