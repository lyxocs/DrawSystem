/**
 * 抽奖系统配置文件
 * 包含参与者信息、奖品信息和分池配置
 */

// ==========================================
// 抽奖池配置 - 定义不同的抽奖池
// ==========================================
// 说明：通过抽奖池可以实现分组抽奖
// - 每个参与者可以属于一个或多个池子
// - 每个奖品可以指定从哪些池子中抽取
// - 如果奖品未指定池子，则从所有参与者中抽取
// - 如果参与者未指定池子，则只能参与未指定池子的奖品抽取
const POOLS_CONFIG = [
    { id: "all", name: "全员池", description: "所有人都可参与" },
    { id: "manager", name: "管理层", description: "经理及以上级别" },
    { id: "employee", name: "普通员工", description: "普通员工" },
    { id: "newbie", name: "新人池", description: "入职一年内的新员工" },
    { id: "veteran", name: "老员工池", description: "入职三年以上的老员工" },
];

// ==========================================
// 参与者配置
// ==========================================
// name: 姓名
// weight: 中奖权重（权重越高，中奖概率越大）
// pools: 所属池子ID数组（可选，不填则默认只参与"all"池）
const PARTICIPANTS_CONFIG = [
    // 管理层
    { name: "张总", weight: 1, pools: ["all", "manager"] },
    { name: "李总", weight: 1, pools: ["all", "manager"] },
    { name: "王经理", weight: 1, pools: ["all", "manager"] },
    
    // 老员工
    { name: "赵六", weight: 1, pools: ["all", "employee", "veteran"] },
    { name: "钱七", weight: 1, pools: ["all", "employee", "veteran"] },
    { name: "孙八", weight: 1, pools: ["all", "employee", "veteran"] },
    { name: "周九", weight: 1, pools: ["all", "employee", "veteran"] },
    { name: "吴十", weight: 1, pools: ["all", "employee", "veteran"] },
    
    // 普通员工
    { name: "郑十一", weight: 1, pools: ["all", "employee"] },
    { name: "王十二", weight: 1, pools: ["all", "employee"] },
    { name: "冯十三", weight: 1, pools: ["all", "employee"] },
    { name: "陈十四", weight: 1, pools: ["all", "employee"] },
    { name: "褚十五", weight: 1, pools: ["all", "employee"] },
    { name: "卫十六", weight: 1, pools: ["all", "employee"] },
    { name: "蒋十七", weight: 1, pools: ["all", "employee"] },
    { name: "沈十八", weight: 1, pools: ["all", "employee"] },
    
    // 新员工
    { name: "韩十九", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "杨二十", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "朱廿一", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "秦廿二", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "尤廿三", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "许廿四", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "何廿五", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "吕廿六", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "施廿七", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "张廿八", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "孔廿九", weight: 1, pools: ["all", "employee", "newbie"] },
    { name: "曹三十", weight: 1, pools: ["all", "employee", "newbie"] },
];

// ==========================================
// 奖品配置
// ==========================================
// level: 奖品等级（数字越小越高级）
// name: 奖品名称
// displayName: 显示名称
// quantity: 数量
// image: 图片路径
// description: 描述
// color: 主题色
// pools: 可抽取的池子ID数组（可选，不填则从所有参与者中抽取）
const PRIZES_CONFIG = [
    {
        level: 1,
        name: "特等奖",
        displayName: "iPhone 16 Pro Max",
        quantity: 1,
        image: "images/prize1.png",
        description: "苹果最新旗舰手机",
        color: "#FFD700",
        pools: ["all"]  // 全员可抽
    },
    {
        level: 2,
        name: "一等奖",
        displayName: "iPad Pro 2024",
        quantity: 2,
        image: "images/prize2.png",
        description: "高性能平板电脑",
        color: "#C0C0C0",
        pools: ["employee"]  // 仅员工可抽
    },
    {
        level: 3,
        name: "二等奖",
        displayName: "AirPods Pro",
        quantity: 3,
        image: "images/prize3.png",
        description: "主动降噪无线耳机",
        color: "#CD7F32",
        pools: ["all"]  // 全员可抽
    },
    {
        level: 4,
        name: "三等奖",
        displayName: "小米手环8",
        quantity: 5,
        image: "images/prize4.png",
        description: "智能运动手环",
        color: "#E8E8E8",
        pools: ["veteran", "newbie"]  // 老员工和新员工可抽
    },
    {
        level: 5,
        name: "新人专属奖",
        displayName: "定制礼盒",
        quantity: 5,
        image: "images/prize5.png",
        description: "新年定制礼盒套装",
        color: "#FF6B6B",
        pools: ["newbie"]  // 仅新人可抽
    },
    {
        level: 6,
        name: "管理层专属",
        displayName: "高端红酒",
        quantity: 3,
        image: "images/prize6.png",
        description: "法国进口红酒",
        color: "#8B0000",
        pools: ["manager"]  // 仅管理层可抽
    }
];

// 系统配置
const SYSTEM_CONFIG = {
    animationDuration: 3000,
    showWeight: false,
    eventName: "2026新年抽奖盛典",
    primaryColor: "#dc2626",
    secondaryColor: "#ffd700"
};

// AI歌曲生成配置
const AI_CONFIG = {
    // 是否启用AI歌曲功能
    enabled: true,
    
    // 大模型API配置 (用于生成歌词)
    llm: {
        // API提供商: 'openai', 'anthropic', 'zhipu', 'moonshot', 'deepseek', 'custom'
        provider: 'openai',
        // API密钥 (请替换为你的实际密钥)
        apiKey: 'your-api-key-here',
        // API端点 (可选，用于自定义API地址)
        baseUrl: 'https://api.openai.com/v1',
        // 模型名称
        model: 'gpt-4o-mini',
        // 请求超时时间(毫秒)
        timeout: 30000
    },
    
    // TTS语音合成配置 (用于唱歌)
    tts: {
        // API提供商: 'browser'(免费), 'openai', 'azure', 'elevenlabs', 'fish-audio', 'custom'
        // 推荐使用 'browser' - 使用浏览器内置语音，完全免费无需配置
        provider: 'browser',
        // API密钥 (使用browser时无需配置)
        apiKey: '',
        // API端点 (使用browser时无需配置)
        baseUrl: '',
        // 语音 (browser模式会自动选择中文语音)
        voice: 'zh-CN',
        // 模型名称
        model: '',
        // 语速 (0.5-2.0)
        speed: 1.0
    },
    
    // 歌词生成提示词模板
    promptTemplate: `你是一个搞怪歌曲创作大师，请为中奖者创作一首简短有趣的祝贺歌。

中奖者: {winners}
奖品: {prize}

要求:
1. 歌词要简短(4-6句)，适合朗诵/演唱
2. 风格搞怪幽默，可以押韵
3. 必须包含中奖者的名字和奖品名称
4. 语气热情洋溢，充满祝福
5. 可以适当夸张和调侃
6. 直接输出歌词，不要有任何解释

示例风格:
"哎呀妈呀真厉害，
{winner}把大奖拿回来！
{prize}闪闪亮，
从此走路带着光！
恭喜恭喜恭喜你，
今天你是最靓的崽！"`,
    
    // 仅对以下奖项等级启用歌曲 (1=特等奖, 2=一等奖, 等)
    enableForLevels: [1, 2],
    
    // 是否自动播放 (false则需要用户点击播放)
    autoPlay: false
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POOLS_CONFIG, PARTICIPANTS_CONFIG, PRIZES_CONFIG, SYSTEM_CONFIG, AI_CONFIG };
}
