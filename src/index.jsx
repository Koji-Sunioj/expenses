import { render } from "solid-js/web";
import HomePage from "./pages/HomePage";
import AddExpenses from "./pages/AddExpenses";
import { Router, Route, Routes } from "@solidjs/router";
import "./index.css";

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/add-expenses" component={AddExpenses} />
      </Routes>
    </Router>
  ),
  document.getElementById("root")
);
