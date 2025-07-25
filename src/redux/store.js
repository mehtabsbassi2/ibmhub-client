// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import questionReducer from './questionSlice';
import userReducer from './userSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // only persist user slice
};

const rootReducer = combineReducers({
  user: userReducer,
  questions: questionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
