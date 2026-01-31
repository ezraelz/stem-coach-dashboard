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
import Medias from '../pages/admin/medias/medias';
import Settings from '../pages/admin/settings';
import Messages from '../pages/admin/messages';
import Calendar from '../pages/admin/calendar';
import UserDetail from '../pages/admin/users/userDetail';
import CourseSinglePage from '../pages/admin/courses/courseSinglePage';

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminOverview />} />
      <Route path='/users' element={<Users />} />
      <Route path='/users/add' element={<UserAdd />} />
      <Route path='/users/detail/:Id' element={<UserDetail />} />

      <Route path='/courses' element={<Courses />} />
      <Route path='/courses/add' element={<CourseAdd />} />
      <Route path='/courses/detail/:id' element={<CourseSinglePage />} />

      <Route path='/lessons' element={<Lessons />} />
      <Route path='/lessons/add' element={<LessonAdd />} />
      <Route path='/medias' element={<Medias />} />
      <Route path='/settings' element={<Settings />} />
      <Route path='/messages' element={<Messages />} />
      <Route path='/calendar' element={<Calendar />} />
    </Routes>
  )
}

export default AdminRoute