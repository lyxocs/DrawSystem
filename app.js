/**
 * �齱ϵͳ - ���߼��ļ�
 * ʵ�ֲ��Żس齱����
 */

class LotterySystem {
    constructor() {
        // �����ü�������
        this.participants = JSON.parse(JSON.stringify(PARTICIPANTS_CONFIG)); // ���
        this.prizes = JSON.parse(JSON.stringify(PRIZES_CONFIG)); // ���
        this.config = SYSTEM_CONFIG;
        
        // �н���¼
        this.winners = [];
        
        // �齱״̬
        this.isRolling = false;
        
        // ����DOMԪ��
        this.cacheElements();
        
        // ��ʼ��
        this.init();
    }
    
    // ����DOMԪ��
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
    
    // ��ʼ��ϵͳ
    init() {
        this.renderPrizes();
        this.renderPrizeSelect();
        this.updateStats();
        this.bindEvents();
        this.initParticles();
        this.loadFromStorage();
    }
    
    // ��Ⱦ��Ʒ�б�
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
    
    // ��ȡ��Ʒ�������
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
    
    // ��Ⱦ����ѡ����
    renderPrizeSelect() {
        const html = this.prizes
            .filter(prize => prize.quantity > 0)
            .map(prize => `
                <option value="${prize.level}">${prize.name} - ${prize.displayName} (ʣ��${prize.quantity})</option>
            `).join('');
        
        this.elements.prizeSelect.innerHTML = html || '<option value="">���޿ɳ齱��</option>';
        this.updateRemainingCount();
    }
    
    // ����ʣ��������ʾ
    updateRemainingCount() {
        const selectedLevel = parseInt(this.elements.prizeSelect.value);
        const prize = this.prizes.find(p => p.level === selectedLevel);
        this.elements.remainingCount.textContent = `ʣ��: ${prize ? prize.quantity : 0}`;
    }
    
    // ����ͳ����Ϣ
    updateStats() {
        const totalParticipants = PARTICIPANTS_CONFIG.length;
        const remainingParticipants = this.participants.length;
        const winnersCount = this.winners.length;
        
        this.elements.totalParticipants.textContent = totalParticipants;
        this.elements.remainingParticipants.textContent = remainingParticipants;
        this.elements.winnersCount.textContent = winnersCount;
    }
    
