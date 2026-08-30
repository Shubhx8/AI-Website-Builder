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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(window.localStorage.getItem(_key));
      }, 0);
    });
  },
  setItem(_key, value) {
    return new Promise((resolve) => {
      setTimeout(() => {
        window.localStorage.setItem(_key, value);
        resolve(value);
      }, 0);
    });
  },
  removeItem(_key) {
    return new Promise((resolve) => {
      setTimeout(() => {
        window.localStorage.removeItem(_key);
        resolve();
      }, 0);
    });
  },
};

const persistConfig = {
  key: 'ai-website-builder',
  version: 1,
  storage: customStorage, // 2. Attach the custom storage here
  timeout: 100, // 3. Force hydration to complete instantly instead of hitting the default 5000ms failsafe timeout
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