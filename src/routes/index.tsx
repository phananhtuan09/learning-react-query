import { useRoutes } from 'react-router-dom'
import MainLayout from 'layouts/MainLayout'
import About from 'pages/About'
import AddStudent from 'pages/AddStudent'
import Dashboard from 'pages/Dashboard'
import NotFound from 'pages/NotFound'
import Students from 'pages/Students'

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/students',
      element: <Students />
    },
    {
      path: '/students/:id',
      element: <AddStudent />
    },
    {
      path: '/students/add',
      element: <AddStudent />
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])
}