    // ���¼�
    bindEvents() {
        // �齱��ť
        this.elements.drawButton.addEventListener('click', () => this.startDraw());
        
        // ����ѡ��仯
        this.elements.prizeSelect.addEventListener('change', () => this.updateRemainingCount());
        
        // ���ð�ť
        this.elements.resetButton.addEventListener('click', () => this.resetLottery());
        
        // �ر���ף����
        this.elements.closeCelebration.addEventListener('click', () => this.closeCelebration());
        
        // ��������ر�
        this.elements.celebrationOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.celebrationOverlay) {
                this.closeCelebration();
            }
        });
        
        // �����¼� - �ո�ʼ�齱
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRolling) {
                e.preventDefault();
                this.startDraw();
            }
        });
    }
    
    // ��ʼ�齱
    startDraw() {
        if (this.isRolling) return;
        
        const selectedLevel = parseInt(this.elements.prizeSelect.value);
        if (!selectedLevel) {
            this.showMessage('��ѡ��Ҫ��ȡ�Ľ���');
            return;
        }
        
        const prize = this.prizes.find(p => p.level === selectedLevel);
        if (!prize || prize.quantity <= 0) {
            this.showMessage('�ý����ѳ���');
            return;
        }
        
        if (this.participants.length === 0) {
            this.showMessage('û��ʣ�������');
            return;
        }
        
        this.isRolling = true;
        this.elements.drawButton.disabled = true;
        this.elements.drawButton.classList.add('rolling');
        this.elements.drawButton.querySelector('.button-text').textContent = '�齱��...';
        
        // ����֮ǰ���н���Ƭ
        this.elements.currentWinner.querySelector('.winner-card').classList.add('hidden');
        
        // ��ʼ��������
        this.rollNames(prize);
    }
    
    // ���ֹ�������
    rollNames(prize) {
        let rollCount = 0;
        const maxRolls = 30; // ��������
        const baseInterval = 50; // �������
        
        const roll = () => {
            rollCount++;
            
            // ���ѡ��һ��������ʾ
            const randomIndex = Math.floor(Math.random() * this.participants.length);
            const randomName = this.participants[randomIndex].name;
            
            this.elements.displayScreen.innerHTML = `
                <div class="rolling-names">${randomName}</div>
            `;
            
            // ������һ�ι����ļ����𽥱�����
            const progress = rollCount / maxRolls;
            const interval = baseInterval + (progress * progress * 200);
            
            if (rollCount < maxRolls) {
                setTimeout(roll, interval);
            } else {
                // ����������ȷ���н���
                this.determineWinner(prize);
            }
        };
        
        roll();
    }
    
    // ����Ȩ��ȷ���н���
    determineWinner(prize) {
        // ������Ȩ��
        const totalWeight = this.participants.reduce((sum, p) => sum + p.weight, 0);
        
        // ���������
        let random = Math.random() * totalWeight;
        
        // ����Ȩ��ѡ���н���
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
        
        // ���û�ҵ����������������⣩��ȡ���һ��
        if (!winner) {
            winnerIndex = this.participants.length - 1;
            winner = this.participants[winnerIndex];
        }
        
        // �Ӳ������б����Ƴ������Żأ�
        this.participants.splice(winnerIndex, 1);
        
        // ���ٽ�Ʒ����
        prize.quantity--;
        
        // ��¼�н���Ϣ
        const winnerRecord = {
            name: winner.name,
            prize: prize.name,
            prizeName: prize.displayName,
            prizeLevel: prize.level,
            time: new Date().toLocaleTimeString()
        };
        this.winners.unshift(winnerRecord); // �µ���ǰ��
        
        // ��ʾ�н����
        this.showWinner(winnerRecord, prize);
        
        // ���浽���ش洢
        this.saveToStorage();
    }
    
    // ��ʾ�н���
    showWinner(winnerRecord, prize) {
        // ������ʾ��
        this.elements.displayScreen.innerHTML = `
            <div class="winner-display">
                <div class="name">${winnerRecord.name}</div>
                <div class="prize">��� ${prize.name} - ${prize.displayName}</div>
            </div>
        `;
        
        // ��ʾ�н���Ƭ
        const winnerCard = this.elements.currentWinner.querySelector('.winner-card');
        winnerCard.classList.remove('hidden');
        this.elements.winnerName.textContent = winnerRecord.name;
        this.elements.winnerPrize.textContent = `${prize.name} - ${prize.displayName}`;
        
        // ���½���
        this.renderPrizes();
        this.renderPrizeSelect();
        this.renderWinnersList();
        this.updateStats();
        
        // ������صȽ���һ�Ƚ�����ʾ������ף����
        if (prize.level <= 2) {
            setTimeout(() => {
                this.showCelebration(winnerRecord);
            }, 500);
        }
        
        // �����ʴ�Ч��
        this.createConfetti();
        
        // ���ð�ť״̬
        this.isRolling = false;
        this.elements.drawButton.disabled = false;
        this.elements.drawButton.classList.remove('rolling');
        this.elements.drawButton.querySelector('.button-text').textContent = '��ʼ�齱';
    }
    
    // ��ʾ������ף����
    showCelebration(winnerRecord) {
        this.elements.bigWinnerName.textContent = winnerRecord.name;
        this.elements.bigPrizeName.textContent = `${winnerRecord.prize} - ${winnerRecord.prizeName}`;
        this.elements.celebrationOverlay.classList.add('active');
        
        // ��Ӹ���ʴ�
        for (let i = 0; i < 50; i++) {
            setTimeout(() => this.createConfetti(true), i * 50);
        }
    }
    
    // �ر���ף����
    closeCelebration() {
        this.elements.celebrationOverlay.classList.remove('active');
    }
    
    // ��Ⱦ�н�����
    renderWinnersList() {
        if (this.winners.length === 0) {
            this.elements.winnersList.innerHTML = '<div class="empty-list">�����н���¼</div>';
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
    
    // �����ʴ�Ч��
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
            
            // �����������Ƴ�
            setTimeout(() => confetti.remove(), 4000);
        }
    }
    
    // ���ó齱
    resetLottery() {
        if (this.isRolling) return;
        
        if (!confirm('ȷ��Ҫ���ó齱�������н���¼������գ�')) {
            return;
        }
        
        // ��������
        this.participants = JSON.parse(JSON.stringify(PARTICIPANTS_CONFIG));
        this.prizes = JSON.parse(JSON.stringify(PRIZES_CONFIG));
        this.winners = [];
        
        // ������ش洢
        localStorage.removeItem('lotteryState');
        
        // ������Ⱦ
        this.renderPrizes();
        this.renderPrizeSelect();
        this.renderWinnersList();
        this.updateStats();
        
        // ������ʾ��
        this.elements.displayScreen.innerHTML = '<div class="waiting-text">׼���齱</div>';
        
        // �����н���Ƭ
        this.elements.currentWinner.querySelector('.winner-card').classList.add('hidden');
        
        this.showMessage('�齱������');
    }
    
    // ����״̬�����ش洢
    saveToStorage() {
        const state = {
            participants: this.participants,
            prizes: this.prizes,
            winners: this.winners
        };
        localStorage.setItem('lotteryState', JSON.stringify(state));
    }
    
    // �ӱ��ش洢����״̬
    loadFromStorage() {
        const saved = localStorage.getItem('lotteryState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.participants = state.participants;
                this.prizes = state.prizes;
                this.winners = state.winners;
                
                // ������Ⱦ
                this.renderPrizes();
                this.renderPrizeSelect();
                this.renderWinnersList();
                this.updateStats();
            } catch (e) {
                console.error('���ش洢����ʧ��:', e);
            }
        }
    }
    
    // ��ʾ��Ϣ
    showMessage(text) {
        // �򵥵���Ϣ��ʾ
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
    
    // ��ʼ�����ӱ���
    initParticles() {
        const canvas = this.elements.particles;
        const ctx = canvas.getContext('2d');
        
        // ���û�����С
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // ��������
        const particles = [];
        const particleCount = 80;
        
        // ��������
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
        
        // ����ѭ��
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                // ����λ��
                p.x += p.speedX;
                p.y += p.speedY;
                
                // �߽紦��
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                // ��������
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                
                // ��������
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

// �����Ϣ��ʾ������ʽ
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

// ҳ�������ɺ��ʼ��
document.addEventListener('DOMContentLoaded', () => {
    window.lotterySystem = new LotterySystem();
});
