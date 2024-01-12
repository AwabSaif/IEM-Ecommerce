import React from 'react'
import { Footer } from '../components/common/Footer'
import { Header } from '../components/common/Header'

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
