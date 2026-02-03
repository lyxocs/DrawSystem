/**
 * 抽奖系统 - 主逻辑文件
 * 实现不放回抽奖功能
 */

class LotterySystem {
    constructor() {
        this.participants = JSON.parse(JSON.stringify(PARTICIPANTS_CONFIG));
        this.prizes = JSON.parse(JSON.stringify(PRIZES_CONFIG));
        this.config = SYSTEM_CONFIG;
        this.winners = [];
        this.isRolling = false;
        this.currentSong = null;
        this.currentWinnerRecords = null;
        this.currentPrize = null;
        this.cacheElements();
        this.init();
    }
    
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
            bigWinnersList: document.getElementById('bigWinnersList'),
            bigPrizeName: document.getElementById('bigPrizeName'),
            currentWinner: document.getElementById('currentWinner'),
            winnersDisplay: document.getElementById('winnersDisplay'),
            winnerPrize: document.getElementById('winnerPrize'),
            particles: document.getElementById('particles'),
            drawCount: document.getElementById('drawCount'),
            countMinus: document.getElementById('countMinus'),
            countPlus: document.getElementById('countPlus'),
            // AI歌曲相关元素
            songSection: document.getElementById('songSection'),
            songStatus: document.getElementById('songStatus'),
            songLyrics: document.getElementById('songLyrics'),
            playSongBtn: document.getElementById('playSongBtn'),
            stopSongBtn: document.getElementById('stopSongBtn'),
            regenerateSongBtn: document.getElementById('regenerateSongBtn')
        };
    }
    
    init() {
        this.currentDrawCount = 1;
        this.renderPrizes();
        this.renderPrizeSelect();
        this.updateStats();
        this.bindEvents();
        this.initParticles();
        this.loadFromStorage();
        this.validateDrawCount();
        
        // 初始化AI歌曲服务
        if (typeof initAISongService === 'function') {
            initAISongService();
        }
        
        // 默认隐藏歌曲区域
        if (this.elements.songSection) {
            this.elements.songSection.classList.add('hidden');
        }
    }
    
    renderPrizes() {
        const html = this.prizes.map((prize, index) => {
            const remaining = prize.quantity;
            const isDepleted = remaining <= 0;
            const prizeEmoji = this.getPrizeEmoji(prize.level);
            
            return `
                <div class="prize-card ${isDepleted ? 'depleted' : ''}" 
                     style="--prize-color: ${prize.color}"
                     data-prize-index="${index}">
                    <div class="prize-image">${prizeEmoji}</div>
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
    
    getPrizeEmoji(level) {
        const emojis = { 1: '📱', 2: '💻', 3: '🎧', 4: '⌚', 5: '💾' };
        return emojis[level] || '🎁';
    }
    
    renderPrizeSelect() {
        const html = this.prizes
            .filter(prize => prize.quantity > 0)
            .map(prize => `
                <option value="${prize.level}">${prize.name} - ${prize.displayName} (剩余${prize.quantity})</option>
            `).join('');
        
        this.elements.prizeSelect.innerHTML = html || '<option value="">暂无可抽奖项</option>';
        this.updateRemainingCount();
    }
    
    updateRemainingCount() {
        const selectedLevel = parseInt(this.elements.prizeSelect.value);
        const prize = this.prizes.find(p => p.level === selectedLevel);
        this.elements.remainingCount.textContent = `剩余: ${prize ? prize.quantity : 0}`;
        
        // 同时验证抽取人数
        this.validateDrawCount();
    }
    
    updateStats() {
        const totalParticipants = PARTICIPANTS_CONFIG.length;
        const remainingParticipants = this.participants.length;
        const winnersCount = this.winners.length;
        
        this.elements.totalParticipants.textContent = totalParticipants;
        this.elements.remainingParticipants.textContent = remainingParticipants;
        this.elements.winnersCount.textContent = winnersCount;
    }
    
    bindEvents() {
        this.elements.drawButton.addEventListener('click', () => this.startDraw());
        this.elements.prizeSelect.addEventListener('change', () => this.updateRemainingCount());
        this.elements.resetButton.addEventListener('click', () => this.resetLottery());
        this.elements.closeCelebration.addEventListener('click', () => this.closeCelebration());
        
        // 抽取人数 +/- 按钮
        this.elements.countMinus.addEventListener('click', () => this.adjustDrawCount(-1));
        this.elements.countPlus.addEventListener('click', () => this.adjustDrawCount(1));
        this.elements.drawCount.addEventListener('change', () => this.validateDrawCount());
        
        // AI歌曲控制按钮
        this.elements.playSongBtn.addEventListener('click', () => this.playSong());
        this.elements.stopSongBtn.addEventListener('click', () => this.stopSong());
        this.elements.regenerateSongBtn.addEventListener('click', () => this.regenerateSong());
        
        this.elements.celebrationOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.celebrationOverlay) {
                this.closeCelebration();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRolling) {
                e.preventDefault();
                this.startDraw();
            }
        });
    }
    
    // 调整抽取人数
    adjustDrawCount(delta) {
        const input = this.elements.drawCount;
        let value = parseInt(input.value) || 1;
        value = Math.max(1, Math.min(10, value + delta));
        input.value = value;
        this.validateDrawCount();
    }
    
    // 验证抽取人数
    validateDrawCount() {
        const input = this.elements.drawCount;
        let value = parseInt(input.value) || 1;
        
        // 获取当前奖品剩余数量和参与者数量
        const selectedLevel = parseInt(this.elements.prizeSelect.value);
        const prize = this.prizes.find(p => p.level === selectedLevel);
        const maxByPrize = prize ? prize.quantity : 1;
        const maxByParticipants = this.participants.length;
        const maxAllowed = Math.min(10, maxByPrize, maxByParticipants);
        
        value = Math.max(1, Math.min(maxAllowed, value));
        input.value = value;
        input.max = maxAllowed;
    }
    
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
        
        // 获取抽取人数
        this.validateDrawCount();
        const drawCount = parseInt(this.elements.drawCount.value) || 1;
        
        // 检查是否有足够的奖品和参与者
        if (drawCount > prize.quantity) {
            this.showMessage(`该奖项仅剩 ${prize.quantity} 个`);
            return;
        }
        
        if (drawCount > this.participants.length) {
            this.showMessage(`仅剩 ${this.participants.length} 位参与者`);
            return;
        }
        
        this.currentDrawCount = drawCount;
        this.isRolling = true;
        this.elements.drawButton.disabled = true;
        this.elements.drawButton.classList.add('rolling');
        this.elements.drawButton.querySelector('.button-text').textContent = '抽奖中...';
        
        this.elements.currentWinner.querySelector('.winner-card').classList.add('hidden');
        this.rollNames(prize);
    }
    
    rollNames(prize) {
        let rollCount = 0;
        const maxRolls = 30;
        const baseInterval = 50;
        const drawCount = this.currentDrawCount || 1;
        
        const roll = () => {
            rollCount++;
            
            // 显示多个随机名字
            const displayNames = [];
            for (let i = 0; i < Math.min(drawCount, this.participants.length); i++) {
                const randomIndex = Math.floor(Math.random() * this.participants.length);
                displayNames.push(this.participants[randomIndex].name);
            }
            
            if (drawCount === 1) {
                this.elements.displayScreen.innerHTML = `
                    <div class="rolling-names">${displayNames[0]}</div>
                `;
            } else {
                this.elements.displayScreen.innerHTML = `
                    <div class="rolling-names-multi">
                        ${displayNames.map(name => `<span>${name}</span>`).join('')}
                    </div>
                `;
            }
            
            const progress = rollCount / maxRolls;
            const interval = baseInterval + (progress * progress * 200);
            
            if (rollCount < maxRolls) {
                setTimeout(roll, interval);
            } else {
                this.determineWinners(prize, drawCount);
            }
        };
        
        roll();
    }
    
    // 根据权重选择单个中奖者
    selectOneWinner() {
        const totalWeight = this.participants.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        
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
        
        if (!winner) {
            winnerIndex = this.participants.length - 1;
            winner = this.participants[winnerIndex];
        }
        
        // 从参与者列表中移除（不放回）
        this.participants.splice(winnerIndex, 1);
        
        return winner;
    }
    
    // 确定多个中奖者
    determineWinners(prize, count) {
        const winnerRecords = [];
        const time = new Date().toLocaleTimeString();
        
        for (let i = 0; i < count; i++) {
            const winner = this.selectOneWinner();
            prize.quantity--;
            
            const winnerRecord = {
                name: winner.name,
                prize: prize.name,
                prizeName: prize.displayName,
                prizeLevel: prize.level,
                time: time
            };
            winnerRecords.push(winnerRecord);
            this.winners.unshift(winnerRecord);
        }
        
        this.showWinners(winnerRecords, prize);
        this.saveToStorage();
    }
    
    // 显示多个中奖者
    showWinners(winnerRecords, prize) {
        const names = winnerRecords.map(w => w.name);
        
        // 更新显示屏
        if (names.length === 1) {
            this.elements.displayScreen.innerHTML = `
                <div class="winner-display">
                    <div class="name">${names[0]}</div>
                    <div class="prize">获得 ${prize.name} - ${prize.displayName}</div>
                </div>
            `;
        } else {
            this.elements.displayScreen.innerHTML = `
                <div class="winner-display multi">
                    <div class="names-grid">
                        ${names.map(name => `<span class="name">${name}</span>`).join('')}
                    </div>
                    <div class="prize">获得 ${prize.name} - ${prize.displayName}</div>
                </div>
            `;
        }
        
        // 显示中奖卡片
        const winnerCard = this.elements.currentWinner.querySelector('.winner-card');
        winnerCard.classList.remove('hidden');
        
        // 更新中奖者名字显示
        this.elements.winnersDisplay.innerHTML = names.map((name, i) => `
            <div class="winner-name-item" style="animation-delay: ${i * 0.1}s">${name}</div>
        `).join('');
        
        this.elements.winnerPrize.textContent = `${prize.name} - ${prize.displayName}`;
        
        this.renderPrizes();
        this.renderPrizeSelect();
        this.renderWinnersList();
        this.updateStats();
        this.validateDrawCount();
        
        // 如果是特等奖或一等奖，显示大型庆祝动画
        if (prize.level <= 2) {
            setTimeout(() => {
                this.showCelebration(winnerRecords, prize);
            }, 500);
        }
        
        this.createConfetti();
        
        this.isRolling = false;
        this.elements.drawButton.disabled = false;
        this.elements.drawButton.classList.remove('rolling');
        this.elements.drawButton.querySelector('.button-text').textContent = '开始抽奖';
    }
    
    showCelebration(winnerRecords, prize) {
        // 支持单个或多个中奖者
        const records = Array.isArray(winnerRecords) ? winnerRecords : [winnerRecords];
        const names = records.map(w => w.name);
        
        // 保存当前中奖信息用于歌曲生成
        this.currentWinnerRecords = records;
        this.currentPrize = prize;
        
        // 更新大奖名单显示
        this.elements.bigWinnersList.innerHTML = names.map((name, i) => `
            <div class="big-winner-name-item" style="animation-delay: ${i * 0.15}s">${name}</div>
        `).join('');
        
        const prizeInfo = prize || records[0];
        this.elements.bigPrizeName.textContent = `${prizeInfo.name || prizeInfo.prize} - ${prizeInfo.displayName || prizeInfo.prizeName}`;
        this.elements.celebrationOverlay.classList.add('active');
        
        // 第一波彩带 - 立即开始
        for (let i = 0; i < 30; i++) {
            setTimeout(() => this.createConfetti(true), i * 40);
        }
        
        // 第二波彩带 - 1秒后
        setTimeout(() => {
            for (let i = 0; i < 25; i++) {
                setTimeout(() => this.createConfetti(true), i * 50);
            }
        }, 1000);
        
        // 第三波彩带 - 2秒后
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => this.createConfetti(true), i * 60);
            }
        }, 2000);
        
        // 生成AI歌曲
        this.generateSong(records, prizeInfo);
    }
    
    closeCelebration() {
        this.elements.celebrationOverlay.classList.remove('active');
        this.stopSong();
    }
    
    // 生成AI歌曲
    async generateSong(winnerRecords, prize) {
        // 检查AI服务是否可用
        if (!aiSongService || !aiSongService.isEnabledForPrize(prize.level)) {
            this.elements.songSection.classList.add('hidden');
            return;
        }
        
        this.elements.songSection.classList.remove('hidden');
        this.resetSongUI();
        
        // 更新状态
        this.updateSongStatus('generating', '🎵', '正在创作祝贺歌曲...');
        
        try {
            this.currentSong = await aiSongService.generateAndPlay(
                winnerRecords,
                prize,
                (status, message) => {
                    switch (status) {
                        case 'generating-lyrics':
                            this.updateSongStatus('generating', '✍️', message);
                            break;
                        case 'generating-audio':
                            this.updateSongStatus('generating', '🎤', message);
                            break;
                        case 'ready':
                            this.updateSongStatus('ready', '✅', '歌曲已准备就绪！');
                            break;
                        case 'error':
                            this.updateSongStatus('error', '⚠️', message);
                            break;
                    }
                }
            );
            
            if (this.currentSong) {
                // 显示歌词
                this.elements.songLyrics.textContent = this.currentSong.lyrics;
                
                // 启用按钮
                this.elements.playSongBtn.disabled = false;
                this.elements.regenerateSongBtn.disabled = false;
                
                // 如果有音频且设置了自动播放
                if (this.currentSong.audioUrl && AI_CONFIG.autoPlay) {
                    this.playSong();
                }
            }
        } catch (error) {
            console.error('生成歌曲失败:', error);
            this.updateSongStatus('error', '❌', '生成失败，请重试');
            this.elements.regenerateSongBtn.disabled = false;
        }
    }
    
    // 更新歌曲状态显示
    updateSongStatus(type, icon, text) {
        this.elements.songStatus.className = `song-status ${type}`;
        this.elements.songStatus.innerHTML = `
            <span class="status-icon">${icon}</span>
            <span class="status-text">${text}</span>
        `;
    }
    
    // 重置歌曲UI
    resetSongUI() {
        this.elements.songLyrics.textContent = '';
        this.elements.playSongBtn.disabled = true;
        this.elements.playSongBtn.classList.remove('playing');
        this.elements.playSongBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">播放歌曲</span>';
        this.elements.stopSongBtn.style.display = 'none';
        this.elements.regenerateSongBtn.disabled = true;
        this.currentSong = null;
    }
    
    // 播放歌曲
    playSong() {
        if (!this.currentSong || !this.currentSong.audioUrl) {
            this.showMessage('暂无音频可播放');
            return;
        }
        
        const audio = this.currentSong.play();
        
        if (audio) {
            this.elements.playSongBtn.classList.add('playing');
            this.elements.playSongBtn.innerHTML = `
                <div class="audio-wave">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span class="btn-text">播放中</span>
            `;
            this.elements.stopSongBtn.style.display = 'flex';
            
            audio.onended = () => {
                this.elements.playSongBtn.classList.remove('playing');
                this.elements.playSongBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">重新播放</span>';
                this.elements.stopSongBtn.style.display = 'none';
            };
        }
    }
    
    // 停止播放
    stopSong() {
        if (aiSongService) {
            aiSongService.stopAudio();
        }
        this.elements.playSongBtn.classList.remove('playing');
        this.elements.playSongBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">播放歌曲</span>';
        this.elements.stopSongBtn.style.display = 'none';
    }
    
    // 重新生成歌曲
    async regenerateSong() {
        if (this.currentWinnerRecords && this.currentPrize) {
            this.stopSong();
            await this.generateSong(this.currentWinnerRecords, this.currentPrize);
        }
    }
    
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
    
    createConfetti(intense = false) {
        const container = this.elements.currentWinner;
        // 新年喜庆彩带颜色：红色、金色、橙色
        const colors = ['#dc2626', '#ffd700', '#ef4444', '#f59e0b', '#fbbf24', '#b91c1c', '#ff6b6b', '#fef08a'];
        const count = intense ? 25 : 12;
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            if (intense) {
                // 全屏彩带 - 从顶部随机位置落下
                confetti.style.cssText = `
                    left: ${Math.random() * 100}%;
                    top: ${-Math.random() * 10}%;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    width: ${Math.random() * 12 + 6}px;
                    height: ${Math.random() * 12 + 6}px;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                    animation-duration: ${Math.random() * 2 + 2.5}s;
                    animation-delay: ${Math.random() * 0.3}s;
                    box-shadow: 0 0 ${Math.random() * 10 + 5}px ${colors[Math.floor(Math.random() * colors.length)]};
                `;
                document.body.appendChild(confetti);
            } else {
                // 局部彩带
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
                container.appendChild(confetti);
            }
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }
    
    resetLottery() {
        if (this.isRolling) return;
        
        if (!confirm('确定要重置抽奖吗？所有中奖记录将被清空！')) {
            return;
        }
        
        this.participants = JSON.parse(JSON.stringify(PARTICIPANTS_CONFIG));
        this.prizes = JSON.parse(JSON.stringify(PRIZES_CONFIG));
        this.winners = [];
        
        localStorage.removeItem('lotteryState');
        
        this.renderPrizes();
        this.renderPrizeSelect();
        this.renderWinnersList();
        this.updateStats();
        
        this.elements.displayScreen.innerHTML = '<div class="waiting-text">准备抽奖</div>';
        this.elements.currentWinner.querySelector('.winner-card').classList.add('hidden');
        this.elements.drawCount.value = 1;
        this.validateDrawCount();
        
        this.showMessage('抽奖已重置');
    }
    
    saveToStorage() {
        const state = {
            participants: this.participants,
            prizes: this.prizes,
            winners: this.winners
        };
        localStorage.setItem('lotteryState', JSON.stringify(state));
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('lotteryState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.participants = state.participants;
                this.prizes = state.prizes;
                this.winners = state.winners;
                
                this.renderPrizes();
                this.renderPrizeSelect();
                this.renderWinnersList();
                this.updateStats();
            } catch (e) {
                console.error('加载存储数据失败:', e);
            }
        }
    }
    
    showMessage(text) {
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
    
    initParticles() {
        const canvas = this.elements.particles;
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const particles = [];
        const particleCount = 80;
        
        // 新年喜庆色：红色和金色
        const festiveColors = ['#dc2626', '#ffd700', '#ef4444', '#f59e0b', '#b91c1c'];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: festiveColors[Math.floor(Math.random() * festiveColors.length)]
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                
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

document.addEventListener('DOMContentLoaded', () => {
    window.lotterySystem = new LotterySystem();
});
