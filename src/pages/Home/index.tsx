import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const [projectId, setProjectId] = useState('')
    const navigate = useNavigate()

    const handleNavigate = () => {
        const id = projectId.trim() || '1'
        navigate(`/canvas/${id}`)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNavigate()
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <h1 className="text-3xl font-bold underline mb-8">Hello world!</h1>
            <div className="flex flex-col gap-2">
                <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="请输入项目ID（默认值：1）"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={handleNavigate}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    进入画布
                </button>
            </div>
        </div>
    )
}