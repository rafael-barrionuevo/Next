import {BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Planos from "./pages/Planos";
import Pagamento from "./pages/Pagamento";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/planos" element={<Planos/>} />
        <Route path="/pagamento" element={<Pagamento/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
