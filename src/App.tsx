import { Route, Routes } from "react-router-dom";

import { ToastProvider } from "@/components/ui/Toast";
import { MainLayout } from "@/layouts/MainLayout";
import AboutPage from "@/pages/AboutPage";
import CataloguesPage from "@/pages/CataloguesPage";
import ContactPage from "@/pages/ContactPage";
import DocumentDetailPage from "@/pages/DocumentDetailPage";
import GenerateSubmittalPage from "@/pages/GenerateSubmittalPage";
import HomePage from "@/pages/HomePage";
import MaterialSubmittalsPage from "@/pages/MaterialSubmittalsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProductsPage from "@/pages/ProductsPage";
import TechnicalLibraryPage from "@/pages/TechnicalLibraryPage";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/library" element={<TechnicalLibraryPage />} />
          <Route path="/library/:slug" element={<DocumentDetailPage />} />
          <Route path="/catalogues" element={<CataloguesPage />} />
          <Route path="/material-submittals" element={<MaterialSubmittalsPage />} />
          <Route path="/material-submittals/generate" element={<GenerateSubmittalPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
