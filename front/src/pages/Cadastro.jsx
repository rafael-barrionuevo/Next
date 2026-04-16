import Button from "../components/button";
import InputField from "../components/inputField";
import { Link } from "react-router-dom";
import Logo from "../assets/LogoNext.png";
import React, { useState } from "react";
import posterImages from "../constants/posterImages";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "../store/userSlice";

export default function Cadastro() {
  
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  
  
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroConfirmacao, setErroConfirmacao] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const validarSenha = (valor) => {
    setSenha(valor);

    if (valor.length === 0) {
      setErroSenha("");
      return;
    }

    if (valor.length < 8) {
      setErroSenha("A senha deve ter no mínimo 8 caracteres.");
    } else if (!/[A-Z]/.test(valor)) {
      setErroSenha("Adicione pelo menos uma letra maiúscula.");
    } else if (!/[a-z]/.test(valor)) {
      setErroSenha("Adicione pelo menos uma letra minúscula.");
    } else if (!/[0-9]/.test(valor)) {
      setErroSenha("Adicione pelo menos um número.");
    } else if (!/[!@#$%^&*]/.test(valor)) {
      setErroSenha("Adicione pelo menos um caractere especial (!@#$...).");
    } else {
      setErroSenha(""); 
    }

    
    if (confirmarSenha && valor !== confirmarSenha) {
      setErroConfirmacao("As senhas não coincidem.");
    } else if (confirmarSenha && valor === confirmarSenha) {
      setErroConfirmacao("");
    }
  };

  
  const validarConfirmacao = (valor) => {
    setConfirmarSenha(valor);
    
    if (valor.length > 0 && valor !== senha) {
      setErroConfirmacao("As senhas não coincidem.");
    } else {
      setErroConfirmacao("");
    }
  };

  async function handleCadastro(e) {
    e.preventDefault();

    
    if (erroSenha || erroConfirmacao || senha !== confirmarSenha || senha === "") {
      alert("Por favor, verifique os erros na senha antes de prosseguir.");
      return;
    }

    try {
      const usuario = await dispatch(cadastrarUsuario({ nome, sobrenome, email, senha, data_nascimento: dataNascimento })).unwrap();
      console.log("usuario:", usuario);
      navigate("/planos");
    } catch (err) {
      console.error("ERRO:", err);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4 pb-16 sm:pb-24">

      {/* FUNDO PADRAO */}
      <div className="absolute inset-0 overflow-hidden">
        {/* MOBILE */}
        <div className="absolute inset-0 flex items-center justify-center md:hidden">
          <div className="grid grid-cols-4 gap-2 rotate-12 scale-125">
            {posterImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className="w-24 h-36 object-cover"
                alt=""
              />
            ))}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block absolute inset-0 overflow-hidden">
          <div className="grid grid-cols-6 md:grid-cols-8 gap-2 rotate-12 w-[120%] -translate-x-[10%]">
            {posterImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className="w-full h-full object-cover"
                alt=""
              />
            ))}
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 w-full max-w-sm mx-auto p-4 md:max-w-md md:bg-black/40 md:backdrop-blur-xl md:border md:border-white/10 md:rounded-2xl md:p-8">
        
        <img src={Logo} className="w-36 sm:w-32 mx-auto mb-6 sm:mb-8" alt="Logo" />

        <form onSubmit={handleCadastro} className="space-y-4">
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

          <div>
            <InputField
              onChange={(e) => validarSenha(e.target.value)}
              value={senha}
              type="password"
              placeholder="Senha"
              maxLength={32}
              className={`w-full p-3 rounded-lg bg-black/50 text-white border outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                erroSenha ? "border-red-500" : "border-purple-400"
              }`}
            />
            {erroSenha && (
              <p className="text-xs text-red-500 mt-1 pl-1">{erroSenha}</p>
            )}
          </div>

          <div>
            <InputField
              onChange={(e) => validarConfirmacao(e.target.value)}
              value={confirmarSenha}
              type="password"
              placeholder="Confirmar Senha"
              maxLength={32}
              className={`w-full p-3 rounded-lg bg-black/50 text-white border outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                erroConfirmacao ? "border-red-500" : "border-purple-400"
              }`}
            />
            {erroConfirmacao && (
              <p className="text-xs text-red-500 mt-1 pl-1">{erroConfirmacao}</p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-colors"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-gray-300 text-base text-center mt-6">
          Ja tem conta?
          <Link to="/login" className="text-purple-400 ml-1 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}