import { render } from "solid-js/web";
import HomePage from "./pages/HomePage";
import { Router, Route, Routes } from "@solidjs/router";
import "./index.css";

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={HomePage} />
      </Routes>
    </Router>
  ),
  document.getElementById("root")
);
