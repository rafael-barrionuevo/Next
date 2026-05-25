import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Planos from "./pages/Planos";
import Pagamento from "./pages/Pagamento";
import Perfil from "./pages/Perfil";
import Landing from "./pages/Landing";
import HomePage from "./pages/HomePage.jsx";
import WatchContent from "./pages/WatchContent.jsx";
import ContentInfo from "./pages/ContentInfo.jsx";
import WishList from "./pages/WishList.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import AdminCatalogo from "./pages/AdminCatalogo.jsx";
import PerfilUser from "./pages/PerfilUser.jsx";
import GerenciarPerfis from "./pages/GerenciarPerfis.jsx";
import AdicionarPerfil from "./pages/AdicionarPerfil.jsx";
import AdminPlanos from "./pages/AdminPlanos.jsx";
import Serie from "./pages/Serie.jsx";
import Filme from "./pages/Filme.jsx";
import Downloads from "./pages/Downloads.jsx";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/planos" element={<AdminPlanos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/info/:id" element={<ContentInfo />} />
        <Route path="/video/:id" element={<WatchContent />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/perfilUser" element={<PerfilUser />} />
        <Route path="/admin/catalogo" element={<AdminCatalogo />} />
        <Route path="/gerenciar-perfis" element={<GerenciarPerfis />} />
        <Route path="/adicionar-perfil" element={<AdicionarPerfil />} />
        <Route path="/serie" element={<Serie />} />
        <Route path="/filme" element={<Filme />} />
        <Route path="/downloads" element={<Downloads />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
