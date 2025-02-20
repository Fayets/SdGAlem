import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProductList from '../src/components/Inventario/ProductList';
import ProductForm from './components/Inventario/RegisterProduct';
import StockControl from './components/Inventario/ControInventary';  
import StockReports from './components/Inventario/StockReports';
import VerProducto from './components/Inventario/VerProductos'
// import EditProduct from './components/Inventario/EditProduct';


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
        <Route path="/Stock/Vista/:codigo" element={<VerProducto />} />





        
        <Route path="/register-product" element={<ProductForm />} />
  
      </Routes>
    </Router>
  );
}

export default App;
