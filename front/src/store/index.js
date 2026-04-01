import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import subscriptionReducer from "./subscriptionSlice";

//store

//criando o localStorage

//pega os dados do localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("appState");

    if(!serializedState) return undefined;

    return JSON.parse(serializedState);
    
  }catch  {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer
  },
  //usando o localStorage
  preloadedState: loadState()
});


//toda vez que o Redux mudar, ele vai executar isso
//quando utilizar "dispatch(setUser(...))" irá disparar o subscribe

store.subscribe(() => {
  try {
    const state = store.getState();//pega o estado atual
    //pega exatamente 
    /* {
      user,
      subscription
    } */

    
    localStorage.setItem("appState", JSON.stringify({//salva no localStorage
      user: state.user,
      subscription: state.subscription
      
    }));
  }catch {
    console.log("Erro ao salvar no localStorage");
  }
})




