import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, List, PlusCircle, AlertCircle, BarChart2 } from "lucide-react"; // Importar iconos
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
  const [categories, setCategories] = useState([]); // Almacenará las categorías del backend
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // Estado para verificar si se están cargando las categorías
  const navigate = useNavigate();

  // Obtener el token de localStorage (o el lugar donde lo guardes)
  const token = localStorage.getItem('token'); // Ajusta esto según tu método de almacenamiento del token

  // Obtener todas las categorías del backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories/all', {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
          },
        });
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data); // Guardamos las categorías obtenidas
        } else {
          console.error("Formato de datos inesperado");
        }
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      } finally {
        setIsLoadingCategories(false); // Indicamos que las categorías ya se cargaron
      }
    };

    fetchCategories();
  }, [token]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Enviar los datos al backend
      const response = await axios.post('http://localhost:8000/products/register', {
        codigo: code,
        nombre: name,
        categoria: category,
        stock,
        precio_venta: price,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token también al registrar el producto
        }
      });

      if (response.status === 201) {
        // Si la creación fue exitosa, redirigir al listado de productos
        navigate('/stock');
      }
    } catch (error) {
      console.error("Error al registrar el producto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Producto</h1>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Seleccionar categoría</option>
                {isLoadingCategories ? (
                  <option value="">Cargando categorías...</option>
                ) : (
                  categories.map((categoryItem) => (
                    <option key={categoryItem.id} value={categoryItem.id}>
                      {categoryItem.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Inicial
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Guardar Producto'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
