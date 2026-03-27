import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    FolderOpen,
    FileText,
    Settings,
    ChevronRight,
    Plus,
    MoreHorizontal,
    FileText as TextIcon,
    Video,
    X
} from 'lucide-react'
import { getProjectList, createProject, type ProjectMeta } from '@/utils/projectStorage'
import { Modal, ModalContent, ModalTitle } from '@/components/ui/modal'

// 导航项配置
const navItems = [
    { icon: LayoutDashboard, label: '首页', active: true },
    { icon: FolderOpen, label: '项目' },
    { icon: FileText, label: '文档' },
]

export default function HomePage() {
    const navigate = useNavigate()
    const [projects, setProjects] = useState<ProjectMeta[]>([])
    const [showAnnouncement, setShowAnnouncement] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')

    // 加载项目列表
    useEffect(() => {
        const loadedProjects = getProjectList()
        // 按更新时间排序，取最近的几个
        // const sorted = loadedProjects.sort((a, b) => b.updatedAt - a.updatedAt)
        const sorted = loadedProjects
        setProjects(sorted.slice(0, 5))
    }, [])

    // 打开新建项目弹窗
    const handleOpenModal = () => {
        setProjectName('')
        setIsModalOpen(true)
    }

    // 确认创建新项目
    const handleConfirmCreate = () => {
        const name = projectName.trim() || undefined
        const newProject = createProject(name)
        navigate(`/canvas/${newProject.id}`)
    }

    // 进入项目
    const handleProjectClick = (projectId: string) => {
        navigate(`/canvas/${projectId}`)
    }

    // 进入项目列表
    const handleViewAll = () => {
        navigate('/projects')
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

            {/* 顶部公告栏 */}
            {showAnnouncement && (
                <div className="w-full h-11 bg-[rgba(0,240,255,0.05)] border-b border-[rgba(0,240,255,0.2)] backdrop-blur-sm flex justify-center items-center gap-4 text-[13px] font-medium tracking-wider text-[#00F0FF] relative z-50">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 border border-[#00F0FF] rounded text-[11px] shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                        <span>⏱</span>
                        <span>T-MINUS 05:03:20</span>
                    </div>
                    <span className="text-white/80">GLOBAL CREATOR CHALLENGE // 参与星云科幻季，瓜分十万算力</span>
                    <button className="px-4 py-1 bg-[#00F0FF] text-black rounded font-semibold hover:shadow-[0_0_15px_#00F0FF] transition-shadow">
                        INITIATE
                    </button>
                    <button
                        onClick={() => setShowAnnouncement(false)}
                        className="absolute right-6 text-white/60 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* 主体布局 */}
            <div className="flex flex-1 overflow-hidden">
                {/* 左侧导航栏 */}
                <nav className="w-[72px] bg-black/40 border-r border-white/[0.08] backdrop-blur-xl flex flex-col items-center py-6 z-10">
                    {/* Logo */}
                    <div className="w-8 h-8 mb-10 text-[#00F0FF] drop-shadow-[0_0_8px_#00F0FF]">
                        <svg viewBox="0 0 40 40" fill="currentColor">
                            <path d="M14 16C14 18.2091 12.2091 20 10 20C7.79086 20 6 18.2091 6 16C6 13.7909 7.79086 12 10 12C12.2091 12 14 13.7909 14 16Z" />
                            <path d="M22 12C26.4183 12 30 15.5817 30 20V24C30 28.4183 26.4183 32 22 32H14C9.58172 32 6 28.4183 6 24V24C6 24 6 24 6 24H14V20C14 15.5817 17.5817 12 22 12Z" />
                        </svg>
                    </div>

                    {/* 导航项 */}
                    {navItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => index === 1 && handleViewAll()}
                            className={`w-11 h-11 flex justify-center items-center cursor-pointer rounded-xl mb-3 transition-all relative ${item.active
                                    ? 'text-[#00F0FF] bg-[rgba(0,240,255,0.08)] shadow-[inset_0_0_0_1px_rgba(0,240,255,0.2)] before:absolute before:left-[-14px] before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-4 before:bg-[#00F0FF] before:shadow-[0_0_10px_#00F0FF]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                            title={item.label}
                        >
                            <item.icon size={20} />
                        </div>
                    ))}

                    {/* 底部设置 */}
                    <div className="flex-1" />
                    <div className="w-11 h-11 flex justify-center items-center cursor-pointer rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={20} />
                    </div>
                </nav>

                {/* 右侧主内容区 */}
                <main className="flex-1 overflow-y-auto scroll-smooth">
                    {/* 头部 */}
                    <header className="flex justify-end items-center px-12 py-6 gap-5 sticky top-0 z-20 bg-gradient-to-b from-[rgba(5,5,8,0.9)] to-transparent">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-[13px]">
                            <span className="text-white/60">COMPUTE</span>
                            <span className="text-[#00F0FF] font-semibold shadow-[0_0_8px_rgba(0,240,255,0.4)]">1,080</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/[0.08] cursor-pointer hover:border-white/20 transition-colors" />
                    </header>

                    <div className="px-12 pb-20 max-w-[1400px] mx-auto">
                        {/* 画廊轮播区 */}
                        <section className="flex justify-center items-center mt-2.5 mb-16">
                            <div className="flex justify-center items-center gap-6 w-full">
                                {/* 左侧卡片 */}
                                <div className="w-[400px] h-[260px] rounded-2xl overflow-hidden relative bg-[rgba(15,15,20,0.4)] border border-white/[0.08] opacity-50 grayscale-[50%] brightness-50 hover:opacity-80 hover:grayscale-20 hover:brightness-75 transition-all duration-500">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop')" }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                </div>

                                {/* 中间主卡片 */}
                                <div className="w-[640px] h-[320px] rounded-2xl overflow-hidden relative bg-[rgba(15,15,20,0.4)] border border-[rgba(0,240,255,0.2)] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(0,240,255,0.2)] z-[2]">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop')" }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                    <div
                                        className="absolute inset-0 opacity-15 pointer-events-none"
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                                            backgroundSize: '20px 20px',
                                            maskImage: 'radial-gradient(circle at top, transparent 40%, black)',
                                            WebkitMaskImage: 'radial-gradient(circle at top, transparent 40%, black)'
                                        }}
                                    />
                                    <div className="absolute bottom-8 left-0 w-full text-center">
                                        <div className="text-[12px] tracking-[2px] text-[#00F0FF] mb-2 uppercase">WORKFLOW TEMPLATES</div>
                                        <div className="text-[32px] font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.8)]">全新小说/剧本模板库</div>
                                    </div>
                                </div>

                                {/* 右侧卡片 */}
                                <div className="w-[400px] h-[260px] rounded-2xl overflow-hidden relative bg-[rgba(15,15,20,0.4)] border border-white/[0.08] opacity-50 grayscale-[50%] brightness-50 hover:opacity-80 hover:grayscale-20 hover:brightness-75 transition-all duration-500">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop')" }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                </div>
                            </div>
                        </section>

                        {/* 双轨创作引擎入口 */}
                        <div className="text-center text-[14px] tracking-[4px] text-white/60 mb-6 uppercase">SELECT ENGINE // 选择启动舱</div>
                        <section className="flex gap-6 mb-20">
                            {/* 文本引擎卡片 */}
                            <div
                                className="flex-1 h-[180px] bg-[rgba(15,15,20,0.4)] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-10 py-8 flex items-center justify-between cursor-pointer transition-all duration-400 relative overflow-hidden hover:border-[rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.1),inset_0_0_20px_rgba(0,240,255,0.05)] group"
                            >
                                <div
                                    className="absolute inset-0 opacity-5 pointer-events-none"
                                    style={{
                                        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                                        backgroundSize: '30px 30px',
                                        maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                                        WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                                    }}
                                />
                                <div className="flex items-center gap-6 relative z-[2]">
                                    <div className="text-white transition-all group-hover:text-[#00F0FF] group-hover:drop-shadow-[0_0_10px_#00F0FF]">
                                        <TextIcon size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-[22px] font-medium mb-2">AI 文本与剧本创作</h2>
                                        <p className="text-[13px] text-white/60 leading-relaxed max-w-[320px]">基于本地文件的智能工作流。支持长篇小说管理、行内大模型扩写与剧本工业格式转换。</p>
                                    </div>
                                </div>
                                <div className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover:bg-[#00F0FF] group-hover:border-[#00F0FF] group-hover:text-black group-hover:shadow-[0_0_20px_#00F0FF] relative z-[2]">
                                    <ChevronRight size={20} />
                                </div>
                            </div>

                            {/* 视频引擎卡片 */}
                            <div className="flex-1 h-[180px] bg-[rgba(15,15,20,0.4)] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-10 py-8 flex items-center justify-between cursor-pointer transition-all duration-400 relative overflow-hidden hover:border-[rgba(181,23,255,0.4)] hover:shadow-[0_0_30px_rgba(181,23,255,0.1),inset_0_0_20px_rgba(181,23,255,0.05)] group">
                                <div
                                    className="absolute inset-0 opacity-5 pointer-events-none"
                                    style={{
                                        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                                        backgroundSize: '30px 30px',
                                        maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
                                        WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                                    }}
                                />
                                <div className="flex items-center gap-6 relative z-[2]">
                                    <div className="text-white transition-all group-hover:text-[#B517FF] group-hover:drop-shadow-[0_0_10px_#B517FF]">
                                        <Video size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-[22px] font-medium mb-2">AI 视频与视觉工坊</h2>
                                        <p className="text-[13px] text-white/60 leading-relaxed max-w-[320px]">剧本一键生成视觉预览。支持角色一致性控制、动态分镜生成与高帧率成片演算。</p>
                                    </div>
                                </div>
                                <div className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover:bg-[#B517FF] group-hover:border-[#B517FF] group-hover:text-black group-hover:shadow-[0_0_20px_#B517FF] relative z-[2]">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </section>

                        {/* 最近项目 */}
                        <section>
                            <div className="flex justify-between items-end mb-6 border-b border-white/[0.08] pb-3">
                                <h3 className="text-[14px] tracking-[2px] text-white/60 uppercase">RECENT SESSIONS // 最近项目</h3>
                                <span
                                    onClick={handleViewAll}
                                    className="text-[12px] text-white/40 cursor-pointer hover:text-white transition-colors tracking-wider"
                                >
                                    VIEW ALL ＞
                                </span>
                            </div>

                            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
                                {/* 新建项目卡片 */}
                                <div
                                    onClick={handleOpenModal}
                                    className="cursor-pointer transition-all group"
                                >
                                    <div className="h-[140px] bg-[rgba(15,15,20,0.4)] border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-white/40 transition-all group-hover:border-[#00F0FF] group-hover:border-solid group-hover:bg-[rgba(0,240,255,0.05)] group-hover:text-[#00F0FF] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] relative">
                                        <div
                                            className="absolute inset-0 opacity-5 pointer-events-none"
                                            style={{
                                                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                                                backgroundSize: '15px 15px'
                                            }}
                                        />
                                        <Plus size={24} className="relative z-[1]" />
                                        <span className="text-[13px] tracking-wider relative z-[1]">NEW PROJECT</span>
                                    </div>
                                    <div className="flex justify-between items-start px-1 mt-4">
                                        <div>
                                            <div className="text-[14px] font-medium text-white mb-1.5">初始化空白舱</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 项目列表 */}
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        onClick={() => handleProjectClick(project.id)}
                                        className="cursor-pointer transition-all group"
                                    >
                                        <div className="h-[140px] bg-[rgba(15,15,20,0.4)] border border-white/[0.08] rounded-xl flex items-center justify-center overflow-hidden relative transition-all group-hover:border-[rgba(0,240,255,0.4)] group-hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)]">
                                            <div
                                                className="absolute inset-0 opacity-5 pointer-events-none"
                                                style={{
                                                    backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                                                    backgroundSize: '15px 15px'
                                                }}
                                            />
                                            {/* 类型标签 */}
                                            <div className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] tracking-wider backdrop-blur-sm flex items-center gap-1 bg-[rgba(0,240,255,0.1)] text-[#00F0FF] border border-[rgba(0,240,255,0.2)]">
                                                <TextIcon size={12} />
                                                <span>文本</span>
                                            </div>
                                            <TextIcon size={40} className="text-white/15 transition-all group-hover:text-[#00F0FF] group-hover:drop-shadow-[0_0_8px_#00F0FF] relative z-[1]" />
                                        </div>
                                        <div className="flex justify-between items-start px-1 mt-4">
                                            <div>
                                                <div className="text-[14px] font-medium text-white mb-1.5">{project.name}</div>
                                                <div className="text-[12px] text-white/40 tracking-wide">
                                                    {/* UPDATED {new Date(project.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).replace('/', '/')} */}
                                                </div>
                                            </div>
                                            <div className="text-white/40 hover:text-white transition-colors">
                                                <MoreHorizontal size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* 创建新项目弹窗 */}
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <ModalContent className="bg-[#0a0a0f] border-white/[0.08] p-6 w-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <ModalTitle className="text-white text-lg">创建新项目</ModalTitle>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-2">项目名称</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="请输入项目名称（可选）"
                                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-white/30 outline-none focus:border-[#00F0FF] transition-colors"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirmCreate}
                                className="flex-1 px-4 py-2.5 bg-[#00F0FF] text-black rounded-lg font-medium hover:shadow-[0_0_15px_#00F0FF] transition-shadow"
                            >
                                创建
                            </button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </div>
    )
}
