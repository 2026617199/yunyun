import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, FileText as TextIcon, X } from 'lucide-react'
import { getProjectList, createProject, deleteProject, type ProjectMeta } from '@/utils/projectStorage'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function ProjectListPage() {
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
        <div className="min-h-screen bg-[#050508] text-white flex flex-col overflow-hidden relative">
            {/* 背景光效 */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,240,255,0.08)_0%,transparent_60%)]" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}
                />
            </div>

            {/* 主内容区 */}
            <main className="flex-1 overflow-y-auto scroll-smooth p-8">
                    {/* 页面标题 */}
                    <div className="flex justify-between items-center mb-8 border-b border-white/[0.08] pb-4">
                        <h1 className="text-2xl font-semibold tracking-wider text-white/80 uppercase">
                            PROJECTS // 项目管理
                        </h1>
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-[13px]">
                            <span className="text-white/60">COMPUTE</span>
                            <span className="text-[#00F0FF] font-semibold shadow-[0_0_8px_rgba(0,240,255,0.4)]">1,080</span>
                        </div>
                    </div>

                    {/* 空状态提示 */}
                    {projects.length === 0 && (
                        <div className="text-center text-white/40 mt-20">
                            <p className="text-lg mb-2">还没有任何项目</p>
                            <p className="text-sm">点击右下角的 + 按钮创建第一个项目</p>
                        </div>
                    )}

                    {/* Grid布局 - 响应式展示项目卡片 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                        {/* 新建项目卡片 */}
                        <div
                            onClick={openCreateDialog}
                            className="relative aspect-square bg-[rgba(15,15,20,0.4)] border border-dashed border-white/20 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-white/40 hover:border-[#00F0FF] hover:border-solid hover:bg-[rgba(0,240,255,0.05)] hover:text-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] group"
                        >
                            <Plus size={32} />
                            <span className="text-sm tracking-wider">NEW PROJECT</span>
                        </div>

                        {/* 项目列表 */}
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => handleProjectClick(project.id)}
                                className="relative aspect-square bg-[rgba(15,15,20,0.4)] border border-white/[0.08] rounded-xl cursor-pointer hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] transition-all flex flex-col items-center justify-center p-4 group"
                            >
                                {/* 类型标签 */}
                                <div className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] tracking-wider backdrop-blur-sm flex items-center gap-1 bg-[rgba(0,240,255,0.1)] text-[#00F0FF] border border-[rgba(0,240,255,0.2)]">
                                    <TextIcon size={12} />
                                    <span>文本</span>
                                </div>

                                {/* 项目图标 */}
                                <TextIcon size={40} className="text-white/15 transition-all group-hover:text-[#00F0FF] group-hover:drop-shadow-[0_0_8px_#00F0FF]" />

                                {/* 项目名称 */}
                                <span className="text-sm font-medium text-white/80 text-center truncate w-full mt-3">
                                    {project.name}
                                </span>

                                {/* 删除按钮 - 悬停时显示 */}
                                <button
                                    onClick={(e) => openDeleteDialog(e, project)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="删除项目"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </main>

            {/* 创建项目弹窗 */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="bg-[#0a0a0f] border-white/[0.08] p-6 w-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-white text-lg">创建新项目</DialogTitle>
                        <button
                            onClick={handleCancelCreate}
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-2">项目名称（可选）</label>
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="输入项目名称..."
                                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-white/30 outline-none focus:border-[#00F0FF] transition-colors"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                className="flex-1 bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg"
                                onClick={handleCancelCreate}
                            >
                                取消
                            </Button>
                            <Button
                                variant="blue"
                                className="flex-1 rounded-lg"
                                onClick={handleConfirmCreate}
                            >
                                创建
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 删除确认弹窗 */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-[#0a0a0f] border-white/[0.08] p-6 w-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-white text-lg">删除项目</DialogTitle>
                        <button
                            onClick={handleCancelDelete}
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="py-4">
                        <p className="text-white/60">
                            确定要删除项目 <span className="font-medium text-white">"{projectToDelete?.name}"</span> 吗？删除后无法恢复。
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            className="flex-1 bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg"
                            onClick={handleCancelDelete}
                        >
                            取消
                        </Button>
                        <Button
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                            onClick={handleConfirmDelete}
                        >
                            删除
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
