import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, Compass, MapPin, ShoppingBag, 
  Users, MessageSquare, Settings, LogOut, Menu, X, ExternalLink, Database,
  Globe, Sparkles, Mountain, Mail, Layers, ChevronDown, HardDrive, Upload
} from 'lucide-react';
import { DinqLogo } from '../../components/common/DinqLogo';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  
  // CONTENT
  { label: 'Tours & Safaris', icon: Compass, path: '/admin/tours' },
  { label: 'Destinations', icon: MapPin, path: '/admin/destinations' },
  { label: 'Regions', icon: Globe, path: '/admin/regions' },
  { label: 'Signature Routes', icon: Sparkles, path: '/admin/signature-routes' },
  { label: 'Mountains', icon: Mountain, path: '/admin/mountains' },
  { 
    label: 'Collections', 
    icon: Layers, 
    expandable: true,
    key: 'collections',
    children: [
      { label: '🦁 Safari', path: '/admin/collections/safari' },
      { label: '🏛️ UNESCO Sites', path: '/admin/collections/unesco' },
      { label: '🎉 Festivals', path: '/admin/collections/festivals' },
      { label: '🐦 Birding', path: '/admin/collections/birding' },
    ]
  },
  { label: 'Experiences', icon: Sparkles, path: '/admin/experiences' },
  { label: 'Travel Shop', icon: ShoppingBag, path: '/admin/shop' },
  
  // COMMUNICATIONS
  { label: 'Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
  { label: 'Subscribers', icon: Mail, path: '/admin/subscribers' },
  
  // SETTINGS
  { label: 'Team', icon: Users, path: '/admin/team' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
  
  // DATABASE TOOLS (bottom section)
  { label: 'Database Manager', icon: HardDrive, path: '/admin/database', divider: true },
  { label: 'Seed Migration', icon: Upload, path: '/admin/migration' },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({ collections: true });
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  }

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-stone-950 text-stone-300 flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo header */}
        <div className="h-16 flex items-center justify-between px-6 bg-stone-900 border-b border-stone-800 shrink-0">
          <DinqLogo variant="light" size="sm" to={null} />
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-3 px-3">
            Content Management
          </div>
          
          {navItems.map((item) => (
            <React.Fragment key={item.path || item.key}>
              {item.divider && (
                <div className="my-4 border-t border-stone-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-4 mb-3 px-3">
                    Database Tools
                  </div>
                </div>
              )}
              
              {item.expandable ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-stone-900 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus[item.key] ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedMenus[item.key] && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-stone-800 pl-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={({ isActive }) => `block px-3 py-2 rounded-lg text-xs transition-colors ${
                            isActive ? 'bg-[#C88A2E]/10 text-[#C88A2E] font-medium' : 'hover:bg-stone-900 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive ? 'bg-[#C88A2E]/10 text-[#C88A2E] font-medium border border-[#C88A2E]/20' : 'hover:bg-stone-900 hover:text-white border border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-stone-800 space-y-2 shrink-0">
          <div className="px-3 py-2 text-xs truncate text-stone-500">
            Logged in as: <br/><strong className="text-stone-300">{currentUser?.email}</strong>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-sm text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-stone-600 hover:text-stone-900 p-1">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-serif font-bold text-stone-900 text-lg hidden sm:block">DINQ CMS</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>LIVE SYNC</span>
            </div>
            <Link to="/" target="_blank" className="flex items-center gap-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Site</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-[#F5F5F5] p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}