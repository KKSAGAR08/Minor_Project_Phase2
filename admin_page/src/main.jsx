import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Loading } from "./components/ui/loading";
import { ThemeProvider } from "./lib/theme";
import { Loader } from "./lib/loader";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Loader>
      <App />
    </Loader>
  </ThemeProvider>,
);
