import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {Wallet, Plus, List, BarChart3} from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-soft">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Expense Tracker
              </h1>
              <p className="text-white/80 text-sm">Smart Financial Management</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/add"
              className={`nav-link ${isActive('/add') ? 'active' : ''}`}
            >
              <Plus className="w-5 h-5" />
              <span>Add Expense</span>
            </Link>
            
            <Link
              to="/expenses"
              className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
            >
              <List className="w-5 h-5" />
              <span>All Expenses</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-white/80 transition-colors duration-300 p-2 rounded-xl hover:bg-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 