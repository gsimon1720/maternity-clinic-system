import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  FileText, 
  Building2, 
  Database, 
  UserCircle,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'User Management' },
    { path: '/permissions', icon: Shield, label: 'Access Permissions' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/clinic', icon: Building2, label: 'Clinic Info' },
    { path: '/backup', icon: Database, label: 'Backup' },
    { path: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  return (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Heart className="heart-icon" />
          </div>
          {isOpen && <span className="logo-text">MaterniCare</span>}
        </div>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft className="toggle-icon" /> : <ChevronRight className="toggle-icon" />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" />
            {isOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="clinic-version">
          {isOpen && (
            <>
              <p className="version-text">v2.0.0</p>
              <p className="clinic-name">MaterniCare Clinic</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;