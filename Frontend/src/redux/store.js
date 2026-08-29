import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// 1. Bypass redux-persist imports entirely and use native browser storage
const customStorage = {
  getItem(_key) {
    return Promise.resolve(window.localStorage.getItem(_key));
  },
  setItem(_key, value) {
    window.localStorage.setItem(_key, value);
    return Promise.resolve(value);
  },
  removeItem(_key) {
    window.localStorage.removeItem(_key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'ai-website-builder',
  version: 1,
  storage: customStorage, // 2. Attach the custom storage here
};

const rootReducer = combineReducers({
  user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;