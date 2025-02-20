import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, List, PlusCircle, AlertCircle, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
    { href: "/stock", icon: List, label: "Listado" },
    { href: "/stock/new", icon: PlusCircle, label: "Nuevo Producto" },
    { href: "/stock/control", icon: AlertCircle, label: "Control" },
    { href: "/stock/reports", icon: BarChart2, label: "Reportes" },
];

export default function ProductForm() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [stockInitial, setStockInitial] = useState('');
    const [stockMin, setStockMin] = useState('');
    const [priceSale, setPriceSale] = useState('');
    const [priceCost, setPriceCost] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/categories/all', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluir token en la petición de categorías
                    },
                });

                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                    console.log("Categorías recibidas:", JSON.stringify(response.data, null, 2));
                } else {
                    console.error("Formato de datos inesperado");
                    setError("Error al cargar las categorías. Formato de datos incorrecto.");
                }
            } catch (error) {
                console.error("Error al obtener las categorías:", error.response ? error.response.data : error.message);
                setError("Error al cargar las categorías. Inténtelo de nuevo más tarde.");
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [token]);


    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      // Convertir el id a número
      const categoriaId = Number(category);
  
      if (isNaN(categoriaId)) {
          setError("ID de categoría inválido.");
          setLoading(false);
          return;
      }
  
      console.log("Datos a enviar:", {
          codigo: code,
          nombre: name,
          categoria_id: categoriaId,  // Ahora es un número
          stock: stockInitial,
          stock_minimo: stockMin,
          precio_venta: priceSale,
          precio_costo: priceCost,
      });
  
      try {
          const response = await axios.post('http://localhost:8000/products/register', {
              codigo: code,
              nombre: name,
              categoria_id: categoriaId,
              stock: stockInitial,
              stock_minimo: stockMin,
              precio_venta: priceSale,
              precio_costo: priceCost,
          }, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
  
          if (response.status === 201) {
              navigate('/stock');
          }
      } catch (error) {
          console.error("Error al registrar el producto:", error.response ? error.response.data : error.message);
          setError("Error al registrar el producto. Inténtelo de nuevo más tarde.");
      } finally {
          setLoading(false);
      }
  };
  

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
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Producto</h1>

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full px-3 py-2 border rounded-md"
    required
>
    <option value="">Seleccionar categoría</option>
    {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
            {cat.name}
        </option>
    ))}
</select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                            <input type="number" value={stockInitial} onChange={(e) => setStockInitial(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                            <input type="number" value={stockMin} onChange={(e) => setStockMin(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta</label>
                            <input type="number" value={priceSale} onChange={(e) => setPriceSale(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Costo</label>
                            <input type="number" value={priceCost} onChange={(e) => setPriceCost(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" disabled={loading}>
                            {loading ? 'Registrando...' : 'Guardar Producto'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}