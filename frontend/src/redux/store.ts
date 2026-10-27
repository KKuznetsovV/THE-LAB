import { configureStore } from '@reduxjs/toolkit';
import { bottlesReducer, eventsReducer, galleryReducer, menuReducer, spiritsReducer } from './collections';
import settingsReducer from './settings-slice';

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    menu: menuReducer,
    bottles: bottlesReducer,
    events: eventsReducer,
    gallery: galleryReducer,
    spirits: spiritsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
