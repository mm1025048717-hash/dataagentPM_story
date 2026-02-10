/**
 * DataAgent PM Guide - 交互脚本
 * 左侧目录导航 | 章节切换 | 阅读进度
 */

// ============================================
// 初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSidebarToggle();
    initProgressTracking();
    initSearch();
    showSection('intro');
    // 确保当前激活的导航项所在的分组是展开的
    setTimeout(ensureActiveNavExpanded, 100);
});

// ============================================
// 导航功能
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            const scrollToId = item.getAttribute('data-scroll-to');
            if (sectionId) {
                showSection(sectionId);
                if (scrollToId) {
                    setTimeout(() => {
                        const el = document.getElementById(scrollToId);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 150);
                }
                updateActiveNav(item);
                closeSidebarOnMobile();
            }
        });
    });
}

function showSection(sectionId) {
    // 隐藏所有章节
    const sections = document.querySelectorAll('.article-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示目标章节
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 更新URL hash
        history.pushState(null, null, `#${sectionId}`);
        
        // 更新导航激活状态
        const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (navItem) {
            updateActiveNav(navItem);
        }
    }
}

// 全局导航函数（供HTML onclick调用）
function navigateTo(sectionId) {
    showSection(sectionId);
}

// ============================================
// 侧边栏切换
// ============================================

function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        
        // 点击主内容区关闭侧边栏
        document.getElementById('mainContent').addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    }
}

function closeSidebarOnMobile() {
    if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }
}

// ============================================
// 阅读进度追踪
// ============================================

function initProgressTracking() {
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    if (progressFill && progressPercent) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            
            progressFill.style.width = `${Math.min(progress, 100)}%`;
            progressPercent.textContent = `${Math.round(progress)}%`;
        });
    }
}

// ============================================
// 搜索功能
// ============================================

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim().toLowerCase();
                if (query) {
                    searchContent(query);
                }
            }
        });
    }
}

function searchContent(query) {
    const sections = document.querySelectorAll('.article-section');
    
    for (const section of sections) {
        const text = section.textContent.toLowerCase();
        if (text.includes(query)) {
            const sectionId = section.id;
            showSection(sectionId);
            
            // 高亮搜索结果（简单实现）
            setTimeout(() => {
                highlightText(section, query);
            }, 300);
            
            return;
        }
    }
    
    alert('未找到匹配的内容');
}

function highlightText(container, query) {
    // 移除之前的高亮
    const oldMarks = container.querySelectorAll('mark.search-highlight');
    oldMarks.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
    });
    
    // 添加新高亮（简单实现，仅高亮第一个匹配）
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        const index = node.textContent.toLowerCase().indexOf(query);
        if (index !== -1) {
            const range = document.createRange();
            range.setStart(node, index);
            range.setEnd(node, index + query.length);
            
            const mark = document.createElement('mark');
            mark.className = 'search-highlight';
            mark.style.background = '#fef08a';
            mark.style.padding = '2px 4px';
            mark.style.borderRadius = '2px';
            
            range.surroundContents(mark);
            
            // 滚动到高亮位置
            mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            break;
        }
    }
}

// ============================================
// URL Hash处理
// ============================================

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        showSection(hash);
    }
});

// 页面加载时处理hash
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        showSection(hash);
    }
});

// ============================================
// 键盘导航
// ============================================

document.addEventListener('keydown', (e) => {
    // ESC关闭侧边栏
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    }
    
    // Ctrl+K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// ============================================
// 平滑滚动增强
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        // 如果是导航项，已经在initNavigation中处理
        if (this.classList.contains('nav-item')) return;
        
        const targetId = href.slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection && targetSection.classList.contains('article-section')) {
            e.preventDefault();
            showSection(targetId);
        }
    });
});

// ============================================
// 图片懒加载
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// 代码块复制功能
// ============================================

