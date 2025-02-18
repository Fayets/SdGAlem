import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/logo.jpeg";

const Login = () => {
  const [credentials, setCredentials] = useState({
    usernameOrEmail: "", // Usaremos un solo campo
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const postApi = async () => {
    try {
      // Verifica que se esté enviando el valor correcto
      console.log("Credenciales:", credentials);
  
      if (!credentials.usernameOrEmail || !credentials.password) {
        alert("Se requiere un correo electrónico o nombre de usuario");
        return;
      }
  
      // Enviar solo uno de los dos campos (email o username)
      const loginData = {
        // Aquí determinamos cuál campo enviar basado en si se ha ingresado username o email
        username: credentials.usernameOrEmail.includes("@") ? undefined : credentials.usernameOrEmail,
        email: credentials.usernameOrEmail.includes("@") ? credentials.usernameOrEmail : undefined,
        password: credentials.password,
      };
  
      // Realizar la solicitud de login
      const response = await axios.post("http://localhost:8000/auth/login", loginData);
  
      // Almacenar el token si el login es exitoso
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }
      return response.data;
  
    } catch (error) {
      console.error("Error al logear:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const handleClick = async () => {
    const result = await postApi();
    if (result) {
      navigate("/Dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img src={logo} width={150} height={50} className="mx-auto h-12 w-auto" alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accede a tu cuenta para gestionar el inventario
          </p>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="usernameOrEmail"
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Correo electrónico o usuario"
                value={credentials.usernameOrEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
