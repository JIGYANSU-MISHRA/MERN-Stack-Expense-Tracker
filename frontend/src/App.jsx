import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Dashboard from './components/Dashboard.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import ExpenseList from './components/ExpenseList.jsx';
import Reports from './components/Reports.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F9FAF7] flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-7xl flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/add" element={<ExpenseForm />} />
            <Route path="/edit/:id" element={<ExpenseForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 