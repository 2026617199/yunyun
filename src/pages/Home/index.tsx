export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#050508] text-white flex flex-col overflow-hidden relative">
            {/* 背景光效 */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,240,255,0.08)_0%,transparent_60%)]" />
            </div>

            {/* 主内容区 */}
            <main className="flex-1 overflow-y-auto scroll-smooth p-8">
                {/* 页面标题 */}
                <div className="flex justify-between items-center mb-8 border-b border-white/[0.08] pb-4">
                    <h1 className="text-2xl font-semibold tracking-wider text-white/80 uppercase">
                        HOME // 首页
                    </h1>
                </div>

                {/* 欢迎内容 */}
                <div className="flex flex-col items-center justify-center gap-6 py-20">
                    <h2 className="text-3xl font-bold text-white/90">欢迎来到云云</h2>
                    <p className="text-white/50 text-center max-w-md">
                        这是一个创意工作空间，让您可以自由地组织和管理您的项目。
                    </p>
                </div>
            </main>
        </div>
    )
}
