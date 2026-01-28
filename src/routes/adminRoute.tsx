import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminOverview from '../pages/admin/adminOverview'
import Users from '../pages/admin/users/users'
import Courses from '../pages/admin/courses/courses'
import UserAdd from '../pages/admin/users/userAdd'
import CourseAdd from '../pages/admin/courses/courseAdd'

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminOverview />} />
      <Route path='/users' element={<Users />} />
      <Route path='/addUser' element={<UserAdd />} />
      <Route path='/courses' element={<Courses />} />
      <Route path='/addCourses' element={<CourseAdd />} />

    </Routes>
  )
}

export default AdminRoute