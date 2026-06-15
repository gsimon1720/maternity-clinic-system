import { Outlet, Link } from 'react-router-dom';
import { Users, Search, LayoutDashboard, LogOut } from 'lucide-react'; // Added LayoutDashboard icon

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-pink-50">
      {/* Sidebar */}
      <aside className="w-64 bg-pink-100 border-r border-pink-200 flex flex-col">
        <div className="p-6 text-2xl font-bold text-pink-900 border-b border-pink-200">Maternity Care</div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Link to the new Stats Dashboard */}
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 p-3 text-pink-900 hover:bg-pink-200 rounded-xl transition-all"
          >
            <LayoutDashboard size={20} className="text-pink-600" /> Dashboard
          </Link>

          {/* Link to the Pending Patients list */}
          <Link 
            to="/pending" 
            className="flex items-center gap-2 p-3 text-pink-900 hover:bg-pink-200 rounded-xl transition-all"
          >
            <Users size={20} className="text-pink-600" /> Pending Patients
          </Link>

          {/* Link to Search */}
          <Link 
            to="/search" 
            className="flex items-center gap-2 p-3 text-pink-900 hover:bg-pink-200 rounded-xl transition-all"
          >
            <Search size={20} className="text-pink-600" /> Search Patients
          </Link>
        </nav>

        <button 
          onClick={() => window.location.href='/'} 
          className="flex items-center gap-2 p-4 text-pink-800 hover:bg-pink-200 border-t border-pink-200"
        >
          <LogOut size={20} className="text-pink-600" /> Logout
        </button>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}