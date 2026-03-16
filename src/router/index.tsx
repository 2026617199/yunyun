import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CanvasPage from '@/pages/Canvas'
import HomePage from '@/pages/Home'

const router = createBrowserRouter([
    {
        path: '/canvas',
        element: <CanvasPage />
    },
    {
        path: '/',
        element: <HomePage />
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}