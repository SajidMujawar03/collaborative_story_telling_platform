import React from 'react'
import Header from '../Components/Header/Header.jsx'
import Router from '../router/Router'
import Footer from '../Components/Footer/Footer.jsx'



const Layout = () => {
  return (
    <>
    
    <Header/>
    <main className='min-h-[80vh]'>
           <Router/>
    </main>
    <Footer/>
   
    </>
  )
}

export default Layout