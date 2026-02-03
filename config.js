/**
 * 抽奖系统配置文件
 * 包含参与者信息和奖品信息
 */

// 参与者配置 - 包含姓名和中奖权重
// 权重越高，中奖概率越大（相对概率）
const PARTICIPANTS_CONFIG = [
    { name: "张三", weight: 1 },
    { name: "李四", weight: 1.5 },
    { name: "王五", weight: 1 },
    { name: "赵六", weight: 2 },
    { name: "钱七", weight: 1 },
    { name: "孙八", weight: 1.2 },
    { name: "周九", weight: 1 },
    { name: "吴十", weight: 1.8 },
    { name: "郑十一", weight: 1 },
    { name: "王十二", weight: 1.3 },
    { name: "冯十三", weight: 1 },
    { name: "陈十四", weight: 1.5 },
    { name: "褚十五", weight: 1 },
    { name: "卫十六", weight: 1.1 },
    { name: "蒋十七", weight: 1 },
    { name: "沈十八", weight: 1.4 },
    { name: "韩十九", weight: 1 },
    { name: "杨二十", weight: 1.6 },
    { name: "朱廿一", weight: 1 },
    { name: "秦廿二", weight: 1.2 },
    { name: "尤廿三", weight: 1 },
    { name: "许廿四", weight: 1.3 },
    { name: "何廿五", weight: 1 },
    { name: "吕廿六", weight: 1.7 },
    { name: "施廿七", weight: 1 },
    { name: "张廿八", weight: 1.1 },
    { name: "孔廿九", weight: 1 },
    { name: "曹三十", weight: 1.5 },
];

// 奖品配置 - 包含等级、数量、图片路径、名称
const PRIZES_CONFIG = [
    {
        level: 1,
        name: "特等奖",
        displayName: "iPhone 16 Pro Max",
        quantity: 1,
        image: "images/prize1.png",
        description: "苹果最新旗舰手机",
        color: "#FFD700"
    },
    {
        level: 2,
        name: "一等奖",
        displayName: "iPad Pro 2024",
        quantity: 2,
        image: "images/prize2.png",
        description: "高性能平板电脑",
        color: "#C0C0C0"
    },
    {
        level: 3,
        name: "二等奖",
        displayName: "AirPods Pro",
        quantity: 3,
        image: "images/prize3.png",
        description: "主动降噪无线耳机",
        color: "#CD7F32"
    },
    {
        level: 4,
        name: "三等奖",
        displayName: "小米手环8",
        quantity: 5,
        image: "images/prize4.png",
        description: "智能运动手环",
        color: "#E8E8E8"
    },
    {
        level: 5,
        name: "参与奖",
        displayName: "定制U盘",
        quantity: 10,
        image: "images/prize5.png",
        description: "64GB高速U盘",
        color: "#87CEEB"
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
    module.exports = { PARTICIPANTS_CONFIG, PRIZES_CONFIG, SYSTEM_CONFIG, AI_CONFIG };
}
