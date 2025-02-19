import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import { Package, List, PlusCircle, AlertCircle, BarChart2, Search, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function StockControl() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  
 const navigate = useNavigate();

  const navItems = [
    { href: "/stock", icon: List, label: "Listado" },
    { href: "/stock/new", icon: PlusCircle, label: "Nuevo Producto" },
    { href: "/stock/control", icon: AlertCircle, label: "Control" },
    { href: "/stock/reports", icon: BarChart2, label: "Reportes" },
  ];

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products/low_stock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data); // Asignar los datos a 'products'
      } catch (error) {
        console.error("Error fetching stock:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStock();
    } else {
      console.error("Token not found");
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-72 h-72 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
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
      <div className=" pl-2 pr-2  w-full">
      <h1 className="text-2xl font-bold mb-6">Control de Stock</h1>
      {products.length > 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <div>
              <p className="font-bold">Alerta de Stock Bajo</p>
              <p>Los siguientes productos tienen un stock por debajo del mínimo establecido.</p>
            </div>
          </div>
        </div>
      )}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Mínimo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.codigo}>
              <td className="px-6 py-4 whitespace-nowrap">{product.codigo}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">{product.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.stock_minimo}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer " onClick={() => navigate("/register-product")}>Ajustar Stock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    </div>
  );
}