document.querySelectorAll('pre code').forEach(codeBlock => {
    const pre = codeBlock.parentElement;
    
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '复制';
    copyBtn.className = 'copy-btn';
    copyBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 8px;
        font-size: 12px;
        background: #f3f4f6;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
    `;
    
    pre.style.position = 'relative';
    pre.appendChild(copyBtn);
    
    pre.addEventListener('mouseenter', () => {
        copyBtn.style.opacity = '1';
    });
    
    pre.addEventListener('mouseleave', () => {
        copyBtn.style.opacity = '0';
    });
    
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(codeBlock.textContent);
            copyBtn.textContent = '已复制';
            setTimeout(() => {
                copyBtn.textContent = '复制';
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    });
});

// ============================================
// 阅读时间估算
// ============================================

function estimateReadingTime(text) {
    const wordsPerMinute = 300; // 中文阅读速度
    const charCount = text.length;
    const minutes = Math.ceil(charCount / wordsPerMinute);
    return minutes;
}

// ============================================
// 目录折叠功能 - 平滑展开/收起
// ============================================

function toggleNavSection(title) {
    const section = title.closest('.nav-section');
    const children = section.querySelector('.nav-section-children');
    
    if (!children) return;
    
    const isExpanded = title.classList.contains('expanded');
    
    if (isExpanded) {
        // 收起
        children.classList.add('collapsed');
        title.classList.remove('expanded');
    } else {
        // 展开
        children.classList.remove('collapsed');
        title.classList.add('expanded');
    }
}

function toggleNavItem(item) {
    const children = item.nextElementSibling;
    
    if (!children || !children.classList.contains('nav-item-children')) return;
    
    const isExpanded = item.classList.contains('expanded');
    
    if (isExpanded) {
        // 收起
        children.classList.add('collapsed');
        item.classList.remove('expanded');
    } else {
        // 展开
        children.classList.remove('collapsed');
        item.classList.add('expanded');
    }
}

// 初始化：为所有 nav-section-title 添加点击事件
document.querySelectorAll('.nav-section-title').forEach(title => {
    title.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNavSection(title);
    });
});

// 初始化：为所有有子项的 level-0 nav-item 添加点击事件（点击箭头区域）
document.querySelectorAll('.nav-item.level-0.has-children').forEach(item => {
    // 点击整个项时，如果是点击箭头区域，则切换展开/收起；否则跳转
    item.addEventListener('click', (e) => {
        // 如果点击的是箭头区域（右侧），则切换展开/收起
        const rect = item.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const itemWidth = rect.width;
        
        // 如果点击在右侧 32px 内（箭头区域），则切换展开/收起
        if (clickX > itemWidth - 32) {
            e.preventDefault();
            e.stopPropagation();
            toggleNavItem(item);
        }
    });
});

// 确保当前激活的导航项所在的分组是展开的
function ensureActiveNavExpanded() {
    const activeNav = document.querySelector('.nav-item.active');
    if (!activeNav) return;
    
    // 展开包含该激活项的 nav-section
    const navSection = activeNav.closest('.nav-section');
    if (navSection) {
        const sectionTitle = navSection.querySelector('.nav-section-title');
        if (sectionTitle && !sectionTitle.classList.contains('expanded')) {
            toggleNavSection(sectionTitle);
        }
    }
    
    // 展开包含该激活项的 level-0 nav-item
    const level0Parent = activeNav.closest('.nav-item-children')?.previousElementSibling;
    if (level0Parent && level0Parent.classList.contains('has-children')) {
        if (!level0Parent.classList.contains('expanded')) {
            toggleNavItem(level0Parent);
        }
    }
}

// 在导航切换时确保展开
function updateActiveNav(activeItem) {
    // 移除所有激活状态
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加激活状态
    activeItem.classList.add('active');
    
    // 确保激活项所在的分组是展开的
    ensureActiveNavExpanded();
    
    // 确保激活项在视图中
    activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// 响应式处理
// ============================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // 大屏时确保侧边栏显示
        if (window.innerWidth > 1024) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        }
    }, 250);
});

// ============================================
// 控制台欢迎信息
// ============================================

console.log('%cDataAgent PM Guide', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%c从AI爱好者到DataAgent产品经理的完整成长指南', 'color: #6b7280; font-size: 14px;');
console.log('%c快捷键: Ctrl+K 搜索, ESC 关闭侧边栏', 'color: #6b7280; font-size: 12px;');

// ============================================
// 实时市场情报中心（全部使用免费公开 API，无需任何 Key）
// ============================================

const LIVE_CACHE_KEY = 'dataagent_live_feed_v3';
const LIVE_CACHE_TTL = 4 * 60 * 60 * 1000; // 4 小时

// GitHub 搜索关键词组（轮换使用，避免重复）
const GITHUB_QUERIES = [
    'data+agent+language:python',
    'chatbi+OR+text2sql+OR+chat2sql',
    'RAG+agent+enterprise',
    'AI+agent+framework+language:python',
    'langchain+OR+langgraph+agent',
    'knowledge+graph+LLM',
];

// GitHub 专用于 DataAgent/ChatBI/竞品 的搜索词（全球 BI、NL2SQL、语义层、头部厂商相关）
const GITHUB_BI_QUERIES = [
    'NL2SQL+OR+text2sql+OR+natural+language+query',
    'semantic+layer+OR+metrics+layer+analytics',
    'business+intelligence+AI+OR+BI+agent',
    'ThoughtSpot+OR+Tableau+OR+Power+BI+API',
    'chatbi+OR+chat+to+sql+OR+ask+data',
];

// HN Algolia 专用于竞品与 BI 的搜索词（中英文、厂商名、技术词）
const HN_BI_QUERIES = [
    'data agent', 'chatbi', 'natural language BI', 'NL2SQL',
    'ThoughtSpot', 'Tableau AI', 'Power BI', 'semantic layer',
    'AI analytics', 'conversational analytics', 'ask data',
];

// DEV.to 搜索关键词
const DEVTO_TAGS = ['ai', 'machinelearning', 'llm', 'dataagent', 'python', 'data', 'analytics'];

// 国内动态：仅展示与 BI、chatBI、数据、dataagent、AI、竞品相关的内容（标题或摘要命中其一即展示）
const DOMESTIC_RELEVANT_KEYWORDS = [
    'BI', 'chatBI', 'ChatBI', 'chat BI', '商业智能', '智能分析', 'NL2SQL', 'Text2SQL', '自然语言查询',
    '数据', '大数据', '数据分析', '数据处理', '数据智能', 'dataagent', 'DataAgent', 'data agent',
    'AI', '人工智能', '大模型', '机器学习', 'LLM', '语义层', '指标中台',
    '竞品', 'ThoughtSpot', 'Tableau', 'Power BI', '帆软', 'FineBI', '观远', '永洪', 'Quick BI',
    'BI 工具', '分析平台', '对话式分析', 'ask data', 'conversational analytics',
];

function isDomesticRelevant(item) {
    const text = [item.title, item.desc, item.titleZh, item.descZh].filter(Boolean).join(' ');
    if (!text) return false;
    const lower = text.toLowerCase();
    return DOMESTIC_RELEVANT_KEYWORDS.some(kw => {
        if (kw.length <= 2) return lower.includes(kw.toLowerCase());
        return text.includes(kw) || lower.includes(kw.toLowerCase());
    });
}

let currentLiveTab = 'all';
let _fetchSourceStats = {};  // 追踪每个源的抓取状态

// 检测文本是否主要为中文（含 CJK 则倾向不翻译）
function isLikelyChinese(text) {
    if (!text || typeof text !== 'string') return true;
    const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    const total = (text.match(/\S/g) || []).length;
    return total === 0 || cjk / total > 0.3;
}

// 单条文本翻译为中文（MyMemory 免费接口，限流防 429）
const TRANSLATION_CACHE_KEY = 'pm_story_translation_cache';
const TRANSLATION_RATE_LIMIT_KEY = 'pm_story_translation_429';
const TRANSLATION_429_AT_KEY = 'pm_story_translation_429_at';
const TRANSLATION_CACHE_MAX = 500;  // 最多缓存条数
const TRANSLATION_MIN_INTERVAL_MS = 3000;  // 两次请求最小间隔，避免 429
const TRANSLATION_429_COOLDOWN_MS = 24 * 60 * 60 * 1000;  // 收到 429 后 24 小时内不再请求，避免反复触发

let _translationRateLimited = (function () {
    try {
        const set = sessionStorage.getItem(TRANSLATION_RATE_LIMIT_KEY) === '1';
        const at = parseInt(sessionStorage.getItem(TRANSLATION_429_AT_KEY) || '0', 10);
        if (set && at && (Date.now() - at < TRANSLATION_429_COOLDOWN_MS)) return true;
        if (set && at && (Date.now() - at >= TRANSLATION_429_COOLDOWN_MS)) {
            sessionStorage.removeItem(TRANSLATION_RATE_LIMIT_KEY);
            sessionStorage.removeItem(TRANSLATION_429_AT_KEY);
        }
        return false;
    } catch (e) { return false; }
})();

let _lastTranslationRequestTime = 0;

function getTranslationCache() {
    try {
        const raw = localStorage.getItem(TRANSLATION_CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
}

function setTranslationCache(cache) {
    try {
        const keys = Object.keys(cache);
        if (keys.length > TRANSLATION_CACHE_MAX) {
            const toDel = keys.slice(0, keys.length - TRANSLATION_CACHE_MAX);
            toDel.forEach(k => delete cache[k]);
        }
        localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {}
}

async function translateTextToChinese(text) {
    if (!text || text.length > 500 || _translationRateLimited) return text;
    if (isLikelyChinese(text)) return text;
    const cache = getTranslationCache();
    const key = text.slice(0, 200);
    if (cache[key] !== undefined) return cache[key];
    try {
        // 全局节流：保证两次请求间隔至少 TRANSLATION_MIN_INTERVAL_MS，避免 429
        const elapsed = Date.now() - _lastTranslationRequestTime;
        if (elapsed < TRANSLATION_MIN_INTERVAL_MS) {
            await new Promise(r => setTimeout(r, TRANSLATION_MIN_INTERVAL_MS - elapsed));
        }
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh`;
        const resp = await fetch(url);
        _lastTranslationRequestTime = Date.now();
        if (resp.status === 429) {
            _translationRateLimited = true;
            try {
                sessionStorage.setItem(TRANSLATION_RATE_LIMIT_KEY, '1');
                sessionStorage.setItem(TRANSLATION_429_AT_KEY, String(Date.now()));
            } catch (e) {}
            updateTranslateButtonState();
            return text;
        }
        if (!resp.ok) return text;
        const data = await resp.json();
        const t = data?.responseData?.translatedText;
        const result = t && t !== text ? t : text;
        cache[key] = result;
        setTranslationCache(cache);
        return result;
    } catch (e) {
        return text;
    }
}

