import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CanvasPage from '@/pages/Canvas'
import HomePage from '@/pages/Home'
import ProjectListPage from '@/pages/ProjectList'
import TestPage from '@/pages/Test'

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
    },
    {
        path: '/test',
        element: <TestPage />
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}