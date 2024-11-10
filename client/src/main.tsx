import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { HomePage } from "./pages/HomePage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route>404 Page Not Found</Route>
      </Switch>
    </SWRConfig>
  </StrictMode>
);
