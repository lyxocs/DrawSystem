/**
 * AI歌曲生成服务
 * 为中奖者生成搞怪歌曲并播放
 */

class AISongService {
    constructor(config) {
        this.config = config || AI_CONFIG;
        this.isGenerating = false;
        this.currentAudio = null;
    }
    
    // 检查是否启用
    isEnabled() {
        return this.config.enabled && 
               this.config.llm.apiKey && 
               this.config.llm.apiKey !== 'your-api-key-here';
    }
    
    // 检查是否对该奖项启用
    isEnabledForPrize(prizeLevel) {
        return this.isEnabled() && 
               this.config.enableForLevels.includes(prizeLevel);
    }
    
    // 生成歌词
    async generateLyrics(winners, prize) {
        const winnerNames = Array.isArray(winners) 
            ? winners.map(w => w.name || w).join('、')
            : (winners.name || winners);
        
        const prizeName = prize.displayName || prize.prizeName || prize;
        
        // 替换提示词中的占位符
        const prompt = this.config.promptTemplate
            .replace(/{winners}/g, winnerNames)
            .replace(/{winner}/g, winnerNames)
            .replace(/{prize}/g, prizeName);
        
        try {
            const response = await this.callLLM(prompt);
            return response;
        } catch (error) {
            console.error('生成歌词失败:', error);
            // 返回备用歌词
            return this.getFallbackLyrics(winnerNames, prizeName);
        }
    }
    
    // 调用大模型API
    async callLLM(prompt) {
        const { provider, apiKey, baseUrl, model, timeout } = this.config.llm;
        
        let url, headers, body;
        
        switch (provider) {
            case 'openai':
            case 'moonshot':
            case 'deepseek':
                url = `${baseUrl}/chat/completions`;
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                body = {
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.9,
                    max_tokens: 500
                };
                break;
                
            case 'anthropic':
                url = `${baseUrl}/messages`;
                headers = {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                };
                body = {
                    model: model,
                    max_tokens: 500,
                    messages: [{ role: 'user', content: prompt }]
                };
                break;
                
            case 'zhipu':
                url = `${baseUrl}/chat/completions`;
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                body = {
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.9
                };
                break;
                
            case 'custom':
            default:
                url = `${baseUrl}/chat/completions`;
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                body = {
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.9
                };
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 解析不同提供商的响应格式
            if (provider === 'anthropic') {
                return data.content[0].text;
            } else {
                return data.choices[0].message.content;
            }
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    // 文字转语音
    async textToSpeech(text) {
        const { provider, apiKey, baseUrl, voice, model, speed } = this.config.tts;
        
        // 如果没有配置API或选择浏览器原生TTS
        if (provider === 'browser' || !apiKey || apiKey === 'your-api-key-here') {
            return this.browserTTS(text, voice, speed);
        }
        
        let url, headers, body;
        
        switch (provider) {
            case 'openai':
                url = `${baseUrl}/audio/speech`;
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                body = {
                    model: model,
                    input: text,
                    voice: voice,
                    speed: speed
                };
                break;
                
            case 'azure':
                // Azure TTS实现
                url = baseUrl;
                headers = {
                    'Content-Type': 'application/ssml+xml',
                    'Ocp-Apim-Subscription-Key': apiKey,
                    'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
                };
                body = `<speak version='1.0' xml:lang='zh-CN'>
                    <voice name='${voice}'>${text}</voice>
                </speak>`;
                break;
                
            case 'elevenlabs':
                url = `${baseUrl}/text-to-speech/${voice}`;
                headers = {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                };
                body = {
                    text: text,
                    model_id: model || 'eleven_multilingual_v2'
                };
                break;
                
            case 'fish-audio':
                url = `${baseUrl}/tts`;
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                body = {
                    text: text,
                    voice_id: voice
                };
                break;
                
            case 'custom':
            default:
                url = `${baseUrl}/audio/speech`;
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                body = {
                    model: model,
                    input: text,
                    voice: voice
                };
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: typeof body === 'string' ? body : JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`TTS请求失败: ${response.status}`);
            }
            
            const audioBlob = await response.blob();
            return URL.createObjectURL(audioBlob);
        } catch (error) {
            console.error('语音合成失败:', error);
            throw error;
        }
    }
    
