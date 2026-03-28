export default function TestPage() {
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
                        TEST // 测试页面
                    </h1>
                </div>

                {/* 测试内容 */}
                <div className="flex flex-col items-center justify-center gap-6">
                    <h2 className="text-xl text-white/60">测试页面内容</h2>
                    <img 
                        src="https://mj.filenest.top/0e18b184-dc7f-498a-968a-7bb87d312605_0_0.png" 
                        alt="测试图片" 
                        className="max-w-md rounded-lg shadow-lg"
                    />
                </div>
            </main>
        </div>
    )
}
