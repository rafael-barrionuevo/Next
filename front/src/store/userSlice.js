import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  nome: "",
  email: "",
  isAuthenticated: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.nome = action.payload.nome;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.id = null;
      state.nome = "",
      state.email = "",
      state.isAuthenticated = false;
    }
  }
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;