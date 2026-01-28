import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
// lazy imports
const AdminOverview = lazy(() => import('../pages/admin/adminOverview'));
const Users = lazy(() =>import('../pages/admin/users/users'));
import Courses from '../pages/admin/courses/courses'
import UserAdd from '../pages/admin/users/userAdd'
import CourseAdd from '../pages/admin/courses/courseAdd'
import Lessons from '../pages/admin/lessons/lessons'
import LessonAdd from '../pages/admin/lessons/lessonAdd'

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminOverview />} />
      <Route path='/users' element={<Users />} />
      <Route path='/addUser' element={<UserAdd />} />
      <Route path='/courses' element={<Courses />} />
      <Route path='/addCourses' element={<CourseAdd />} />
      <Route path='/lessons' element={<Lessons />} />
      <Route path='/addLessons' element={<LessonAdd />} />
    </Routes>
  )
}

export default AdminRoute