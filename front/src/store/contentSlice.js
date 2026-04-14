import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Thunk para listar conteúdos
export const listarConteudos = createAsyncThunk(
  "content/listar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/conteudos");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Erro ao buscar conteúdos");
    }
  }
);

export const criarConteudo = createAsyncThunk(
  "content/criar",
  async (contentData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState(); // Pega o token do slice de usuário
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const response = await api.post("/conteudos", contentData, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Erro ao criar conteúdo");
    }
  }
);
// Thunk para adicionar episódio
export const adicionarEpisodio = createAsyncThunk(
  "content/adicionarEpisodio",
  async ({ serieId, numeroTemporada, dadosEpisodio }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      // Note que o ID vai na URL, e o restante no body
      const response = await api.patch(
        `/conteudos/${serieId}/episodios`, 
        { numeroTemporada, episodio: dadosEpisodio },
        config
      );

      return response.data.serie; // Retorna a série atualizada do backend
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Erro ao adicionar episódio");
    }
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState: {
    items: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listarConteudos.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(criarConteudo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(adicionarEpisodio.fulfilled, (state, action) => {
        const serieAtualizada = action.payload;
        const index = state.items.findIndex(c => c._id === serieAtualizada._id);
        if (index !== -1) {
          state.items[index] = serieAtualizada;
        }
      });
  }
});

export default contentSlice.reducer;