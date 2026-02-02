/**
 * 抽奖系统 - 主逻辑文件
 * 实现不放回抽奖功能
 */

class LotterySystem {
    constructor() {
        // 从配置加载数据
        this.participants = JSON.parse(JSON.stringify(PARTICIPANTS_CONFIG)); // 深拷贝
        this.prizes = JSON.parse(JSON.stringify(PRIZES_CONFIG)); // 深拷贝
        this.config = SYSTEM_CONFIG;
        
        // 中奖记录
        this.winners = [];
        
        // 抽奖状态
        this.isRolling = false;
        
        // 缓存DOM元素
        this.cacheElements();
        
        // 初始化
        this.init();
    }
    
    // 缓存DOM元素
    cacheElements() {
        this.elements = {
            prizesGrid: document.getElementById('prizesGrid'),
            prizeSelect: document.getElementById('prizeSelect'),
            remainingCount: document.getElementById('remainingCount'),
            drawButton: document.getElementById('drawButton'),
            displayScreen: document.getElementById('displayScreen'),
            winnersList: document.getElementById('winnersList'),
            totalParticipants: document.getElementById('totalParticipants'),
            remainingParticipants: document.getElementById('remainingParticipants'),
            winnersCount: document.getElementById('winnersCount'),
            resetButton: document.getElementById('resetButton'),
            celebrationOverlay: document.getElementById('celebrationOverlay'),
            closeCelebration: document.getElementById('closeCelebration'),
            bigWinnerName: document.getElementById('bigWinnerName'),
            bigPrizeName: document.getElementById('bigPrizeName'),
            currentWinner: document.getElementById('currentWinner'),
            winnerName: document.getElementById('winnerName'),
            winnerPrize: document.getElementById('winnerPrize'),
            particles: document.getElementById('particles')
        };
    }
    
    // 初始化系统
    init() {
        this.renderPrizes();
        this.renderPrizeSelect();
        this.updateStats();
        this.bindEvents();
        this.initParticles();
        this.loadFromStorage();
    }
    
    // 渲染奖品列表
    renderPrizes() {
        const html = this.prizes.map((prize, index) => {
            const remaining = prize.quantity;
            const isDepleted = remaining <= 0;
            const prizeEmoji = this.getPrizeEmoji(prize.level);
            
            return `
                <div class="prize-card ${isDepleted ? 'depleted' : ''}" 
                     style="--prize-color: ${prize.color}"
                     data-prize-index="${index}">
                    <div class="prize-image">
                        ${prizeEmoji}
                    </div>
                    <div class="prize-info">
                        <div class="prize-level">${prize.name}</div>
                        <div class="prize-name">${prize.displayName}</div>
                    </div>
                    <div class="prize-count">
                        <span class="current">${remaining}</span>/${PRIZES_CONFIG[index].quantity}
                    </div>
                </div>
            `;
        }).join('');
        
        this.elements.prizesGrid.innerHTML = html;
    }
    
    // 获取奖品表情符号
    getPrizeEmoji(level) {
        const emojis = {
            1: '?',
            2: '?',
            3: '?',
            4: '?',
            5: '?'
        };
        return emojis[level] || '?';
    }
    
    // 渲染奖项选择器
    renderPrizeSelect() {
        const html = this.prizes
            .filter(prize => prize.quantity > 0)
            .map(prize => `
                <option value="${prize.level}">${prize.name} - ${prize.displayName} (剩余${prize.quantity})</option>
            `).join('');
        
        this.elements.prizeSelect.innerHTML = html || '<option value="">暂无可抽奖项</option>';
        this.updateRemainingCount();
    }
    
    // 更新剩余数量显示
    updateRemainingCount() {
        const selectedLevel = parseInt(this.elements.prizeSelect.value);
        const prize = this.prizes.find(p => p.level === selectedLevel);
        this.elements.remainingCount.textContent = `剩余: ${prize ? prize.quantity : 0}`;
    }
    
    // 更新统计信息
    updateStats() {
        const totalParticipants = PARTICIPANTS_CONFIG.length;
        const remainingParticipants = this.participants.length;
        const winnersCount = this.winners.length;
        
        this.elements.totalParticipants.textContent = totalParticipants;
        this.elements.remainingParticipants.textContent = remainingParticipants;
        this.elements.winnersCount.textContent = winnersCount;
    }
    
