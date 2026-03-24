import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import LedgerPage from "./pages/LedgerPage";
import TransactionsPage from "./pages/TransactionsPage";
import EmiLoansPage from "./pages/EmiLoansPage";
import MorePage from "./pages/MorePage";
import ProfilePage from "./pages/ProfilePage";
import AccountsPage from "./pages/AccountsPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import CategoriesPage from "./pages/CategoriesPage";
import SettingsPage from "./pages/SettingsPage";
import PosPage from "./pages/PosPage";
import ContactsPage from "./pages/ContactsPage";
import BillingPage from "./pages/BillingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Index />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/emi-loans" element={<EmiLoansPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
