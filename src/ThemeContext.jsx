// ThemeContext.jsx
import { createContext } from "react";

const ThemeContext = createContext({
  appearance: "light",
  toggleAppearance: () => {},
});

export default ThemeContext;
