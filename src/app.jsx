import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import VendedoresPage from './pages/VendedoresPage';
import DespesasPage from './pages/DespesasPage';
import ReceitasPage from './pages/ReceitasPage';
import SociosPage from './pages/SociosPage';
import EventosPage from './pages/EventosPage';
import ContasPage from './pages/ContasPage';
import FluxoCaixaPage from './pages/FluxoCaixaPage';
import LotesPage from './pages/LotesPage';
import EquipamentosPage from './pages/EquipamentosPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/vendedores" element={<VendedoresPage />} />
        <Route path="/despesas" element={<DespesasPage />} />
        <Route path="/receitas" element={<ReceitasPage />} />
        <Route path="/socios" element={<SociosPage />} />
        <Route path="/eventos" element={<EventosPage />} />
        <Route path="/contas" element={<ContasPage />} />
        <Route path="/fluxo-caixa" element={<FluxoCaixaPage />} />
        <Route path="/lotes" element={<LotesPage />} />
        <Route path="/equipamentos" element={<EquipamentosPage />} />
      </Route>
    </Routes>
  );
}
