import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CanvasPage from '@/pages/Canvas'
import HomePage from '@/pages/Home'
import ProjectListPage from '@/pages/ProjectList'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/projects',
        element: <ProjectListPage />
    },
    {
        path: '/canvas/:projectId',
        element: <CanvasPage />
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}