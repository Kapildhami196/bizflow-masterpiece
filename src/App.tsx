import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "./pages/SplashScreen";
import AuthPage from "./pages/AuthPage";
import AccountSetupPage from "./pages/AccountSetupPage";
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
import UserManagementPage from "./pages/UserManagementPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import BudgetPage from "./pages/BudgetPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account-setup" element={<AccountSetupPage />} />
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
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/user-management" element={<UserManagementPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/orders" element={<OrderManagementPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
