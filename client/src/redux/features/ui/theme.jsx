import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

const initialState = {
  theme: getInitialTheme(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);

      if (action.payload === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
});

export const { setTheme } = uiSlice.actions;
export default uiSlice.reducer;
