import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../images/fondo.jpeg"
import logo from "../images/logo.jpeg"
import axios from 'axios'


const Login = () => {
  const navigate = useNavigate();
  const postApi = async() => {
    const username = 'chuly';
    const email = 'chuly@test.com';
    const password = '1234'

    try {
      
      // const response = axios.post()
      const response = await axios.post(`http://localhost:8000/auth/login?username=${username}&email=${email}&password=${password} `)      //TODO alertas
      
      console.log(response.data)
    
    } catch (error) {
      console.log(error)
      //TODO alertas
    }
  }
  const handleClick = () => {
    postApi();  
    navigate("/Dashboard");  
  };

  return (
    <div className="flex p-1   justify-end  bg-cover bg-center h-screen w-screen "
      
    style={{ backgroundImage: `url(${fondo}) ` }}>    
   
    
    <div className="w-[26rem] h-[26rem] m-auto bg-transparent  opacity-80  border-8 border-transparent  rounded-3xl shadow-2xl backdrop-blur-lg">
        <img src={logo} className="h-24 w-20 m-auto  mb-4"/>
    <form  className=" flex flex-col items-center">
            <label className="p-2 text-white text-base ">Correo</label>
            <input
              type="text"
              className="rounded-lg border-4  h-8  p-4 mb-4 "
              placeholder="Usuario"
              name="loginCorreo"
            />
            <label className="p-2 text-white text-base ">Contraseña</label>
            <input
              type="password" 
              className="rounded-lg border-4  h-8  p-4 mb-22 "
              placeholder="Contraseña"
              name="loginClave"
            />

            <button
              className="cursor-pointer bg-transparent border-2 border-sky-200 rounded-md text-white font-semibold transition duration-300 ease-in-out hover:bg-sky-700 hover:ring-2 hover:ring-sky-800 hover:shadow-xl hover:shadow-sky-500 focus:ring-sky-300 focus:shadow-sky-400 px-5 py-2"
              onClick={handleClick}               
            >
            Iniciar sesion
            </button>
          </form>
            
           
    </div>
    </div>
  );
};

export default Login;