// 批量将情报列表的标题翻译为中文（仅前 3 条 + 长延迟防 429，优先用缓存；不自动执行）
let _translateFeedInProgress = false;

function updateTranslateButtonState() {
    const btn = document.getElementById('liveTranslateBtn');
    if (!btn) return;
    if (_translationRateLimited) {
        btn.disabled = true;
        btn.textContent = '翻译已达限流，请明日再试';
    } else if (_translateFeedInProgress) {
        btn.disabled = true;
        btn.textContent = '翻译中...';
    } else {
        btn.disabled = false;
        btn.textContent = '翻译为中文';
    }
}

async function translateFeedToChinese() {
    if (_translateFeedInProgress || _translationRateLimited) return;
    const data = window._liveFeedData || [];
    if (!data.length) return;
    _translateFeedInProgress = true;
    updateTranslateButtonState();
    const container = document.getElementById('liveFeedContainer');
    if (container) {
        container.innerHTML = `
            <div class="live-loading">
                <div class="live-loading-spinner"></div>
                <span>正在将部分标题翻译为中文（免费接口限流较严，仅前几条）...</span>
            </div>
        `;
    }
    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    const toTranslate = data.slice(0, 3);  // 只翻译前 3 条，仅标题，大幅降低 429
    for (const item of toTranslate) {
        if (_translationRateLimited) break;
        if (!isLikelyChinese(item.title)) {
            item.titleZh = await translateTextToChinese(item.title);
            await delay(2500);  // 拉长间隔，避免 429
        } else {
            item.titleZh = item.title;
        }
        item.descZh = item.desc || '';  // 描述不请求翻译，减少请求次数
    }
    setLiveCache(window._liveFeedData, _fetchSourceStats);
    renderLiveFeed();
    _translateFeedInProgress = false;
    updateTranslateButtonState();
}

