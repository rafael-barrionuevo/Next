import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tipo_plano: null,
  tipo_pagamento: null,
  status: "inativo"
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.tipo_plano = action.payload.tipo_plano;
      state.tipo_pagamento = action.payload.tipo_pagamento;
      state.status = action.payload.status;
    },
    resetSubscription: (state) => {
      state.tipo_plano = null;
      state.tipo_pagamento = null;
      state.status = "inativo";
    }
  }
});

export const { setSubscription, resetSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;