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
            if (sectionId) {
                showSection(sectionId);
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
