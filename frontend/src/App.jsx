import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import ExpenseList from './components/ExpenseList.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<ExpenseForm />} />
            <Route path="/edit/:id" element={<ExpenseForm />} />
            <Route path="/expenses" element={<ExpenseList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 