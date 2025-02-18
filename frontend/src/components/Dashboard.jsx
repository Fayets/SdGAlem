import React from 'react'
import { ShoppingBag, Package, FileText, CreditCard } from "lucide-react"
import { useNavigate } from 'react-router-dom'  // Importa useNavigate
import logo from "../images/logo.jpeg"

const modules = [
  { name: "Ventas", icon: ShoppingBag },
  { name: "Inventario", icon: Package },
  { name: "Reportes", icon: FileText },
  { name: "Créditos Personales", icon: CreditCard },
]

const Dashboard = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleNavigate = (moduleName) => {
    if (moduleName === "Inventario") {
      navigate("/stock");  // Redirige a /inventario
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <img
            src={logo}
            alt="Logo de la empresa"
            width={150}
            height={50}
            className="w-auto h-12"
          />
          <h1 className="text-3xl font-bold text-gray-800">Dashboard de Negocio</h1>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-8">
          {modules.map((module) => (
            <button
              key={module.name}
              className="flex flex-col items-center justify-center bg-blue-50 p-12 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-100 transition-all duration-300 ease-in-out"
              onClick={() => handleNavigate(module.name)} // Asigna la acción al clic
            >
              <module.icon className="w-24 h-24 text-blue-600 mb-6" />
              <span className="text-xl font-medium text-gray-800">{module.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default Dashboard
