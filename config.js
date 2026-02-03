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
    { id: "employee", name: "普通员工", description: "普通员工" },
    { id: "guest", name: "嘉宾池", description: "嘉宾" },
];

// ==========================================
// 参与者配置
// ==========================================
// name: 姓名
// weight: 中奖权重（权重越高，中奖概率越大）
// pools: 所属池子ID数组（可选，不填则默认只参与"all"池）
const PARTICIPANTS_CONFIG = [
    // 嘉宾
    { name: "张总", weight: 1, pools: ["all", "guest"] },
    { name: "李总", weight: 1, pools: ["all", "guest"] },
    { name: "王经理", weight: 1, pools: ["all", "guest"] },
    
    // 普通员工
    { name: "郑十一", weight: 1, pools: ["all", "employee"] },
    { name: "王十二", weight: 1, pools: ["all", "employee"] },
    
    // 新员工
    { name: "韩十九", weight: 1, pools: ["all", "employee"] },
    { name: "杨二十", weight: 1, pools: ["all", "employee"] },
    { name: "朱廿一", weight: 1, pools: ["all", "employee"] },
    { name: "秦廿二", weight: 1, pools: ["all", "employee"] },
    { name: "尤廿三", weight: 1, pools: ["all", "employee"] },
    { name: "许廿四", weight: 1, pools: ["all", "employee"] },
    { name: "何廿五", weight: 1, pools: ["all", "employee"] },
    { name: "吕廿六", weight: 1, pools: ["all", "employee"] },
    { name: "施廿七", weight: 1, pools: ["all", "employee"] },
    { name: "张廿八", weight: 1, pools: ["all", "employee", "guest"] },
    { name: "孔廿九", weight: 1, pools: ["all", "employee", "guest"] },
    { name: "曹三十", weight: 1, pools: ["all", "employee", "guest"] },
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
        displayName: "iPhone 17(256G)",
        quantity: 1,
        image: "images/prize1.png",
        description: "苹果最新旗舰手机",
        color: "#FFD700",
        pools: ["employee"]  // 全员可抽
    },
    {
        level: 2,
        name: "一等奖",
        displayName: "大疆 DJI Osmo 360 8K高清全景运动相机标准套装",
        quantity: 2,
        image: "images/prize2.png",
        description: "高性能平板电脑",
        color: "#C0C0C0",
        pools: ["employee"]  // 仅员工可抽
    },
    {
        level: 3,
        name: "一等奖",
        displayName: "Apple Watch Series 11 GPS版本",
        quantity: 2,
        image: "images/prize3.png",
        description: "Apple Watch Series 11 GPS版本",
        color: "#CD7F32",
        pools: ["employee"]  // 全员可抽
    },
    {
        level: 4,
        name: "二等奖",
        displayName: "LOOKI L1 AI 生活主理人 自动生成vlog 多模态AI助手",
        quantity: 5,
        image: "images/prize4.png",
        description: "LOOKI L1 AI 生活主理人 自动生成vlog 多模态AI助手",
        color: "#E8E8E8",
        pools: ["employee"]  // 员工可抽
    },
    {
        level: 5,
        name: "二等奖",
        displayName: "韶音骨传导耳机-耳夹款【黑、红、紫】",
        quantity: 5,
        image: "images/prize5.png",
        description: "韶音骨传导耳机-耳夹款【黑、红、紫】",
        color: "#FF6B6B",
        pools: ["employee"]  // 员工可抽
    },
    {
        level: 6,
        name: "二等奖",
        displayName: "爱马仕（HERMES）大地香水礼盒",
        quantity: 5,
        image: "images/prize6.png",
        description: "法国进口红酒",
        color: "#8B0000",
        pools: ["employee"]  // 仅管理层可抽
    },
    {
        level: 7,
        name: "二等奖",
        displayName: "小度添添旋转智能屏T10",
        quantity: 5,
        image: "images/prize6.png",
        description: "小度添添旋转智能屏T10",
        color: "#8B0000",
        pools: ["employee"]  // 员工可抽
    },
    {
        level: 8,
        name: "三等奖",
        displayName: "KODAK Mini2 Retro照片打印机",
        quantity: 8,
        image: "images/prize6.png",
        description: "KODAK Mini2 Retro照片打印机",
        color: "#8B0000",
        pools: ["all"]  // 员工可抽
    },
    {
        level: 9,
        name: "三等奖",
        displayName: "全民K歌家庭蓝牙麦克风一体机套装YH59",
        quantity: 8,
        image: "images/prize6.png",
        description: "全民K歌家庭蓝牙麦克风一体机套装YH59",
        color: "#8B0000",
        pools: ["all"]  // 员工可抽
    },
    {
        level: 10,
        name: "三等奖",
        displayName: "亚朵星球深睡枕Pro3.0礼袋装",
        quantity: 8,
        image: "images/prize6.png",
        description: "亚朵星球深睡枕Pro3.0礼袋装",
        color: "#8B0000",
        pools: ["all"]  // 员工可抽
    },
    {
        level: 11,
        name: "四等奖",
        displayName: "飞利浦（PHILIPS）声波电动牙刷钻石3系",
        quantity: 10,
        image: "images/prize6.png",
        description: "飞利浦（PHILIPS）声波电动牙刷钻石3系",
        color: "#8B0000",
        pools: ["all"]  // 员工可抽
    },
    {
        level: 12,
        name: "四等奖",
        displayName: "欧舒丹礼盒甜扁桃沐浴油",
        quantity: 10,
        image: "images/prize6.png",
        description: "欧舒丹礼盒甜扁桃沐浴油",
        color: "#8B0000",
        pools: ["all"]  // 员工可抽
    },
    {
        level: 13,
        name: "四等奖",
        displayName: "闻绮（Venchi）混合夹心巧克力 礼袋27颗",
        quantity: 10,
        image: "images/prize6.png",
        description: "闻绮（Venchi）混合夹心巧克力 礼袋27颗",
        color: "#8B0000",
        pools: ["all"]  // 员工可抽
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
