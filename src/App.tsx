import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import LedgerPage from "./pages/LedgerPage.tsx";
import EmiLoansPage from "./pages/EmiLoansPage.tsx";
import SendMoneyPage from "./pages/SendMoneyPage.tsx";
import MorePage from "./pages/MorePage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import AccountsPage from "./pages/AccountsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/emi-loans" element={<EmiLoansPage />} />
          <Route path="/send-money" element={<SendMoneyPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
