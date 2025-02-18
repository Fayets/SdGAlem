import React, { useEffect, useState } from "react";
import { Package, List, PlusCircle, AlertCircle, BarChart2, Search, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";



const navItems = [
  { href: "/stock", icon: List, label: "Listado" },
  { href: "/stock/new", icon: PlusCircle, label: "Nuevo Producto" },
  { href: "/stock/control", icon: AlertCircle, label: "Control" },
  { href: "/stock/reports", icon: BarChart2, label: "Reportes" },
];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarInput, setMostrarInput] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");


  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAgregarCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/categories/register", 
        { name: nuevaCategoria },  
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      alert("Categoría agregada correctamente");
      setNuevaCategoria(""); 
      setMostrarInput(false); 
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      alert("Hubo un error al agregar la categoría.");
    }
  };


  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Listado de Productos</h1>

        {/* Search & Actions */}
        <div className="flex justify-between mb-6">
          <div className="flex gap-4">
            <div className="relative">
              <input type="text" placeholder="Buscar productos..." className="pl-10 pr-4 py-2 border rounded-md" />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md">
              <Filter className="h-5 w-5" />
              Filtros
            </button>
          </div>

          <div className="flex items-center">
            {/* Botón para mostrar input de categoría */}
            <button
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md mr-2"
              onClick={() => setMostrarInput(!mostrarInput)}
            >
              {mostrarInput ? "Cerrar" : "Agregar Categoría"}
            </button>

            {/* Input para agregar categoría */}
            {mostrarInput && (
              <div className="relative ml-2 flex items-center">
                <input
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Escribe una categoría..."
                />

                <button
                    className="ml-2 mr-2 px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={handleAgregarCategoria} // Llamar a la función que envía los datos
                  >
                    Guardar
                </button>
              </div>
            )}

            <button className="cursor-pointer px-4 py-2 bg-yellow-600 text-white rounded-md mr-2">Editar Categoría</button>
            <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => navigate("/register-product")}>
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Tabla de Productos */}
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.codigo}>
                <td className="px-6 py-4 whitespace-nowrap">{product.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.categoria?.name || "Sin categoría"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">${product.precio_venta}</td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <button className="mr-4">Ver</button>
                  <button>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
