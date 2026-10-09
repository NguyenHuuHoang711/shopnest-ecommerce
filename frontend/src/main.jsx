import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import ErrorBoundary from "./components/feedback/error/ErrorBoundary";
import { FilterProvider } from "@/context/FilterContext";

import Toaster from "./components/ui/toaster";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <FilterProvider>
          <App />
          <Toaster />
        </FilterProvider>
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);
