import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList'; 
import ProductForm from './components/RegisterProduct';
import StockControl from './components/ControInventary';  
import StockReports from './components/StockReports';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Stock" element={<ProductList />} />  
        <Route path="/Stock/New" element={<ProductForm />} />
        <Route path="/Stock/Control" element={<StockControl />} />
        <Route path="/Stock/Reports" element={<StockReports />} />

        
        <Route path="/register-product" element={<ProductForm />} />
  
      </Routes>
    </Router>
  );
}

export default App;