    // 绑定事件
    bindEvents() {
        // 抽奖按钮
        this.elements.drawButton.addEventListener('click', () => this.startDraw());
        
        // 奖项选择变化
        this.elements.prizeSelect.addEventListener('change', () => this.updateRemainingCount());
        
        // 重置按钮
        this.elements.resetButton.addEventListener('click', () => this.resetLottery());
        
        // 关闭庆祝弹窗
        this.elements.closeCelebration.addEventListener('click', () => this.closeCelebration());
        
        // 点击背景关闭
        this.elements.celebrationOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.celebrationOverlay) {
                this.closeCelebration();
            }
        });
        
        // 键盘事件 - 空格开始抽奖
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRolling) {
                e.preventDefault();
                this.startDraw();
            }
        });
    }
    
    // 开始抽奖
    startDraw() {
        if (this.isRolling) return;
        
        const selectedLevel = parseInt(this.elements.prizeSelect.value);
        if (!selectedLevel) {
            this.showMessage('请选择要抽取的奖项');
            return;
        }
        
        const prize = this.prizes.find(p => p.level === selectedLevel);
        if (!prize || prize.quantity <= 0) {
            this.showMessage('该奖项已抽完');
            return;
        }
        
        if (this.participants.length === 0) {
            this.showMessage('没有剩余参与者');
            return;
        }
        
        this.isRolling = true;
        this.elements.drawButton.disabled = true;
        this.elements.drawButton.classList.add('rolling');
        this.elements.drawButton.querySelector('.button-text').textContent = '抽奖中...';
        
        // 隐藏之前的中奖卡片
        this.elements.currentWinner.querySelector('.winner-card').classList.add('hidden');
        
        // 开始滚动动画
        this.rollNames(prize);
    }
    
    // 名字滚动动画
    rollNames(prize) {
        let rollCount = 0;
        const maxRolls = 30; // 滚动次数
        const baseInterval = 50; // 基础间隔
        
        const roll = () => {
            rollCount++;
            
            // 随机选择一个名字显示
            const randomIndex = Math.floor(Math.random() * this.participants.length);
            const randomName = this.participants[randomIndex].name;
            
            this.elements.displayScreen.innerHTML = `
                <div class="rolling-names">${randomName}</div>
            `;
            
            // 计算下一次滚动的间隔（逐渐变慢）
            const progress = rollCount / maxRolls;
            const interval = baseInterval + (progress * progress * 200);
            
            if (rollCount < maxRolls) {
                setTimeout(roll, interval);
            } else {
                // 滚动结束，确定中奖者
                this.determineWinner(prize);
            }
        };
        
        roll();
    }
    
    // 根据权重确定中奖者
    determineWinner(prize) {
        // 计算总权重
        const totalWeight = this.participants.reduce((sum, p) => sum + p.weight, 0);
        
        // 生成随机数
        let random = Math.random() * totalWeight;
        
        // 根据权重选择中奖者
        let winner = null;
        let winnerIndex = -1;
        
        for (let i = 0; i < this.participants.length; i++) {
            random -= this.participants[i].weight;
            if (random <= 0) {
                winner = this.participants[i];
                winnerIndex = i;
                break;
            }
        }
        
        // 如果没找到（浮点数精度问题），取最后一个
        if (!winner) {
            winnerIndex = this.participants.length - 1;
            winner = this.participants[winnerIndex];
        }
        
        // 从参与者列表中移除（不放回）
        this.participants.splice(winnerIndex, 1);
        
        // 减少奖品数量
        prize.quantity--;
        
        // 记录中奖信息
        const winnerRecord = {
            name: winner.name,
            prize: prize.name,
            prizeName: prize.displayName,
            prizeLevel: prize.level,
            time: new Date().toLocaleTimeString()
        };
        this.winners.unshift(winnerRecord); // 新的在前面
        
        // 显示中奖结果
        this.showWinner(winnerRecord, prize);
        
        // 保存到本地存储
        this.saveToStorage();
    }
    
    // 显示中奖者
    showWinner(winnerRecord, prize) {
        // 更新显示屏
        this.elements.displayScreen.innerHTML = `
            <div class="winner-display">
                <div class="name">${winnerRecord.name}</div>
                <div class="prize">获得 ${prize.name} - ${prize.displayName}</div>
            </div>
        `;
        
        // 显示中奖卡片
        const winnerCard = this.elements.currentWinner.querySelector('.winner-card');
        winnerCard.classList.remove('hidden');
        this.elements.winnerName.textContent = winnerRecord.name;
        this.elements.winnerPrize.textContent = `${prize.name} - ${prize.displayName}`;
        
        // 更新界面
        this.renderPrizes();
        this.renderPrizeSelect();
        this.renderWinnersList();
        this.updateStats();
        
        // 如果是特等奖或一等奖，显示大型庆祝动画
        if (prize.level <= 2) {
            setTimeout(() => {
                this.showCelebration(winnerRecord);
            }, 500);
        }
        
        // 创建彩带效果
        this.createConfetti();
        
        // 重置按钮状态
        this.isRolling = false;
        this.elements.drawButton.disabled = false;
        this.elements.drawButton.classList.remove('rolling');
        this.elements.drawButton.querySelector('.button-text').textContent = '开始抽奖';
    }
    
    // 显示大型庆祝动画
    showCelebration(winnerRecord) {
        this.elements.bigWinnerName.textContent = winnerRecord.name;
        this.elements.bigPrizeName.textContent = `${winnerRecord.prize} - ${winnerRecord.prizeName}`;
        this.elements.celebrationOverlay.classList.add('active');
        
        // 添加更多彩带
        for (let i = 0; i < 50; i++) {
            setTimeout(() => this.createConfetti(true), i * 50);
        }
    }
    
    // 关闭庆祝弹窗
    closeCelebration() {
        this.elements.celebrationOverlay.classList.remove('active');
    }
    
    // 渲染中奖名单
    renderWinnersList() {
        if (this.winners.length === 0) {
            this.elements.winnersList.innerHTML = '<div class="empty-list">暂无中奖记录</div>';
            return;
        }
        
        const html = this.winners.map((winner, index) => {
            const rank = index + 1;
            let rankClass = 'rank-other';
            if (rank === 1) rankClass = 'rank-1';
            else if (rank === 2) rankClass = 'rank-2';
            else if (rank === 3) rankClass = 'rank-3';
            
            return `
                <div class="winner-item">
                    <div class="winner-rank ${rankClass}">${rank}</div>
                    <div class="winner-details">
                        <div class="winner-name">${winner.name}</div>
                        <div class="winner-prize">${winner.prize} - ${winner.prizeName}</div>
                    </div>
                    <div class="winner-time">${winner.time}</div>
                </div>
            `;
        }).join('');
        
        this.elements.winnersList.innerHTML = html;
    }
    
    // 创建彩带效果
    createConfetti(intense = false) {
        const container = this.elements.currentWinner;
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        const count = intense ? 20 : 10;
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 20}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation-duration: ${Math.random() * 2 + 2}s;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            
            if (intense) {
                document.body.appendChild(confetti);
            } else {
                container.appendChild(confetti);
            }
            
            // 动画结束后移除
            setTimeout(() => confetti.remove(), 4000);
        }
    }
    
    // 重置抽奖
    resetLottery() {
        if (this.isRolling) return;
        
        if (!confirm('确定要重置抽奖吗？所有中奖记录将被清空！')) {
            return;
        }
        
        // 重置数据
        this.participants = JSON.parse(JSON.stringify(PARTICIPANTS_CONFIG));
        this.prizes = JSON.parse(JSON.stringify(PRIZES_CONFIG));
        this.winners = [];
        
        // 清除本地存储
        localStorage.removeItem('lotteryState');
        
        // 重新渲染
        this.renderPrizes();
        this.renderPrizeSelect();
        this.renderWinnersList();
        this.updateStats();
        
        // 重置显示屏
        this.elements.displayScreen.innerHTML = '<div class="waiting-text">准备抽奖</div>';
        
        // 隐藏中奖卡片
        this.elements.currentWinner.querySelector('.winner-card').classList.add('hidden');
        
        this.showMessage('抽奖已重置');
    }
    
    // 保存状态到本地存储
    saveToStorage() {
        const state = {
            participants: this.participants,
            prizes: this.prizes,
            winners: this.winners
        };
        localStorage.setItem('lotteryState', JSON.stringify(state));
    }
    
    // 从本地存储加载状态
    loadFromStorage() {
        const saved = localStorage.getItem('lotteryState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.participants = state.participants;
                this.prizes = state.prizes;
                this.winners = state.winners;
                
                // 重新渲染
                this.renderPrizes();
                this.renderPrizeSelect();
                this.renderWinnersList();
                this.updateStats();
            } catch (e) {
                console.error('加载存储数据失败:', e);
            }
        }
    }
    
    // 显示消息
    showMessage(text) {
        // 简单的消息提示
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            font-size: 1.1rem;
            z-index: 2000;
            animation: fadeInOut 2s ease forwards;
        `;
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 2000);
    }
    
    // 初始化粒子背景
    initParticles() {
        const canvas = this.elements.particles;
        const ctx = canvas.getContext('2d');
        
        // 设置画布大小
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // 粒子数组
        const particles = [];
        const particleCount = 80;
        
        // 创建粒子
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#667eea' : '#764ba2'
            });
        }
        
        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                // 更新位置
                p.x += p.speedX;
                p.y += p.speedY;
                
                // 边界处理
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                // 绘制粒子
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                
                // 绘制连线
                particles.forEach((p2, j) => {
                    if (i === j) return;
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = p.color;
                        ctx.globalAlpha = (1 - distance / 150) * 0.2;
                        ctx.stroke();
                    }
                });
            });
            
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// 添加消息提示动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.lotterySystem = new LotterySystem();
});
