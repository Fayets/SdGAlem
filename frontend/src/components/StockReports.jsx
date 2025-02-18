import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, PieChart, Printer } from "lucide-react";

export default function StockReports() {
  const [totalProducts, setTotalProducts] = useState(null);
  const [inventoryValue, setInventoryValue] = useState(null);
  const [lowStockCount, setLowStockCount] = useState(null);

  const token = localStorage.getItem("token");

  // Función para obtener los datos del stock desde el backend
  const fetchStockData = async () => {
    try {
      // Total de productos
      const totalProductsResponse = await axios.get(
        "http://localhost:8000/products/total_products", 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalProducts(totalProductsResponse.data.total_products);

      // Valor del inventario
      const inventoryValueResponse = await axios.get(
        "http://localhost:8000/products/inventory_value", 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInventoryValue(inventoryValueResponse.data.inventory_value);

      // Productos con stock bajo
      const lowStockCountResponse = await axios.get(
        "http://localhost:8000/products/low_stock_count", 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLowStockCount(lowStockCountResponse.data.low_stock_count);

    } catch (error) {
      console.error("Error al obtener datos de stock:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStockData();
    } else {
      console.error("Token no encontrado");
    }
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reportes de Stock</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total de Productos</h2>
          <p className="text-3xl font-bold">{totalProducts || "Cargando..."}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Valor del Inventario</h2>
          <p className="text-3xl font-bold">${inventoryValue || "Cargando..."}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Productos con Stock Bajo</h2>
          <p className="text-3xl font-bold text-red-600">{lowStockCount || "Cargando..."}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Generar Reportes</h2>
        <div className="flex items-center gap-4">
          <select className="border rounded-md px-3 py-2">
            <option>Seleccionar tipo de reporte</option>
            <option>Inventario Actual</option>
            <option>Movimientos de Stock</option>
            <option>Productos con Stock Bajo</option>
          </select>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md">
            <Printer className="h-5 w-5" />
            Generar Reporte
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Distribución de Stock por Categoría</h2>
          <PieChart className="h-64 w-full" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tendencia de Stock Mensual</h2>
          <BarChart className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
