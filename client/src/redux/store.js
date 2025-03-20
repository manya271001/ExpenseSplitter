import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; 
import groupReducer from "./groupSlice ";  
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";  

const persistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer); // Persist user only

const store = configureStore({
  reducer: {
    user: persistedUserReducer,  //  Persisted user reducer
    groups: groupReducer, //  Not persisted (avoids issues)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
export default store;
