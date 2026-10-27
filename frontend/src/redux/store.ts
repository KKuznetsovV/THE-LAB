import { configureStore } from '@reduxjs/toolkit';

function rootReducer(state: Record<string, never> = {}): Record<string, never> {
  return state;
}

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
