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
    }
  }
});

export const { setSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;