    // 生成并播放歌曲
    async generateAndPlay(winners, prize, onStatusChange) {
        if (this.isGenerating) {
            console.log('正在生成中，请稍候...');
            return null;
        }
        
        this.isGenerating = true;
        
        try {
            // 更新状态: 生成歌词中
            if (onStatusChange) onStatusChange('generating-lyrics', '正在创作歌词...');
            
            const lyrics = await this.generateLyrics(winners, prize);
            
            // 更新状态: 合成语音中
            if (onStatusChange) onStatusChange('generating-audio', '正在合成歌曲...');
            
            const audioUrl = await this.textToSpeech(lyrics);
            
            // 更新状态: 准备就绪
            if (onStatusChange) onStatusChange('ready', '歌曲已准备好');
            
            return {
                lyrics: lyrics,
                audioUrl: audioUrl,
                play: () => this.playAudio(audioUrl),
                stop: () => this.stopAudio()
            };
        } catch (error) {
            console.error('生成歌曲失败:', error);
            if (onStatusChange) onStatusChange('error', '生成失败，使用备用歌词');
            
            // 返回备用内容（无音频）
            const winnerNames = Array.isArray(winners) 
                ? winners.map(w => w.name || w).join('、')
                : (winners.name || winners);
            const prizeName = prize.displayName || prize.prizeName || prize;
            
            return {
                lyrics: this.getFallbackLyrics(winnerNames, prizeName),
                audioUrl: null,
                play: () => {},
                stop: () => {}
            };
        } finally {
            this.isGenerating = false;
        }
    }
    
    // 停止播放
    stopAudio() {
        // 停止浏览器TTS
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        
        if (this.currentAudio) {
            if (this.currentAudio.pause) {
                this.currentAudio.pause();
            }
            if (this.currentAudio.currentTime !== undefined) {
                this.currentAudio.currentTime = 0;
            }
            this.currentAudio = null;
        }
    }
    
    // 浏览器原生TTS（免费，无需API）
    browserTTS(text, voice, speed) {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('浏览器不支持语音合成'));
                return;
            }
            
            // 创建一个假的音频URL，实际播放用speechSynthesis
            const audioUrl = 'browser-tts://' + encodeURIComponent(text);
            
            // 存储TTS参数供播放时使用
            this._browserTTSText = text;
            this._browserTTSVoice = voice;
            this._browserTTSSpeed = speed || 1;
            
            resolve(audioUrl);
        });
    }
    
    // 播放音频（支持浏览器TTS）
    playAudio(audioUrl) {
        this.stopAudio();
        
        // 检查是否是浏览器TTS
        if (audioUrl && audioUrl.startsWith('browser-tts://')) {
            return this.playBrowserTTS();
        }
        
        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.play().catch(error => {
            console.error('播放失败:', error);
        });
        
        return this.currentAudio;
    }
    
    // 播放浏览器原生TTS
    playBrowserTTS() {
        if (!('speechSynthesis' in window)) {
            console.error('浏览器不支持语音合成');
            return null;
        }
        
        // 停止之前的语音
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(this._browserTTSText);
        utterance.lang = 'zh-CN';
        utterance.rate = this._browserTTSSpeed || 1;
        utterance.pitch = 1.1;  // 稍微提高音调，更欢快
        
        // 尝试选择中文语音
        const voices = window.speechSynthesis.getVoices();
        const chineseVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }
        
        // 创建一个模拟的audio对象来保持接口一致
        this.currentAudio = {
            utterance: utterance,
            pause: () => window.speechSynthesis.pause(),
            play: () => window.speechSynthesis.resume(),
            onended: null,
            _isPlaying: true
        };
        
        utterance.onend = () => {
            if (this.currentAudio && this.currentAudio.onended) {
                this.currentAudio.onended();
            }
        };
        
        window.speechSynthesis.speak(utterance);
        
        return this.currentAudio;
    }
    
    // 备用歌词（当API调用失败时使用）
    getFallbackLyrics(winners, prize) {
        const templates = [
            `恭喜恭喜恭喜你！
${winners}中大奖！
${prize}带回家，
今天你是最幸运的人！
鼓掌鼓掌再鼓掌，
祝你天天都这样！`,
            
            `哇塞哇塞太厉害，
${winners}运气来！
${prize}收入囊，
羡慕嫉妒加祝福！
下次轮到我也行，
先恭喜你乐开花！`,
            
            `锣鼓喧天放鞭炮，
${winners}中奖了！
${prize}亮闪闪，
幸运之神降临啦！
大家掌声响起来，
恭喜恭喜发大财！`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    // 仅生成歌词（用于展示，不播放）
    async generateLyricsOnly(winners, prize) {
        if (!this.isEnabled()) {
            const winnerNames = Array.isArray(winners) 
                ? winners.map(w => w.name || w).join('、')
                : (winners.name || winners);
            const prizeName = prize.displayName || prize.prizeName || prize;
            return this.getFallbackLyrics(winnerNames, prizeName);
        }
        
        return await this.generateLyrics(winners, prize);
    }
}

// 创建全局实例
let aiSongService = null;

// 初始化服务
function initAISongService() {
    if (typeof AI_CONFIG !== 'undefined') {
        aiSongService = new AISongService(AI_CONFIG);
    }
    return aiSongService;
}

// 页面加载时初始化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initAISongService);
}
