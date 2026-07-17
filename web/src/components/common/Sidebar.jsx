import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, FileText, 
  Stethoscope, Heart, TestTube, Clipboard, 
  Settings, User, Menu, X, Activity, 
  Syringe, ClipboardList, BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  const isNurse = user?.role === 'nurse';

  const doctorNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor/dashboard' },
    
    
    { icon: FileText, label: 'Clinical Records', href: '/doctor/clinical-records' },
    { icon: Stethoscope, label: 'Diagnosis', href: '/doctor/diagnosis' },
    { icon: Heart, label: 'Treatment', href: '/doctor/treatment' },
    { icon: TestTube, label: 'Investigations', href: '/doctor/investigations' },
    { icon: BarChart3, label: 'Ultrasound', href: '/doctor/ultrasound' },
    
  ];

  const nurseNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/nurse/dashboard' },
   
    { icon: Activity, label: 'Clinic Visits', href: '/nurse/clinic-visits' },
    { icon: Heart, label: 'Vital Signs', href: '/nurse/vital-signs' },
    { icon: Syringe, label: 'Vaccinations', href: '/nurse/vaccinations' },
    { icon: TestTube, label: 'Investigations', href: '/nurse/investigations' },
    { icon: ClipboardList, label: 'Observations', href: '/nurse/observations' },
    
  ];

  const navItems = isDoctor ? doctorNavItems : nurseNavItems;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Maternity</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Clinic Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;