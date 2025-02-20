import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditProduct = ({ product }) => {

  const { codigo } = useParams();
  const token = localStorage.getItem("token"); 

  const [editedProduct, setEditedProduct] = useState({
    codigo:product.codigo,
    nombre: product.nombre,
    categoria_id: product.categoria.id,
    precio_costo: product.precio_costo,
    precio_venta: product.precio_venta,
    stock: product.stock,
    stock_minimo: product.stock_minimo,
    


  });
  console.log(product)

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value, // Actualiza el campo correspondiente
    });
  };


  const handleSubmit = () => {
    console.log(editedProduct)
    axios.put(`http://localhost:8000/products/update/${codigo}`,editedProduct,{
        headers: {Authorization: `Bearer ${token}`}
      })
      .then(response => {
        console.log('Producto actualizado:', response.data);
      })
      .catch(error => {
        console.error('Error al actualizar el producto:', error);
      });
  };

  return (
    <div className='flex flex-col'>
      <h1>Editar Producto {editedProduct.nombre}</h1>

      {/* Campos para editar el producto */}
      <input
        type="text"
        name="codigo"
        value={editedProduct.codigo}
        onChange={handleChange} 
      />


      <input
        type="text"
        name="nombre"
        value={editedProduct.nombre}
        onChange={handleChange} 
      />
      
      <input
        type="text"
        name="categoria_id"
        value={editedProduct.categoria_id}
        onChange={handleChange} 
      />
      
      

      <input
        type="number"
        name="precio_costo"
        value={editedProduct.precio_costo}
        onChange={handleChange} 
      />
      
      <input
        type="number"
        name="precio_venta"
        value={editedProduct.precio_venta}
        onChange={handleChange} 
      />

    <input
        type="number"
        name="stock"
        value={editedProduct.stock}
        onChange={handleChange} 
      />
      <input
        type="number"
        name="stock_minimo"
        value={editedProduct.stock_minimo}
        onChange={handleChange} 
      />

      <button onClick={handleSubmit}>Guardar cambios</button>
    </div>
  );
};

export default EditProduct;