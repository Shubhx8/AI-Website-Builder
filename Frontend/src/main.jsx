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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<FullScreenLoader />} persistor={persistor} >
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)