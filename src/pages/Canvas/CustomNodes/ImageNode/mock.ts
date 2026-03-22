/**
 * 图片节点底部增强输入区 mock 数据
 * 说明：
 * - 本期全部本地 mock，后续可平滑替换为后端接口。
 * - 数量控制在最小可用：@mention 与 /command 均 8-12 条。
 */

export const IMAGE_REFERENCE_MOCK = [
    { id: 'ref-1', title: '赛博街景', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=240&h=240&fit=crop' },
    { id: 'ref-2', title: '雨夜霓虹', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=240&h=240&fit=crop' },
    { id: 'ref-3', title: '电影构图', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=240&h=240&fit=crop' },
    { id: 'ref-4', title: '玻璃建筑', url: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=240&h=240&fit=crop' },
    { id: 'ref-5', title: '未来肖像', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&h=240&fit=crop' },
] as const

export const MENTION_MOCK = [
    { id: 'm-1', label: '产品经理-Luna', value: 'luna', description: '需求方向与用户场景' },
    { id: 'm-2', label: '视觉设计-Ariel', value: 'ariel', description: '品牌与视觉风格' },
    { id: 'm-3', label: '摄影参考库', value: 'photo-lib', description: '构图与光线参考' },
    { id: 'm-4', label: '人物设定集', value: 'character-pack', description: '角色表情与姿态' },
    { id: 'm-5', label: '材质参考库', value: 'material-lab', description: '金属/玻璃/织物质感' },
    { id: 'm-6', label: '镜头语言指南', value: 'lens-guide', description: '景别、运动与焦段' },
    { id: 'm-7', label: '品牌手册', value: 'brand-book', description: '品牌色与调性约束' },
    { id: 'm-8', label: '内容审校机器人', value: 'review-bot', description: '敏感词与质量规则' },
    { id: 'm-9', label: '脚本策划-Atlas', value: 'atlas', description: '叙事结构与镜头节奏' },
] as const

export const COMMAND_MOCK = [
    { id: 'c-1', label: '增强细节', command: '/enhance', description: '提升纹理、细节与锐度' },
    { id: 'c-2', label: '电影级调色', command: '/cinematic', description: '应用电影感 LUT 色调' },
    { id: 'c-3', label: '改为极简风', command: '/minimal', description: '降低元素密度，增强留白' },
    { id: 'c-4', label: '加入景深', command: '/dof', description: '增加前后景层次与虚化' },
    { id: 'c-5', label: '统一材质', command: '/material', description: '统一为金属/陶瓷等质感' },
    { id: 'c-6', label: '提高对比度', command: '/contrast', description: '增强明暗关系与冲击力' },
    { id: 'c-7', label: '改为写实摄影', command: '/realistic', description: '趋近真实镜头表达' },
    { id: 'c-8', label: '改为插画风', command: '/illustration', description: '平涂/描边插画语言' },
    { id: 'c-9', label: '自动重写提示词', command: '/rewrite', description: '按最佳实践重写文本' },
] as const

export const STYLE_TEMPLATE_MOCK = [
    {
        id: 's-1',
        name: '商业大片',
        promptPreview: '高级商业摄影，硬朗侧光，主体居中，背景干净，细节清晰，8k，电影级色彩。',
    },
    {
        id: 's-2',
        name: '日系清透',
        promptPreview: '自然柔光，低饱和，清新留白，空气感，胶片颗粒轻微，柔和对比。',
    },
    {
        id: 's-3',
        name: '赛博夜景',
        promptPreview: '霓虹主色，湿地反射，高对比夜景，体积雾，未来都市氛围。',
    },
    {
        id: 's-4',
        name: '极简产品',
        promptPreview: '中性背景，干净构图，单一主物体，软箱打光，精致材质反射。',
    },
    {
        id: 's-5',
        name: '插画海报',
        promptPreview: '高辨识图形语言，清晰轮廓，统一色板，平衡版式，视觉中心明确。',
    },
    {
        id: 's-6',
        name: '纪实街拍',
        promptPreview: '抓拍瞬间，环境叙事，自然光，动态模糊轻微，真实生活氛围。',
    },
    {
        id: 's-7',
        name: '复古胶片',
        promptPreview: '胶片色偏，柔和高光，颗粒感，轻微暗角，怀旧视觉语汇。',
    },
    {
        id: 's-8',
        name: '未来概念设定',
        promptPreview: '工业细节，结构分明，科幻材质，蓝灰主调，概念设计图语言。',
    },
    {
        id: 's-9',
        name: '国风意境',
        promptPreview: '东方美学，留白构图，水墨层次，柔和色阶，诗意氛围。',
    },
] as const
