import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">首页</h1>
            <p className="text-gray-500 mb-8">首页开发中...</p>
            <Link
                to="/projects"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                进入项目列表
            </Link>
        </div>
    )
}