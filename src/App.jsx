import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';

// Layouts & Utils
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import RedirectHandler from './components/common/RedirectHandler';

// Public Pages
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import TourTypesPage from './pages/TourTypesPage';
import TourTypeDetailPage from './pages/TourTypeDetailPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ExperienceDetailPage from './pages/ExperienceDetailPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ResponsibleTourismPage from './pages/ResponsibleTourismPage';
import PlanYourTripPage from './pages/PlanYourTripPage';
import ShopPage from './pages/ShopPage';
import ShopCategoryPage from './pages/ShopCategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';

// Multi-region Public Pages
import RegionsPage from './pages/RegionsPage';
import RegionDetailPage from './pages/RegionDetailPage';
import SignatureRoutesPage from './pages/SignatureRoutesPage';
import MountainsPage from './pages/MountainsPage';
import CollectionsPage from './pages/CollectionsPage';
import WhyEthiopiaPage from './pages/WhyEthiopiaPage';

import companyData from './data/companyData';

// --- ADMIN IMPORTS ---
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import MigrationPage from './admin/pages/MigrationPage';
import DatabaseManagerPage from './admin/pages/DatabaseManagerPage';

// Tours Admin
import ToursListPage from './admin/pages/ToursListPage';
import TourEditorPage from './admin/pages/TourEditorPage';

// Destinations Admin
import DestinationsListPage from './admin/pages/DestinationsListPage';
import DestinationEditorPage from './admin/pages/DestinationEditorPage';

// Regions Admin
import RegionsListPage from './admin/pages/RegionsListPage';
import RegionEditorPage from './admin/pages/RegionEditorPage';

// Signature Routes Admin
import SignatureRoutesListPage from './admin/pages/SignatureRoutesListPage';
import SignatureRouteEditorPage from './admin/pages/SignatureRouteEditorPage';

// Mountains Admin
import MountainsListPage from './admin/pages/MountainsListPage';
import MountainEditorPage from './admin/pages/MountainEditorPage';

// Shop Admin
import ShopCategoriesPage from './admin/pages/ShopCategoriesPage';
import ShopCategoryEditorPage from './admin/pages/ShopCategoryEditorPage';
import ShopProductsListPage from './admin/pages/ShopProductsListPage';
import ShopProductEditorPage from './admin/pages/ShopProductEditorPage';

// Collections Admin
import CollectionsListPage from './admin/pages/CollectionsListPage';
import CollectionEditorPage from './admin/pages/CollectionEditorPage';

// Experiences Admin
import ExperiencesListPage from './admin/pages/ExperiencesListPage';
import ExperienceEditorPage from './admin/pages/ExperienceEditorPage';

// Communications Admin
import InquiriesPage from './admin/pages/InquiriesPage';
import SubscribersPage from './admin/pages/SubscribersPage';

// Settings Admin
import TeamPage from './admin/pages/TeamPage';
import SettingsPage from './admin/pages/SettingsPage';

// Public layout wrapper
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen font-sans bg-[#FAF7F2] text-[#1C1917] selection:bg-[#C88A2E] selection:text-white">
    <Header />
    <main className="flex-grow">{children}</main>
    
    {/* Floating WhatsApp Button */}
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 group">
      <div className="bg-stone-900 text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
        Chat with Zerihun on WhatsApp
      </div>
      <a
        href={companyData.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border-2 border-white"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
      </a>
    </div>
    
    <Footer />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <RedirectHandler />
      
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <Routes>
        {/* ============================================================ */}
        {/* ADMIN ROUTES (CMS)                                           */}
        {/* ============================================================ */}
        <Route path="/admin/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          
          {/* Tours */}
          <Route path="tours" element={<ToursListPage />} />
          <Route path="tours/new" element={<TourEditorPage />} />
          <Route path="tours/:id/edit" element={<TourEditorPage />} />
          
          {/* Destinations */}
          <Route path="destinations" element={<DestinationsListPage />} />
          <Route path="destinations/new" element={<DestinationEditorPage />} />
          <Route path="destinations/:id/edit" element={<DestinationEditorPage />} />
          
          {/* Regions */}
          <Route path="regions" element={<RegionsListPage />} />
          <Route path="regions/new" element={<RegionEditorPage />} />
          <Route path="regions/:id/edit" element={<RegionEditorPage />} />
          
          {/* Signature Routes */}
          <Route path="signature-routes" element={<SignatureRoutesListPage />} />
          <Route path="signature-routes/new" element={<SignatureRouteEditorPage />} />
          <Route path="signature-routes/:id/edit" element={<SignatureRouteEditorPage />} />
          
          {/* Mountains */}
          <Route path="mountains" element={<MountainsListPage />} />
          <Route path="mountains/new" element={<MountainEditorPage />} />
          <Route path="mountains/:id/edit" element={<MountainEditorPage />} />
          
          {/* Generic Collections */}
          <Route path="collections/:type" element={<CollectionsListPage />} />
          <Route path="collections/:type/new" element={<CollectionEditorPage />} />
          <Route path="collections/:type/:id/edit" element={<CollectionEditorPage />} />
          
          {/* Experiences */}
          <Route path="experiences" element={<ExperiencesListPage />} />
          <Route path="experiences/new" element={<ExperienceEditorPage />} />
          <Route path="experiences/:id/edit" element={<ExperienceEditorPage />} />
          
          {/* Shop */}
          <Route path="shop" element={<ShopCategoriesPage />} />
          <Route path="shop/categories/new" element={<ShopCategoryEditorPage />} />
          <Route path="shop/categories/:id/edit" element={<ShopCategoryEditorPage />} />
          <Route path="shop/products" element={<ShopProductsListPage />} />
          <Route path="shop/products/new" element={<ShopProductEditorPage />} />
          <Route path="shop/products/:id/edit" element={<ShopProductEditorPage />} />
          
          {/* Communications */}
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          
          {/* Settings */}
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Database Tools */}
          <Route path="database" element={<DatabaseManagerPage />} />
          <Route path="migration" element={<MigrationPage />} />
        </Route>

        {/* ============================================================ */}
        {/* PUBLIC ROUTES (Website)                                      */}
        {/* ============================================================ */}
        <Route path="*" element={
          <PublicLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/regions" element={<RegionsPage />} />
              <Route path="/regions/:slug" element={<RegionDetailPage />} />
              <Route path="/signature-routes" element={<SignatureRoutesPage />} />
              <Route path="/mountains" element={<MountainsPage />} />
              <Route path="/collections/:type" element={<CollectionsPage />} />
              <Route path="/why-ethiopia" element={<WhyEthiopiaPage />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/tours/:slug" element={<TourDetailPage />} />
              <Route path="/trip/:slug" element={<TourDetailPage />} />
              <Route path="/trips-advertsement" element={<ToursPage />} />
              <Route path="/itineraries" element={<ToursPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
              <Route path="/destination/:slug" element={<DestinationDetailPage />} />
              <Route path="/tour-types" element={<TourTypesPage />} />
              <Route path="/tour-types/:slug" element={<TourTypeDetailPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/experiences/:slug" element={<ExperienceDetailPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/responsible-tourism" element={<ResponsibleTourismPage />} />
              <Route path="/plan-your-trip" element={<PlanYourTripPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/product/:slug" element={<ProductDetailPage />} />
              <Route path="/shop/:slug" element={<ShopCategoryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/legal/:tab" element={<LegalPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PublicLayout>
        } />
      </Routes>
    </AuthProvider>
  );
}