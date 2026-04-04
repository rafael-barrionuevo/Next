import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// CADASTRO
export const cadastrarUsuario = createAsyncThunk(
  "user/cadastrarUsuario",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue("Erro ao cadastrar usuário",err);
    }
  }
);

// LOGIN
export const loginUsuario = createAsyncThunk(
  "user/loginUsuario",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users?email=${email}`);
      const data = response.data;

      if (data.length === 0) {
        return rejectWithValue("Usuário não encontrado");
      }

      const user = data[0];

      if (user.senha !== senha) {
        return rejectWithValue("Senha incorreta");
      }

      return user;
    } catch (err) {
      return rejectWithValue("Erro no login",err);
    }
  }
);

// ATUALIZAR PLANO
export const atualizarPlano = createAsyncThunk(
  "user/atualizarPlano",
  async ({ id, tipo_plano }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${id}`, {
        tipo_plano
      });

      return response.data;
    } catch (err) {
      return rejectWithValue("Erro ao atualizar plano",err);
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
export const finalizarPagamento = createAsyncThunk(
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
);

//  STATE
const initialState = {
  id: null,
  nome: "",
  email: "",

  tipo_plano: null,
  tipo_pagamento: null,
  status: "inativo", // status da assinatura

  isAuthenticated: false,
  statusRequest: "idle", // estado das requisições
  error: null
};

// SLICE
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.id = null;
      state.nome = "";
      state.email = "";

      state.tipo_plano = null;
      state.tipo_pagamento = null;
      state.status = "inativo";

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
        state.id = action.payload.id;
        state.nome = action.payload.nome;
        state.email = action.payload.email;
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
        state.id = action.payload.id;
        state.nome = action.payload.nome;
        state.email = action.payload.email;

        state.tipo_plano = action.payload.tipo_plano || null;
        state.tipo_pagamento = action.payload.tipo_pagamento || null;
        state.status = action.payload.status || "inativo";

        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUsuario.rejected, (state, action) => {
        state.statusRequest = "failed";
        state.error = action.payload || action.error.message;
      })

      // PLANO
      .addCase(atualizarPlano.fulfilled, (state, action) => {
        state.tipo_plano = action.payload.tipo_plano;
      })

      // PAGAMENTO
      .addCase(finalizarPagamento.fulfilled, (state, action) => {
        state.tipo_pagamento = action.payload.tipo_pagamento;
        state.status = action.payload.status;
      });
  }
});

// EXPORTS
export const { logout } = userSlice.actions;
export default userSlice.reducer;