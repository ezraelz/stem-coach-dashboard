import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/home'

const UserRoute = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

export default UserRoute