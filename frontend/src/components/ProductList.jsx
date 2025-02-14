import React, { useEffect, useState } from 'react';
import { Package, List, PlusCircle, AlertCircle, BarChart2, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';

const navItems = [
  { href: "/stock", icon: List, label: "Listado" },
  { href: "/stock/new", icon: PlusCircle, label: "Nuevo Producto" },
  { href: "/stock/control", icon: AlertCircle, label: "Control" },
  { href: "/stock/reports", icon: BarChart2, label: "Reportes" },
];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el token de localStorage
  const token = localStorage.getItem('token');

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products/all', {
          headers: {
            Authorization: `Bearer ${token}`  // Enviar el token en los encabezados
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    } else {
      console.error('Token not found');
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 flex items-center gap-2 border-b">
          <Package className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold">Gestión de Stock</h1>
        </div>
        <nav className="p-4">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
              <item.icon className="h-5 w-5 text-gray-600" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold mb-6">Listado de Productos</h1>
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.codigo}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.categoria?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.precio_venta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
