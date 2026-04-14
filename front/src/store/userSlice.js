import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { data } from "react-router";

// CADASTRO
export const cadastrarUsuario = createAsyncThunk(
  "user/cadastrarUsuario",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/usuarios", userData);
      return response.data.user;//resultado do back end, dps chama a função "fulfilled" e passa o user para o state
    } catch (err) {
      console.error(err);
      return rejectWithValue(
        err.response?.data?.erro || "Erro ao cadastrar usuÃ¡rio"
      );
    }
  }
);

// LOGIN
export const loginUsuario = createAsyncThunk(
  "user/loginUsuario",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { email, senha });
      return response.data; //retorna token e usuario 
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response?.data?.erro || "Erro no login");
    }
  }
);

//ATUALIZAR USUARIO
export const atualizarUsuario = createAsyncThunk(
  "user/atualizarUsuario",
  async ({ nome, sobrenome, data_nascimento }, { rejectWithValue }) => {
    try {
      const response = await api.patch("usuarios/changeprofile", {
        nome,
        sobrenome,
        data_nascimento
      });
      return response.data.user;  
    } catch (err) {
      console.error(err);
      return rejectWithValue(
        err.response?.data?.erro || "Erro ao atualizar usuÃ¡rio"
      );
    }
  }
);

// ATUALIZAR PLANO
export const atualizarPlano = createAsyncThunk(
  "user/atualizarPlano",
  async ({ id, tipo_plano,tipo_pagamento }, { rejectWithValue }) => {
    try {
      /* const response = await api.patch(`/users/${id}`, { */
      const response = await api.post(`/usuarios/${id}/assinar`, {
        tipo_plano,
        tipo_pagamento
      });

      return response.data.user;
    } catch (err) {
      console.error(err);
      return rejectWithValue(
        err.response?.data?.erro || "Erro ao atualizar assinatura"
      );
    }
  }
);

//  STATE
const initialState = {
  id: null,
  nome: "",
  sobrenome: "",
  email: "",
  data_nascimento: null,
  role: "",

  assinatura: {
     tipo_plano: null,
     tipo_pagamento: null,
     status: "inativo"
  },
  token: sessionStorage.getItem('token') || null,
  isAuthenticated: !!sessionStorage.getItem('token'),
  role: "",

  statusRequest: "idle", // estado das requisiÃ§Ãµes
  error: null
};

// SLICE
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    selecionarPlano: (state, action) => {
      if (!state.assinatura) {
        state.assinatura = {
          tipo_plano: null,
          tipo_pagamento: null,
          status: "inativo"
        };
      }
      state.assinatura.tipo_plano = action.payload;
    },//usamos dispatch(selecionarPlano("premium")); sem chamar a API
    logout: (state) => {
      state.id = null;
      state.nome = "";
      state.sobrenome = "";
      state.email = "";
      state.data_nascimento = null;
      state.role = "";

      state.assinatura = {
      tipo_plano: null,
       tipo_pagamento: null,
      status: "inativo"
    } ;

      state.statusRequest = "idle";
      state.error = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      
      //esse resultado vem do "return response.data.user" lá no "cadastrarUsuario"

      // CADASTRO
      .addCase(cadastrarUsuario.pending, (state) => {
        state.statusRequest = "loading";
      })

      .addCase(cadastrarUsuario.fulfilled, (state, action) => {
        state.statusRequest = "succeeded";
        state.id = action.payload._id;
        state.nome = action.payload.nome;
        state.sobrenome = action.payload.sobrenome;
        state.email = action.payload.email;
        state.data_nascimento = action.payload.data_nascimento;
        state.role = action.payload.role;
        state.assinatura = action.payload.assinatura || {
          tipo_plano: null,
          tipo_pagamento: null,
          status: "inativo"
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      //como houve uma mudança no Redux, ele vai executar o "store.subscribe" lá no "index.js" e atualizar o localStorage. Depois volta para o "Cadastro.jsx" e executa o "navigate("/planos")"
      
      .addCase(cadastrarUsuario.rejected, (state, action) => {
        state.statusRequest = "failed";
        state.error = action.payload || action.error.message;
      })

      // LOGIN
      .addCase(loginUsuario.pending, (state) => {
        state.statusRequest = "loading";
      })
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.statusRequest = "succeeded";
        
        const { token, usuario } = action.payload; 
        
        if (token) {
          sessionStorage.setItem('token', token);
          state.token = token;
        }

        state.id = usuario?.id || null;
        state.nome = usuario?.nome || "";
        state.email = usuario?.email || "";
        state.role = usuario?.role || "";

        state.assinatura = usuario?.assinatura || {
          tipo_plano: null,
          tipo_pagamento: null,
          status: "inativo"
        };
        
        state.isAuthenticated = true;
        state.error = null;
      })

      // PLANO
      .addCase(atualizarPlano.fulfilled, (state, action) => {
        state.assinatura = action.payload.assinatura;
      })

      //atualizar usuario
      .addCase(atualizarUsuario.fulfilled, (state, action) => {
        state.nome = action.payload.nome;
        state.sobrenome = action.payload.sobrenome;
        state.data_nascimento = action.payload.data_nascimento;
      })

      .addCase(atualizarUsuario.pending, (state) => {
        state.statusRequest = "loading";
      })

      .addCase(atualizarUsuario.rejected, (state, action) => {
        state.statusRequest = "failed";
        state.error = action.payload || action.error.message;
      })  
  }
});

// EXPORTS
export const { logout, selecionarPlano } = userSlice.actions;
export default userSlice.reducer;
