import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Plus, List, ChartBar, ListDashes, ChartLine, Funnel } from 'phosphor-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#14532D] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                PennyGrid
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <ChartBar className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/expenses"
              className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
            >
              <List className="w-4 h-4" />
              <span>Expenses</span>
            </Link>
            
            <Link
              to="/reports"
              className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
            >
              <ChartLine className="w-4 h-4" />
              <span>Reports</span>
            </Link>
            
            <Link
              to="/add"
              className={`nav-link ${isActive('/add') ? 'active' : ''}`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </Link>
          </nav>

          <div className="md:hidden">
            <button className="text-white hover:text-gray-100 p-2 rounded-lg hover:bg-white/10">
              <ListDashes className="w-6 h-6" weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 