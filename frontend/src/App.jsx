import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList'; 
import ProductForm from './components/RegisterProduct';
<<<<<<< HEAD
import StockControl from './components/ControInventary';  
import StockReports from './components/StockReports';
=======
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Stock" element={<ProductList />} />  
        <Route path="/Stock/New" element={<ProductForm />} />
<<<<<<< HEAD
        <Route path="/Stock/Control" element={<StockControl />} />
        <Route path="/Stock/Reports" element={<StockReports />} />

=======
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
        
        <Route path="/register-product" element={<ProductForm />} />
  
      </Routes>
    </Router>
  );
}

export default App;
