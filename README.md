# ? 抽奖系统 - Lucky Draw System

一个现代化、炫酷的不放回抽奖系统，使用纯前端技术实现。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ? 功能特点

- ? **奖品展示** - 清晰展示所有奖品等级、名称和剩余数量
- ? **权重抽奖** - 支持为每位参与者设置不同的中奖权重
- ? **不放回抽奖** - 中奖者自动从参与者池中移除
- ? **中奖名单** - 实时记录并展示所有中奖者信息
- ? **数据持久化** - 自动保存抽奖状态到本地存储
- ? **炫酷动画** - 滚动抽奖、粒子背景、彩带庆祝等特效
- ? **响应式设计** - 完美适配各种屏幕尺寸

## ? 快速开始

### 方式一：直接打开
双击 `index.html` 文件即可在浏览器中运行。

### 方式二：本地服务器
```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx serve .

# 或使用 VS Code Live Server 插件
```

然后访问 `http://localhost:8080`

## ? 项目结构

```
DrawSystem/
├── index.html      # 主页面
├── styles.css      # 样式文件
├── app.js          # 主逻辑
├── config.js       # 配置文件
├── images/         # 奖品图片目录
│   ├── prize1.png
│   ├── prize2.png
│   └── ...
└── README.md       # 说明文档
```

## ?? 配置说明

### 参与者配置 (`config.js`)

```javascript
const PARTICIPANTS_CONFIG = [
    { name: "张三", weight: 1 },      // 权重1，标准概率
    { name: "李四", weight: 1.5 },    // 权重1.5，概率提高50%
    { name: "王五", weight: 2 },      // 权重2，概率翻倍
    // ... 添加更多参与者
];
```

**权重说明：**
- 权重为1表示标准中奖概率
- 权重为2表示中奖概率是标准的2倍
- 权重为0.5表示中奖概率是标准的一半

### 奖品配置 (`config.js`)

```javascript
const PRIZES_CONFIG = [
    {
        level: 1,                        // 奖品等级（用于排序和选择）
        name: "特等奖",                   // 奖项名称
        displayName: "iPhone 16 Pro Max", // 奖品名称
        quantity: 1,                      // 奖品数量
        image: "images/prize1.png",       // 奖品图片路径
        description: "苹果最新旗舰手机",    // 奖品描述
        color: "#FFD700"                  // 主题颜色
    },
    // ... 添加更多奖品
];
```

### 系统配置 (`config.js`)

```javascript
const SYSTEM_CONFIG = {
    animationDuration: 3000,  // 抽奖动画持续时间（毫秒）
    showWeight: false,        // 是否显示权重信息
    eventName: "2026年度抽奖盛典",  // 活动名称
    primaryColor: "#667eea",  // 主题色
    secondaryColor: "#764ba2" // 副主题色
};
```

## ? 使用方法

1. **选择奖项** - 从下拉菜单中选择要抽取的奖项
2. **开始抽奖** - 点击"开始抽奖"按钮或按空格键
3. **查看结果** - 等待滚动动画结束，查看中奖者
4. **继续抽奖** - 重复上述步骤抽取其他奖项
5. **重置抽奖** - 点击"重置抽奖"可清空所有记录重新开始

## ? 自定义主题

可以通过修改 `styles.css` 中的 CSS 变量来自定义主题：

```css
:root {
    --primary: #667eea;       /* 主色调 */
    --secondary: #764ba2;     /* 副色调 */
    --gold: #ffd700;          /* 金色 */
    --bg-dark: #0f0f23;       /* 背景色 */
    /* ... 更多变量 */
}
```

## ?? 添加奖品图片

1. 将奖品图片放入 `images/` 目录
2. 在 `config.js` 中更新对应奖品的 `image` 路径
3. 推荐使用正方形图片，尺寸建议 200x200px

## ?? 快捷键

| 快捷键 | 功能 |
|--------|------|
| `空格` | 开始抽奖 |

## ? 技术栈

- HTML5
- CSS3 (动画、Flexbox、Grid、变量)
- JavaScript (ES6+)
- Canvas API (粒子背景)
- LocalStorage (数据持久化)

## ? 更新日志

### v1.0.0 (2026-02-02)
- ? 首次发布
- ? 完整的不放回抽奖功能
- ? 现代化UI设计
- ? 本地数据持久化

## ? 许可证

MIT License - 随意使用和修改

---

**Made with ?? for better lottery experience**
