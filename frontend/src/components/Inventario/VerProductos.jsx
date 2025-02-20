import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Asegúrate de importar axios
import { Package, List, PlusCircle, AlertCircle, BarChart2, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import EditProduct from './EditProduct';


const navItems = [
  { href: "/stock", icon: List, label: "Listado" },
  { href: "/stock/new", icon: PlusCircle, label: "Nuevo Producto" },
  { href: "/stock/control", icon: AlertCircle, label: "Control" },
  { href: "/stock/reports", icon: BarChart2, label: "Reportes" },
];

const VerProductos = () => {
  const [productos, setProductos] = useState([]);  // Estado para almacenar los productos
  const [loading, setLoading] = useState(true);  // Estado para el loading
  const token = localStorage.getItem("token");  // Token de autenticación, si es necesario
  const { codigo } = useParams(); // Obtiene el código del producto desde la URL
  const [product, setProduct] = useState(null);
  const [VerEditar,SetVerEditar] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/products/get/${codigo}`,{
          headers: {Authorization: `Bearer ${token}`}
        });
        console.log(response.data)
        setProduct(response.data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchProduct();
  }, [codigo, token]);

  if (!product) {
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

                    
                <div className="flex items-center mb-6">
                    <h1 className="text-2xl font-bold">Detalle del Producto</h1>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2>Detalles del Producto</h2>
                        <p><strong>Nombre:</strong> {product.nombre}</p>
                        <p><strong>Categoría:</strong> {product.categoria?.name || "Sin categoría"}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>Precio:</strong> ${product.precio_venta}</p>
                    </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Acciones</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2" onClick={()=> SetVerEditar(true)}>Editar Producto</button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">Ajustar Stock</button>
                </div>
          </div>
          <div  className={VerEditar == true ? `bg-white p-6 rounded-lg shadow-md` : ``}>
                          {VerEditar == true ? (
                            <EditProduct product={product}/>
                          ):("")}
                        </div>
                        
          </main>
                        
        </div>
                    
         
      )
}

export default VerProductos
