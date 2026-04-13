import {BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Planos from "./pages/Planos";
import Pagamento from "./pages/Pagamento";
import Perfil from "./pages/Perfil";
import Landing from "./pages/Landing";
import HomePage from "./pages/HomePage.jsx";
import WatchContent from "./pages/WatchContent.jsx";
import WishList from "./pages/WishList.jsx";
import AdminCadastro from "./pages/AdminCadastro.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import AdminEpisodios from "./pages/AdminEpisodios.jsx";
import AdminRemover from "./pages/adminRemover.jsx";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/planos" element={<Planos/>} />
        <Route path="/pagamento" element={<Pagamento/>} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/video" element={<WatchContent />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/cadastro" element={<AdminCadastro />} />
        <Route path="/admin/episodios" element={<AdminEpisodios />} />
        <Route path="/admin/remover" element={<AdminRemover />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
