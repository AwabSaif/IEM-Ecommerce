import React from 'react'
import { Footer } from '../footer/Footer'
import { Header } from '../header/Header'

export const Layout = ({children}) => {
  return (
    <>
        <Header/>
        <div className='min-h-[80vh]'>
            {children}
        </div>
        <Footer/>
    </>
  )
}
