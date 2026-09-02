import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { FullScreenLoader } from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store'

import { PersistGate } from 'redux-persist/integration/react'
import axios from 'axios'
import { persistStore } from 'redux-persist'

const persistor = persistStore(store)

axios.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user?.userData?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 400 && error.response.data?.message === "Token not found") {
      // Clear stale user data and redirect
      store.dispatch({ type: 'user/setUserData', payload: null });
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<FullScreenLoader />} persistor={persistor} >
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)