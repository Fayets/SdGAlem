import React from 'react'
import logo from '../images/logo.jpeg'
import img1 from '../images/inventary.jpeg'
import img2 from '../images/sale.jpeg'
import img3 from '../images/reports.jpeg'
import img4 from '../images/tarjets.jpeg'


const Dashboard = () => {
  return (
    <>
    <div className='bg-black h-14 flex items-center px-4'> 
        <img src={logo} className="h-14 w-14 mr-4"/> 
        <p className='text-white flex-1 text-center'>bienvenidos a astro</p> 

    </div>
    <div className='grid grid-cols-2 gap-2 h-screen m-auto  bg-white'>
        <div className='m-auto border-8 w-52 h-52 flex items-center justify-center'><img src={img1} className='h-full'/></div>
        <div className='m-auto border-8 w-52 h-52 flex items-center justify-center'><img src={img2} className='h-full'/></div>
        <div className='m-auto border-8 w-52 h-52 flex items-center justify-center'><img src={img3} className='h-full'/></div>
        <div className='m-auto border-8 w-52 h-52 flex items-center justify-center'><img src={img4} className='h-full'/></div>
    </div>
    </>
  )
}

export default Dashboard