import Button from "../components/button";
import InputField from "../components/inputField";
import { Link } from "react-router-dom";
import Logo from "../assets/LogoNext.png";
import React, { useState } from "react";
import posterImages from "../constants/posterImages";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cadastrarUsuario } from "../store/userSlice";

export default function Cadastro() {

  //useState -> REDUX
  //criando os estados
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");


  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* function handleCadastro(e){
    e.preventDefault(); // MUITO IMPORTANTE (form)

    //testar o forms
    console.log("ANTES DO DISPATCH:");
    console.log("Nome:", nome);
    console.log("Email:", email);

     dispatch(setUser({ 
      id: Date.now(),
      nome, 
      email})); 
      

    console.log("DEPOIS DO DISPATCH");

    navigate("/planos");
  } */

  async function handleCadastro(e) {
    e.preventDefault();

    // console.log("1 - entrou");

    try {
      const result = await dispatch(cadastrarUsuario({ nome, sobrenome, email, senha, data_nascimento: dataNascimento })).unwrap();

      console.log("2 - result:", result);

      navigate("/planos");

    } catch (err) {
      console.error("ERRO:", err);
    }

    console.log("3 - fim");
  }

  //testar se o Redux está funcionando
  const user = useSelector(state => state.user);

  console.log("REDUX:", user);

  // console.log(nome, email);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4 pb-16 sm:pb-24">

      
      {/*  FUNDO PADRAO */}
      <div className="absolute inset-0 overflow-hidden">

        {/*  MOBILE */}
        <div className="absolute inset-0 flex items-center justify-center md:hidden">
          <div className="grid grid-cols-4 gap-2 rotate-12 scale-125">
            {posterImages.map((img, index) => (
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
            {posterImages.map((img, index) => (
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

        <form 
        onSubmit={handleCadastro}className="space-y-4">

          <InputField
            onChange={(e) => setNome(e.target.value)}
            type="text"
            placeholder="Nome"
            className="w-full p-3 rounded-lg bg-black/50 text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <InputField
            onChange={(e) => setSobrenome(e.target.value)}
            type="text"
            placeholder="Sobrenome"
            className="w-full p-3 rounded-lg bg-black/50 text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <InputField
            onChange={(e) => setDataNascimento(e.target.value)}
            type="date"
            className="w-full p-3 rounded-lg bg-black/50 text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          <InputField
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e)=> setSenha(e.target.value)}
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded-lg bg-black/50 text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg font-medium">
            <Link to="/planos">Cadastrar</Link>
          </Button> */}
          <button 
          type="submit"
           className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg font-medium">
            Cadastrar
          </button>
          

        </form>

        <p className="text-gray-300 text-bases text-center mt-6">
          Ja tem conta?
          <Link to="/login" className="text-purple-400 ml-1">
            Entrar
          </Link>
        </p>

      </div>

    </div>
  );
}
