import React, { useEffect, useState } from "react";
import {
  Package,
  List,
  PlusCircle,
  AlertCircle,
  BarChart2,
  Search,
  Filter,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const navItems = [
  { href: "/stock", icon: List, label: "Listado" },
  { href: "/stock/new", icon: PlusCircle, label: "Nuevo Producto" },
  { href: "/stock/control", icon: AlertCircle, label: "Control" },
  { href: "/stock/reports", icon: BarChart2, label: "Reportes" },
];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarInput, setMostrarInput] = useState(false);
  const [mostrarInput1, setMostrarInput1] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Llamada a la API para obtener los productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("✅ Productos recibidos:", response.data); // Verifica que los productos lleguen bien
        setProducts(response.data);
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    // Llamada a la API para obtener categorías
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/categories/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✅ Categorías recibidas:", response.data); // Verifica que las categorías lleguen bien
        setCategories(response.data);
      } catch (error) {
        console.error("❌ Error al obtener categorías:", error);
      }
    };

    if (token) {
      fetchProducts();
      fetchCategories(); // Obtener categorías al cargar el componente
    } else {
      console.error("Token not found");
    }
  }, [token]);

  // Filtrar productos por nombre
  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-72 h-72 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

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
  const deleteCategory = (categoria_id) => {
    console.log("ID de la categoría a eliminar:", categoria_id);
    if (!categoria_id) {
      console.error("ID de categoría no válido");
      return;
    }

    axios
      .delete(`http://localhost:8000/categories/${categoria_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert("Categoría eliminada correctamente");

        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoria_id)
        );
      })
      .catch((error) => {
        console.error("Error al eliminar la categoría:", error);
        alert("Hubo un problema al eliminar la categoría.");
      });
  };

  const handleViewProduct = (product) => {
    console.log("Product to view:", product); 
    if (product && product.codigo) {
      navigate(`/Stock/Vista/${product.codigo}`);
    } else {
      console.error("Invalid product ID");
    }
  };

  const deleteProduct = async (codigo) => {
    if (!codigo) {
      console.error("ID de producto no válido");
      return;
    }

    try {
      const confirmDelete = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!confirmDelete.isConfirmed) {
        console.log("Eliminación cancelada");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/products/${codigo}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Producto eliminado con éxito:", response.data);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.codigo !== codigo)
      );

      await Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
    } catch (error) {
      console.error("❌ Error al eliminar el producto:", error);
      Swal.fire("Error", "No se pudo eliminar el producto.", "error");
    }
  };
 

  // const handleEditProduct = (product) => {
  //   console.log("Product a editar:", product); 
  //   if (product && product.codigo) {
    
  //     navigate(`/Stock/Edicion/${product.codigo}`);
  //   } else {
  //     console.error("Invalid product ID");
  //   }
  // };

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
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
            >
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
              <input
                type="text"
                placeholder="Busca por nombre o letra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
                className="border p-2 rounded w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md mr-2">
              <Filter className="h-5 w-5" />
              Filtros
            </button>
          </div>

          <div className="flex items-center">
            <button
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md mr-2"
              onClick={() => setMostrarInput(!mostrarInput)}
            >
              {mostrarInput ? "Cerrar" : "Agregar Categoría"}
            </button>

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
                  className="ml-2 mr-2 px-4 py-2 bg-green-600 cursor-pointer text-white rounded-md"
                  onClick={handleAgregarCategoria}
                >
                  Guardar
                </button>
              </div>
            )}
            <button className="cursor-pointer px-4 py-2 bg-yellow-600 text-white rounded-md mr-2">
              Editar Categoría
            </button>

            <div className="flex items-center gap-2">
              <select
                className="border p-2 rounded"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-md"
                onClick={() => deleteCategory(selectedCategory)}
              >
                Eliminar Categoría
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Productos */}
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.codigo}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.categoria?.name || "Sin categoría"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${product.precio_venta}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <button
                    className="mr-4"
                    onClick={() => handleViewProduct(product)}
                  >
                    <FaEye />
                  </button>

                  <button onClick={() => deleteProduct(product.codigo)}>
                    {" "}
                    <MdDelete />{" "}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