function initLiveMarketFeed() {
    const module = document.getElementById('liveMarketFeed');
    if (!module) return;

    // 翻译按钮：按需翻译，避免自动请求触发 429
    const translateBtn = document.getElementById('liveTranslateBtn');
    if (translateBtn) {
        translateBtn.addEventListener('click', () => translateFeedToChinese());
        updateTranslateButtonState();
    }

    // 绑定 Tab 事件
    const tabs = module.querySelectorAll('.live-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentLiveTab = tab.dataset.tab || 'all';
            renderLiveFeed();
        });
    });

    // 尝试从缓存加载
    const cached = getLiveCache();
    if (cached) {
        window._liveFeedData = cached.data;
        _fetchSourceStats = cached.stats || {};
        renderLiveFeed();
        updateTimestamp(cached.timestamp);
        // 不再自动翻译，避免 MyMemory 免费接口 429；用户可点击「翻译为中文」按需翻译
        // 如果缓存超过 TTL，后台静默刷新
        if (Date.now() - cached.timestamp > LIVE_CACHE_TTL) {
            fetchAllSources();
        }
    } else {
        fetchAllSources();
    }
}

function getLiveCache() {
    try {
        const raw = localStorage.getItem(LIVE_CACHE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function setLiveCache(data, stats) {
    try {
        localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({
            data, stats, timestamp: Date.now()
        }));
    } catch (e) { /* 静默失败 */ }
}

function updateTimestamp(ts) {
    const el = document.getElementById('liveTimestamp');
    if (!el) return;
    const d = new Date(ts || Date.now());
    el.textContent = '更新于 ' + d.toLocaleString('zh-CN', {
        month: 'numeric', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ---- 数据源 1：GitHub Search API（免费，无需认证，60次/小时） ----
async function fetchGitHub() {
    const results = [];
    // 随机选 2 个关键词组并行搜索
    const shuffled = [...GITHUB_QUERIES].sort(() => Math.random() - 0.5);
    const queries = shuffled.slice(0, 2);

    const promises = queries.map(async (query) => {
        try {
            const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=6`;
            const resp = await fetch(url, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });
            if (!resp.ok) return [];
            const data = await resp.json();
            if (!data.items) return [];
            return data.items.map(repo => ({
                title: repo.full_name,
                desc: (repo.description || 'No description').slice(0, 140),
                link: repo.html_url,
                date: repo.updated_at,
                source: 'GitHub',
                type: 'github',
                icon: '🔧',
                stars: repo.stargazers_count,
                language: repo.language
            }));
        } catch (e) { return []; }
    });

    const allResults = await Promise.all(promises);
    allResults.forEach(r => results.push(...r));
    return results;
}

// ---- 数据源 2：Hacker News API（Firebase 托管，完全免费，无限制） ----
async function fetchHackerNews() {
    try {
        // 获取最新 Top Stories 的 IDs
        const topResp = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!topResp.ok) return [];
        const topIds = await topResp.json();

        // 取前 30 个 story，然后筛选 AI/data 相关
        const storyIds = topIds.slice(0, 30);
        const storyPromises = storyIds.map(id =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null)
        );

        const stories = await Promise.all(storyPromises);
        const AI_KEYWORDS = /\b(ai|agent|llm|gpt|claude|gemini|data|rag|langchain|vector|embedding|chatbot|machine.?learning|deep.?learning|neural|transformer|openai|anthropic|knowledge.?graph|text2sql|chatbi|copilot|bi\b|tableau|power\s*bi|thoughtspot|nl2sql|semantic\s*layer|analytics|dashboard)\b/i;

        const filtered = stories.filter(s => {
            if (!s || !s.title) return false;
            const text = (s.title + ' ' + (s.text || '')).toLowerCase();
            return AI_KEYWORDS.test(text);
        });

        // 如果筛选后太少，也返回一些热门的
        const aiItems = filtered.slice(0, 8);
        const generalItems = stories.filter(s => s && s.title && !filtered.includes(s)).slice(0, 4);
        const combined = [...aiItems, ...generalItems].slice(0, 10);

        return combined.map(story => ({
            title: story.title,
            desc: story.text ? stripHTML(story.text).slice(0, 140) : `${story.score || 0} points · ${story.descendants || 0} comments`,
            link: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            date: new Date(story.time * 1000).toISOString(),
            source: 'Hacker News',
            type: 'news',
            icon: '🟠',
            score: story.score,
            comments: story.descendants
        }));
    } catch (e) {
        console.warn('[情报中心] Hacker News 抓取失败:', e.message);
        return [];
    }
}

// ---- 数据源 3：DEV.to API（完全免费公开，无需认证） ----
async function fetchDevTo() {
    try {
        const tag = DEVTO_TAGS[Math.floor(Math.random() * DEVTO_TAGS.length)];
        const url = `https://dev.to/api/articles?tag=${tag}&top=7&per_page=8`;
        const resp = await fetch(url);
        if (!resp.ok) return [];
        const articles = await resp.json();
        if (!Array.isArray(articles)) return [];

        return articles.map(article => ({
            title: article.title,
            desc: (article.description || '').slice(0, 140),
            link: article.url,
            date: article.published_at || article.created_at,
            source: 'DEV.to',
            type: 'news',
            icon: '📝',
            reactions: article.positive_reactions_count,
            comments: article.comments_count
        }));
    } catch (e) {
        console.warn('[情报中心] DEV.to 抓取失败:', e.message);
        return [];
    }
}

// ---- 数据源 4：Hacker News 搜索 API (Algolia, 免费) - 用于 AI 研究 ----
async function fetchHNSearch() {
    try {
        const queries = ['AI agent', 'LLM RAG', 'data agent', 'text2sql', 'natural language BI', 'chatbi'];
        const query = queries[Math.floor(Math.random() * queries.length)];
        const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=8`;
        const resp = await fetch(url);
        if (!resp.ok) return [];
        const data = await resp.json();
        if (!data.hits) return [];

        return data.hits.map(hit => ({
            title: hit.title || hit.story_title || 'Untitled',
            desc: `${hit.points || 0} points · ${hit.num_comments || 0} comments · by ${hit.author || 'unknown'}`,
            link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            date: hit.created_at,
            source: 'HN Search',
            type: 'research',
            icon: '🔬',
            score: hit.points,
            comments: hit.num_comments
        }));
    } catch (e) {
        console.warn('[情报中心] HN Search 抓取失败:', e.message);
        return [];
    }
}

// ---- 数据源 4b：DataAgent / ChatBI 竞品专项（HN Algolia + GitHub，免费） ----
async function fetchBICompetitor() {
    const results = [];
    // HN Algolia：轮换 2 个竞品/BI 相关查询
    const hnQueries = [...HN_BI_QUERIES].sort(() => Math.random() - 0.5).slice(0, 2);
    for (const q of hnQueries) {
        try {
            const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=6`;
            const resp = await fetch(url);
            if (!resp.ok) continue;
            const data = await resp.json();
            if (!data.hits) continue;
            data.hits.forEach(hit => {
                results.push({
                    title: hit.title || hit.story_title || 'Untitled',
                    desc: `${hit.points || 0} points · ${hit.num_comments || 0} comments · by ${hit.author || 'unknown'}`,
                    link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
                    date: hit.created_at,
                    source: 'HN (BI/竞品)',
                    type: 'competitor',
                    icon: '📊',
                    score: hit.points,
                    comments: hit.num_comments
                });
            });
        } catch (e) { /* 单查询失败不阻断 */ }
    }
    // GitHub：1 个 BI/竞品 相关搜索
    try {
        const q = GITHUB_BI_QUERIES[Math.floor(Math.random() * GITHUB_BI_QUERIES.length)];
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=5`;
        const resp = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
        if (resp.ok) {
            const data = await resp.json();
            if (data.items) {
                data.items.forEach(repo => {
                    results.push({
                        title: repo.full_name,
                        desc: (repo.description || '').slice(0, 140),
                        link: repo.html_url,
                        date: repo.updated_at,
                        source: 'GitHub (BI/竞品)',
                        type: 'competitor',
                        icon: '🔧',
                        stars: repo.stargazers_count,
                        language: repo.language
                    });
                });
            }
        }
    } catch (e) { /* 静默 */ }
    return results;
}

// ---- 数据源 5：Product Hunt（通过公开 RSS 转 JSON） ----
async function fetchProductHunt() {
    try {
        // 使用 DEV.to 的 listing 作为替代产品源，搜索 product/launch 相关
        const url = 'https://dev.to/api/articles?tag=product&top=7&per_page=6';
        const resp = await fetch(url);
        if (!resp.ok) return [];
        const articles = await resp.json();
        if (!Array.isArray(articles)) return [];

        return articles.map(article => ({
            title: article.title,
            desc: (article.description || '').slice(0, 140),
            link: article.url,
            date: article.published_at || article.created_at,
            source: 'Product',
            type: 'product',
            icon: '🚀',
            reactions: article.positive_reactions_count
        }));
    } catch (e) {
        return [];
    }
}

// ---- 数据源 4c：AI 最新技术追踪（Claude Skills / MCP / OpenClaw / 大模型更新） ----
const AI_TECH_QUERIES = [
    'claude skills', 'MCP model context protocol', 'openclaw', 'Claude API',
    'GPT-5', 'Claude 4', 'LLM update', 'Cursor MCP', 'Anthropic',
    'agent framework', 'AI agent tools', 'OpenAI o1', 'Gemini Live',
];
const AI_TECH_GITHUB = [
    'openclaw', 'MCP server', 'claude api', 'anthropic', 'cursor skills',
];
async function fetchAITechTrack() {
    const results = [];
    const seen = new Set();
    const addUnique = (item) => {
        const key = (item.title || '').slice(0, 40).toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        results.push(item);
    };
    // HN Algolia：多查询 Claude / MCP / OpenClaw / 大模型更新
    const hnQueries = [...AI_TECH_QUERIES].sort(() => Math.random() - 0.5).slice(0, 3);
    for (const hnQ of hnQueries) {
        try {
            const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(hnQ)}&tags=story&hitsPerPage=6`;
            const resp = await fetch(url);
            if (!resp.ok) continue;
            const data = await resp.json();
            if (data.hits && data.hits.length) {
                data.hits.forEach(hit => {
                    addUnique({
                        title: hit.title || hit.story_title || 'Untitled',
                        desc: `${hit.points || 0} pts · ${hit.num_comments || 0} 评论 · ${hit.author || 'unknown'}`,
                        link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
                        date: hit.created_at,
                        source: 'HN (AI技术)',
                        type: 'ai-tech',
                        icon: '🤖',
                        score: hit.points,
                        comments: hit.num_comments
                    });
                });
            }
        } catch (e) { /* 静默 */ }
    }
    // GitHub：OpenClaw / MCP 等
    const ghQueries = [...AI_TECH_GITHUB].sort(() => Math.random() - 0.5).slice(0, 2);
    for (const q of ghQueries) {
        try {
            const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=5`;
            const resp = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
            if (!resp.ok) continue;
            const data = await resp.json();
            if (data.items && data.items.length) {
                data.items.forEach(repo => {
                    addUnique({
                        title: repo.full_name,
                        desc: (repo.description || '').slice(0, 120),
                        link: repo.html_url,
                        date: repo.updated_at,
                        source: 'GitHub (AI)',
                        type: 'ai-tech',
                        icon: '🔧',
                        stars: repo.stargazers_count,
                        language: repo.language
                    });
                });
            }
        } catch (e) { /* 静默 */ }
    }
    return results;
}

// ---- 数据源 5b：国内产品动态（x2j.dev RSS 转 JSON，免费，替代 rss2json 422） ----
const CHINA_RSS_FEEDS = [
    { url: 'https://36kr.com/feed', name: '36氪' },
    { url: 'https://www.oschina.net/news/rss', name: '开源中国' },
    { url: 'https://www.jiqizhixin.com/rss', name: '机器之心' },
];
function parseX2JItems(data, feedName) {
    try {
        const items = data?.rss?.channel?.item;
        if (!Array.isArray(items)) return [];
        return items.slice(0, 12).map(it => ({
            title: it.title || '',
            desc: (it.description ? stripHTML(String(it.description)).slice(0, 120) : '') || '暂无摘要',
            link: it.link || '',
            date: it.pubDate || it.published || new Date().toISOString(),
            source: feedName,
            type: 'domestic',
            icon: '🇨🇳',
        }));
    } catch (e) { return []; }
}
async function fetchChinaRSS() {
    for (const feed of CHINA_RSS_FEEDS) {
        try {
            const apiUrl = `https://x2j.dev/rss?url=${encodeURIComponent(feed.url)}`;
            const resp = await fetch(apiUrl);
            if (!resp.ok) continue;
            const data = await resp.json();
            const items = parseX2JItems(data, feed.name);
            if (items.length) return items;
        } catch (e) { continue; }
    }
    return [];
}

// V2EX 因 CORS 限制已移除，改用 HN/DEV 等无 CORS 源

// ---- 数据源 6：GitHub Trending（通过搜索近期高星项目模拟） ----
async function fetchGitHubTrending() {
    try {
        // 搜索过去 7 天创建的高星 AI 项目
        const d = new Date();
        d.setDate(d.getDate() - 7);
        const dateStr = d.toISOString().slice(0, 10);
        const url = `https://api.github.com/search/repositories?q=AI+agent+created:>${dateStr}&sort=stars&order=desc&per_page=6`;
        const resp = await fetch(url, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        if (!resp.ok) return [];
        const data = await resp.json();
        if (!data.items) return [];
        return data.items.map(repo => ({
            title: repo.full_name,
            desc: (repo.description || 'New trending project').slice(0, 140),
            link: repo.html_url,
            date: repo.created_at,
            source: 'GitHub Trending',
            type: 'github',
            icon: '🔥',
            stars: repo.stargazers_count,
            language: repo.language
        }));
    } catch (e) { return []; }
}

// ---- 汇总抓取 ----
async function fetchAllSources() {
    showLoading();
    _fetchSourceStats = {};
    _translationRateLimited = false;  // 刷新时重置翻译限流

    const sources = [
        { name: 'GitHub', fn: fetchGitHub },
        { name: 'GitHub Trending', fn: fetchGitHubTrending },
        { name: 'Hacker News', fn: fetchHackerNews },
        { name: 'HN Search (AI)', fn: fetchHNSearch },
        { name: 'DataAgent/竞品', fn: fetchBICompetitor },
        { name: 'AI最新技术', fn: fetchAITechTrack },
        { name: '国内·36氪/开源中国/机器之心', fn: fetchChinaRSS },
        { name: 'DEV.to', fn: fetchDevTo },
        { name: 'Products', fn: fetchProductHunt },
    ];

    const promises = sources.map(async (src) => {
        try {
            const items = await src.fn();
            _fetchSourceStats[src.name] = { count: items.length, status: 'ok' };
            return items;
        } catch (e) {
            _fetchSourceStats[src.name] = { count: 0, status: 'error', error: e.message };
            return [];
        }
    });

    const allResults = await Promise.all(promises);
    const results = [];
    allResults.forEach(items => results.push(...items));

    // 按时间排序
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 去重（按标题前30字符去重）
    const seen = new Set();
    const unique = results.filter(item => {
        const key = item.title.slice(0, 30).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    window._liveFeedData = unique.slice(0, 50);
    setLiveCache(window._liveFeedData, _fetchSourceStats);
    updateTimestamp();
    renderLiveFeed();

    // 控制台输出抓取统计
    console.log('%c[情报中心] 抓取完成', 'color: #10b981; font-weight: bold;');
    console.table(_fetchSourceStats);

    // 不再自动翻译，避免 429；用户可点击「翻译为中文」按需翻译
}

// ---- 辅助函数 ----
function stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

function showLoading() {
    const container = document.getElementById('liveFeedContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="live-loading">
            <div class="live-loading-spinner"></div>
            <span>正在从 GitHub / HN / 国内（36氪·V2EX 等）/ 竞品专项等公开源抓取最新情报...</span>
        </div>
    `;
}

function renderLiveFeed() {
    const container = document.getElementById('liveFeedContainer');
    if (!container) return;
    const data = window._liveFeedData || [];

    let filtered;
    if (currentLiveTab === 'all') {
        filtered = data;
    } else if (currentLiveTab === 'domestic') {
        // 国内动态：仅展示与 BI、chatBI、数据、dataagent、AI、竞品相关的内容
        filtered = data.filter(item => item.type === 'domestic' && isDomesticRelevant(item));
    } else {
        filtered = data.filter(item => item.type === currentLiveTab);
    }

    if (filtered.length === 0) {
        const hint = currentLiveTab === 'domestic'
            ? '当前暂无与 BI / ChatBI / 数据 / AI / 竞品 相关的国内动态，可查看「全部」或点击「刷新」'
            : '当前分类暂无数据，请尝试切换标签或点击「刷新」';
        container.innerHTML = `
            <div class="live-empty">
                <div style="font-size:2rem;margin-bottom:8px;">📡</div>
                ${hint}
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => {
        const dateStr = formatRelativeTime(item.date);
        const starsHtml = item.stars != null
            ? `<span class="live-feed-stat">⭐ ${formatNumber(item.stars)}</span>` : '';
        const scoreHtml = item.score != null && !item.stars
            ? `<span class="live-feed-stat">▲ ${item.score}</span>` : '';
        const reactionsHtml = item.reactions != null && !item.stars && !item.score
            ? `<span class="live-feed-stat">❤️ ${item.reactions}</span>` : '';
        const commentsHtml = item.comments != null
            ? `<span class="live-feed-stat">💬 ${item.comments}</span>` : '';
        const langHtml = item.language
            ? `<span class="live-source-tag github">${item.language}</span>` : '';

        const showTitle = item.titleZh || item.title || '';
        const showDesc = item.descZh !== undefined ? (item.descZh || '') : (item.desc || '');
        return `
            <div class="live-feed-card">
                <div class="live-feed-icon">${item.icon}</div>
                <div class="live-feed-content">
                    <div class="live-feed-title">
                        <a href="${item.link}" target="_blank" rel="noopener">${escapeHtml(showTitle)}</a>
                    </div>
                    <div class="live-feed-desc">${escapeHtml(showDesc)}</div>
                    <div class="live-feed-meta">
                        <span class="live-source-tag ${item.type}">${item.source}</span>
                        ${langHtml}
                        ${starsHtml}
                        ${scoreHtml}
                        ${reactionsHtml}
                        ${commentsHtml}
                        <span class="live-feed-date">${dateStr}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function formatRelativeTime(dateStr) {
    const d = new Date(dateStr);
    const now = Date.now();
    const diff = now - d.getTime();
    if (isNaN(diff) || diff < 0) return '刚刚';
    if (diff < 3600000) return Math.max(1, Math.floor(diff / 60000)) + ' 分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' 天前';
    return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
}

function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
}

function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return str.replace(/[&<>"']/g, c => map[c]);
}

// 全局刷新函数（供按钮调用）
function refreshLiveFeed() {
    // 清除缓存，强制重新抓取
    try { localStorage.removeItem(LIVE_CACHE_KEY); } catch (e) {}
    const btn = document.querySelector('.live-refresh-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = '抓取中...';
    }
    fetchAllSources().finally(() => {
        if (btn) {
            btn.disabled = false;
            btn.textContent = '刷新';
        }
    });
}

// 页面加载时初始化（延迟执行，不阻塞首屏）
setTimeout(() => {
    initLiveMarketFeed();
}, 2000);
