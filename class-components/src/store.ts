import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "./services/pokemon";
import selectionReducer from "./slices/selectionSlice";

const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    selection: selectionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
