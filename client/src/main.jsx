import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./utils/theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
      <AuthProvider isAdmin={false}>
        <App />
      </AuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
