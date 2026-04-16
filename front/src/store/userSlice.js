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
      return rejectWithValue(err.response?.data?.erro || "Erro ao cadastrar usuário");
    }
  }
);

// LOGIN
export const loginUsuario = createAsyncThunk(
  "user/loginUsuario",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { email, senha });
      return response.data; 
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response?.data?.erro || "Erro no login");
    }
  }
);

// ATUALIZAR USUARIO
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
      return rejectWithValue(err.response?.data?.erro || "Erro ao atualizar usuário");
    }
  }
);

// ATUALIZAR PLANO
export const atualizarPlano = createAsyncThunk(
  "user/atualizarPlano",
  async ({ id, tipo_plano, tipo_pagamento }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/usuarios/${id}/assinar`, {
        tipo_plano,
        tipo_pagamento
      });
      return response.data.user;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response?.data?.erro || "Erro ao atualizar assinatura");
    }
  }
);

// BUSCAR WISHLIST
export const buscarWishlist = createAsyncThunk(
  "user/buscarWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/usuarios/me");
      return response.data.lista_desejos;
    } catch (err) {
      return rejectWithValue("Erro ao buscar wishlist", err);
    }
  }
);

// ADICIONAR WISHLIST
export const adicionarWishlist = createAsyncThunk(
  "user/adicionarWishlist",
  async (conteudoId, { rejectWithValue }) => {
    try {
      const response = await api.patch("/usuarios/lista", { conteudoId });
      return response.data.lista_desejos;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);

// REMOVER WISHLIST
export const removerWishlist = createAsyncThunk(
  "user/removerWishlist",
  async (conteudoId, { rejectWithValue }) => {
    try {
      const response = await api.delete("/usuarios/lista", {
        data: { conteudoId }
      });
      return response.data.lista_desejos;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error);
    }
  }
);

// GERENCIAMENTO DE PERFIS

export const adicionarPerfil = createAsyncThunk(
  "user/adicionarPerfil",
  async ({ nome, avatar }, { rejectWithValue }) => {
    try {
  
      const response = await api.post("/usuarios/perfis", { nome, avatar });
      return response.data.perfis; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.erro || "Erro ao criar perfil");
    }
  }
);

export const editarPerfil = createAsyncThunk(
  "user/editarPerfil",
  async ({ perfilId, nome, avatar }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/usuarios/perfis/${perfilId}`, { nome, avatar });
      return response.data.perfis; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.erro || "Erro ao editar perfil");
    }
  }
);

// REMOVER PERFIL
export const removerPerfil = createAsyncThunk(
  "user/removerPerfil",
  async (perfilId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/usuarios/perfis/${perfilId}`);
      return response.data.perfis; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.erro || "Erro ao remover perfil");
    }
  }
);



// STATE
const initialState = {
  id: null,
  nome: "",
  sobrenome: "",
  email: "",
  data_nascimento: null,
  role: "",
  lista_desejos: [],
  
  
  perfis: [],
  perfilAtivo: null, 
  assinatura: {
     tipo_plano: null,
     tipo_pagamento: null,
     status: "inativo"
  },
  token: sessionStorage.getItem('token') || null,
  isAuthenticated: !!sessionStorage.getItem('token'),

  statusRequest: "idle", 
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
    },
    

    selecionarPerfilAtivo: (state, action) => {
      state.perfilAtivo = action.payload;
    },

    logout: (state) => {
      state.id = null;
      state.nome = "";
      state.sobrenome = "";
      state.email = "";
      state.data_nascimento = null;
      state.role = "";
      state.perfis = [];
      state.perfilAtivo = null;

      state.assinatura = {
        tipo_plano: null,
        tipo_pagamento: null,
        status: "inativo"
      };

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
        state.sobrenome = action.payload.sobrenome;
        state.email = action.payload.email;
        state.data_nascimento = action.payload.data_nascimento;
        state.role = action.payload.role;
        state.perfis = action.payload.perfis || []; // Adicionado
        
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
        
        const { token, usuario } = action.payload; 
        
        if (token) {
          sessionStorage.setItem('token', token);
          state.token = token;
        }

        state.id = usuario?.id || null;
        state.nome = usuario?.nome || "";
        state.email = usuario?.email || "";
        state.role = usuario?.role || "";
        state.perfis = usuario?.perfis || []; 

        state.assinatura = usuario?.assinatura || {
          tipo_plano: null,
          tipo_pagamento: null,
          status: "inativo"
        };
        
        state.isAuthenticated = true;
        state.error = null;
      })

      // PLANO E USUARIO
      .addCase(atualizarPlano.fulfilled, (state, action) => {
        state.assinatura = action.payload.assinatura;
      })
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

      // WISHLIST
      .addCase(buscarWishlist.fulfilled, (state, action) => {
        state.lista_desejos = action.payload;
      })
      .addCase(adicionarWishlist.fulfilled, (state, action) => {
        state.lista_desejos = action.payload;
      })
      .addCase(removerWishlist.fulfilled, (state, action) => {
        state.lista_desejos = action.payload;
      })

      .addCase(adicionarPerfil.fulfilled, (state, action) => {
        state.perfis = action.payload; 
      })
      .addCase(editarPerfil.fulfilled, (state, action) => {
        state.perfis = action.payload;
      })
      .addCase(removerPerfil.fulfilled, (state, action) => {
        state.perfis = action.payload;
        if (state.perfilAtivo && !action.payload.find(p => p._id === state.perfilAtivo._id)) {
            state.perfilAtivo = null;
        }
      });
  }
});

// EXPORTS
export const { logout, selecionarPlano, selecionarPerfilAtivo } = userSlice.actions;
export default userSlice.reducer;