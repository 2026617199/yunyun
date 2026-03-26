import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { getProjectList, createProject, deleteProject, type ProjectMeta } from '@/utils/projectStorage'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function HomePage() {
    const navigate = useNavigate()
    const [projects, setProjects] = useState<ProjectMeta[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [projectToDelete, setProjectToDelete] = useState<ProjectMeta | null>(null)
    const [newProjectName, setNewProjectName] = useState('')

    // 加载项目列表
    useEffect(() => {
        const loadedProjects = getProjectList()
        setProjects(loadedProjects)
    }, [])

    // 处理项目卡片点击
    const handleProjectClick = (projectId: string) => {
        navigate(`/canvas/${projectId}`)
    }

    // 打开创建项目弹窗
    const openCreateDialog = () => {
        setNewProjectName('')
        setIsCreateDialogOpen(true)
    }

    // 确认创建项目
    const handleConfirmCreate = () => {
        const newProject = createProject(newProjectName || undefined)
        setProjects(getProjectList())
        setIsCreateDialogOpen(false)
        navigate(`/canvas/${newProject.id}`)
    }

    // 取消创建
    const handleCancelCreate = () => {
        setIsCreateDialogOpen(false)
        setNewProjectName('')
    }

    // 打开删除确认弹窗
    const openDeleteDialog = (e: React.MouseEvent, project: ProjectMeta) => {
        e.stopPropagation()
        setProjectToDelete(project)
        setIsDeleteDialogOpen(true)
    }

    // 确认删除项目
    const handleConfirmDelete = () => {
        if (projectToDelete) {
            deleteProject(projectToDelete.id)
            setProjects(getProjectList())
        }
        setIsDeleteDialogOpen(false)
        setProjectToDelete(null)
    }

    // 取消删除
    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false)
        setProjectToDelete(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* 页面标题 */}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">我的项目</h1>

            {/* 空状态提示 */}
            {projects.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    <p className="text-lg mb-2">还没有任何项目</p>
                    <p className="text-sm">点击右下角的 + 按钮创建第一个项目</p>
                </div>
            )}

            {/* Grid布局 - 响应式展示项目卡片 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        className="relative aspect-square bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center justify-center p-4 group"
                    >
                        {/* 项目名称 */}
                        <span className="text-base font-medium text-gray-700 text-center truncate w-full">
                            {project.name}
                        </span>

                        {/* 删除按钮 - 悬停时显示 */}
                        <button
                            onClick={(e) => openDeleteDialog(e, project)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="删除项目"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* 右下角新建项目按钮 */}
            <button
                onClick={openCreateDialog}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all flex items-center justify-center z-50"
                title="新建项目"
            >
                <Plus size={24} />
            </button>

            {/* 创建项目弹窗 */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogTitle>创建新项目</DialogTitle>
                    <div className="py-4">
                        <label className="block text-sm text-gray-600 mb-2">项目名称（可选）</label>
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="输入项目名称..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleCancelCreate}>
                            取消
                        </Button>
                        <Button variant="blue" onClick={handleConfirmCreate}>
                            创建
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 删除确认弹窗 */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogTitle>删除项目</DialogTitle>
                    <div className="py-4">
                        <p className="text-gray-600">
                            确定要删除项目 <span className="font-medium text-gray-800">"{projectToDelete?.name}"</span> 吗？删除后无法恢复。
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleCancelDelete}>
                            取消
                        </Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleConfirmDelete}>
                            删除
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}