import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wallet, Plus, List, ChartBar, ListDashes, ChartLine } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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
          
          {isAuthenticated ? (
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
          ) : (
            <div className="hidden md:block" />
          )}

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="hidden md:inline text-white/90 text-sm max-w-[220px] truncate">
                  {user?.email || 'Signed in'}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/auth');
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  Logout
                </button>
                <div className="md:hidden">
                  <button className="text-white hover:text-gray-100 p-2 rounded-lg hover:bg-white/10">
                    <ListDashes className="w-6 h-6" weight="bold" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="bg-white text-[#14532D] hover:bg-gray-100 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 