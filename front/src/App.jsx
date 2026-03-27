import {BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Planos from "./pages/Planos";
import Pagamento from "./pages/Pagamento";
import Perfil from "./pages/Perfil";
import Landing from "./pages/Landing";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/planos" element={<Planos/>} />
        <Route path="/pagamento" element={<Pagamento/>} />
        <Route path="/perfil" element={<Perfil />} />
         <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
