import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// CADASTRO
export const cadastrarUsuario = createAsyncThunk(
  "user/cadastrarUsuario",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/usuarios", userData);
      return response.data.user;
    } catch (err) {
      console.error(err);
      return rejectWithValue(
        err.response?.data?.erro || "Erro ao cadastrar usuário"
      );
    }
  }
);

// LOGIN
export const loginUsuario = createAsyncThunk(
  "user/loginUsuario",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      /* const response = await api.get(`/users?email=${email}`); */
      const response = await api.post("/login", { email, senha });
      return response.data.user;
    } catch (err) {
      console.error(err);
      return rejectWithValue(
        err.response?.data?.erro || "Erro no login"
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

    
    //aposentado pelo axios RIP
    /* {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tipo_plano })
      });

      return await response.json();
    } catch (err) {
      return rejectWithValue("Erro ao atualizar plano",err);
    } */
  

// FINALIZAR PAGAMENTO
/* export const finalizarPagamento = createAsyncThunk(
  "user/finalizarPagamento",
  async ({ id, tipo_pagamento }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${id}`, {
        tipo_pagamento,
        status: "ativo"
      });

       return response.data;
    } catch (err) {
      return rejectWithValue("Erro ao finalizar pagamento",err);
    }
  }
); */

//  STATE
const initialState = {
  id: null,
  nome: "",
  email: "",

  assinatura: {
     tipo_plano: null,
     tipo_pagamento: null,
     status: "inativo"
  },
 
  isAuthenticated: false,
  statusRequest: "idle", // estado das requisições
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
      state.email = "";

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

      // CADASTRO
      .addCase(cadastrarUsuario.pending, (state) => {
        state.statusRequest = "loading";
      })
      .addCase(cadastrarUsuario.fulfilled, (state, action) => {
        state.statusRequest = "succeeded";
        state.id = action.payload._id;
        state.nome = action.payload.nome;
        state.email = action.payload.email;
        state.assinatura = action.payload.assinatura || {
          tipo_plano: null,
          tipo_pagamento: null,
          status: "inativo"
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      
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
        state.id = action.payload._id;
        state.nome = action.payload.nome;
        state.email = action.payload.email;

         state.assinatura = action.payload.assinatura || {
          tipo_plano: null,
          tipo_pagamento: null,
            status: "inativo"
          };
       

        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUsuario.rejected, (state, action) => {
        state.statusRequest = "failed";
        state.error = action.payload || action.error.message;
      })

      // PLANO
      .addCase(atualizarPlano.fulfilled, (state, action) => {
        state.assinatura = action.payload.assinatura;
      })

      // PAGAMENTO
      /* .addCase(finalizarPagamento.fulfilled, (state, action) => {
        state.tipo_pagamento = action.payload.tipo_pagamento;
        state.status = action.payload.status;
      }); */
  }
});

// EXPORTS
export const { logout, selecionarPlano } = userSlice.actions;
export default userSlice.reducer;
