import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const DEFAULT_ASSINATURA = {
  tipo_plano: null,
  tipo_pagamento: null,
  status: "inativo"
};

const normalizeState = (state) => {
  if (!state || typeof state !== "object") return undefined;
  if (!state.user || typeof state.user !== "object") return undefined;

  return {
    ...state,
    user: {
      ...state.user,
      assinatura: state.user.assinatura ?? DEFAULT_ASSINATURA
    }
  };
};

//criando o localStorage

//pega os dados do localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("appState");

    if(!serializedState) return undefined;

    return normalizeState(JSON.parse(serializedState));
    
  }catch  {
    return undefined;
    //se voltar undefined, o Redux irá usar o estado inicial definido no userSlice.js
  }
}

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  //usando o localStorage
  preloadedState: loadState()//se tiver algo no localStorage, ele vai usar, se não, ele vai usar o estado inicial do userSlice.js
});


//toda vez que o Redux mudar, ele vai executar isso
//quando utilizar "dispatch(setUser(...))" irá disparar o subscribe

store.subscribe(() => {
  try {
    const state = store.getState();//pega o estado atual
    //pega exatamente 
    /* {
     id: null;
        nome: string;
        sobrenome: string;
        email: string;
        data_nascimento: null;
        role: string;
        assinatura: {
            tipo_plano: null;
            tipo_pagamento: null;
            status: string;
        };
        token: string | null;
        isAuthenticated: boolean;
        statusRequest: string;
        error: null;
    } */

    
    localStorage.setItem("appState", JSON.stringify({//salva no localStorage
      user: state.user,
      
    }));
  }catch {
    console.log("Erro ao salvar no localStorage");
  }
})




