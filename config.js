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
    eventName: "2026年度抽奖盛典",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2"
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PARTICIPANTS_CONFIG, PRIZES_CONFIG, SYSTEM_CONFIG };
}
