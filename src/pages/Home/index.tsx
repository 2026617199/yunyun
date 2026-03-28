import { FileText, Film } from 'lucide-react'

// 顶部横向滑动卡片数据
const carouselCards = [
    {
        id: 'left',
        type: 'cinema',
        title: 'CINEMA CENTRAL CINEMA',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: 'center',
        type: 'templates',
        titleEn: 'WORKFLOW TEMPLATES',
        titleCn: '全新小说/剧本模板库',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    },
    {
        id: 'right',
        type: 'circuit',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    },
]

// 底部功能面板数据
const featurePanels = [
    {
        id: 'text',
        icon: FileText,
        title: 'AI 文本与剧本创作',
        description: '基于本地文件的智能工作流。支持长篇小说管理、行内大模型扩写与剧本工业格式转换。',
    },
    {
        id: 'video',
        icon: Film,
        title: 'AI 视频与视觉工坊',
        description: '剧本一键生成视觉预览。支持角色一致性控制、动态分镜生成与高分辨率成片运算。',
    },
]

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col overflow-hidden relative">
            {/* 背景网格纹理 */}
            <div 
                className="absolute inset-0 -z-10 opacity-30"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />
            
            {/* 背景光效 */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl" />
            </div>

            {/* 主内容区 */}
            <main className="flex-1 flex flex-col overflow-hidden px-8 py-6">
                {/* 顶部横向滑动展示区 */}
                <section className="flex-shrink-0">
                    <div className="flex items-center justify-center gap-6 h-[280px]">
                        {carouselCards.map((card) => (
                            <Card key={card.id} data={card} />
                        ))}
                    </div>
                </section>

                {/* 中间文本 */}
                <section className="flex-shrink-0 py-8 flex justify-center">
                    <p className="text-white/70 text-sm tracking-[0.3em] font-light">
                        SELECT ENGINE // 选择启动舱
                    </p>
                </section>

                {/* 底部功能选择区 */}
                <section className="flex-1 flex items-start justify-center gap-8 pb-8">
                    {featurePanels.map((panel) => (
                        <FeaturePanel key={panel.id} data={panel} />
                    ))}
                </section>
            </main>
        </div>
    )
}

// 卡片组件
const Card = ({ data }: { data: typeof carouselCards[0] }) => {
    const isCenter = data.id === 'center'
    
    return (
        <div
            className={`
                relative flex-shrink-0 rounded-2xl overflow-hidden
                transition-all duration-500 ease-out cursor-pointer
                ${isCenter 
                    ? 'w-[340px] h-[240px] scale-100 z-10' 
                    : 'w-[260px] h-[180px] scale-90 opacity-50 hover:opacity-70'
                }
            `}
        >
            {/* 图片背景 */}
            <img 
                src={data.imageUrl} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* 遮罩层 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* 卡片内容 */}
            {data.type === 'templates' && (
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <p className="text-white/60 text-xs tracking-wider mb-2 font-medium">
                        {data.titleEn}
                    </p>
                    <h3 className="text-white text-lg font-semibold tracking-wide">
                        {data.titleCn}
                    </h3>
                </div>
            )}
            
            {/* 电影院卡片标题 */}
            {data.type === 'cinema' && data.title && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-black/60 backdrop-blur-sm border border-pink-400/40 rounded-lg px-4 py-2 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        <p className="text-pink-300 text-xs tracking-wider font-bold text-center">
                            {data.title}
                        </p>
                    </div>
                </div>
            )}
            
            {/* 高亮边框 */}
            <div className={`absolute inset-0 rounded-2xl border ${isCenter ? 'border-white/20' : 'border-white/10'}`} />
        </div>
    )
}

// 功能面板组件
const FeaturePanel = ({ data }: { data: typeof featurePanels[0] }) => {
    const Icon = data.icon
    
    return (
        <div 
            className="
                relative w-[420px] rounded-2xl overflow-hidden
                bg-gradient-to-br from-[#12121a] to-[#0a0a0f]
                border border-white/[0.06] 
                p-8 cursor-pointer
                transition-all duration-300
                hover:border-white/[0.12] hover:bg-gradient-to-br hover:from-[#16161f] hover:to-[#0d0d12]
                group
            "
        >
            {/* 背景光效 */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            </div>
            
            {/* 图标 */}
            <div className="relative mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white/80" />
                </div>
            </div>
            
            {/* 标题 */}
            <h3 className="relative text-xl font-semibold text-white/90 mb-3 tracking-wide">
                {data.title}
            </h3>
            
            {/* 描述 */}
            <p className="relative text-white/50 text-sm leading-relaxed mb-4">
                {data.description}
            </p>
            
            {/* 箭头图标 */}
            <div className="absolute bottom-6 right-6">
                <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.06] group-hover:border-white/[0.12] transition-all duration-300">
                    <svg 
                        className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    )
}