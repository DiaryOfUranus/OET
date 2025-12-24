// 通用配置：理论章节结构（仅需在对应页面补充，无需修改此文件）
let theoryConfig = {};
// 当前理论的Markdown内容存储（通过外部引入或替换）
let markdownContent = {};

// 初始化页面
function initPage(config) {
    theoryConfig = config;
    renderVersionSelector();
    loadDefaultVersion();
    bindEvents();
}

// 渲染版本选择器
function renderVersionSelector() {
    const versionSelect = document.getElementById('version-select');
    const versions = Object.keys(theoryConfig.versions).sort();
    versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = `版本 ${version}`;
        versionSelect.appendChild(option);
    });
}

// 加载默认版本（最新版本）
function loadDefaultVersion() {
    const versions = Object.keys(theoryConfig.versions).sort();
    const defaultVersion = versions[versions.length - 1];
    loadVersion(defaultVersion);
}

// 加载指定版本的章节和内容
function loadVersion(version) {
    const chapterList = document.getElementById('chapter-list');
    const versionData = theoryConfig.versions[version];
    // 清空章节列表
    chapterList.innerHTML = '';
    // 渲染章节列表
    versionData.chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${chapter.id}`;
        a.className = `chapter-nav__link ${index === 0 ? 'active' : ''}`;
        a.textContent = chapter.title;
        a.dataset.chapterId = chapter.id;
        a.dataset.version = version;
        li.appendChild(a);
        chapterList.appendChild(li);
    });
    // 加载默认章节（第一个章节）
    const firstChapterId = versionData.chapters[0].id;
    loadChapterContent(version, firstChapterId);
}

// 加载章节Markdown内容并渲染
function loadChapterContent(version, chapterId) {
    const contentContainer = document.getElementById('content-container');
    // 从markdownContent中获取对应内容（可直接替换markdownContent对象更新内容）
    const mdText = markdownContent[version][chapterId] || '暂无内容';
    // 渲染Markdown为HTML
    const mdRenderer = window.markdownit({
        html: true,
        breaks: true,
        linkify: true
    });
    const htmlContent = mdRenderer.render(mdText);
    contentContainer.innerHTML = htmlContent;
    // 高亮当前章节
    document.querySelectorAll('.chapter-nav__link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.version === version && link.dataset.chapterId === chapterId) {
            link.classList.add('active');
        }
    });
}

// 绑定事件（章节点击、版本切换）
function bindEvents() {
    // 章节点击事件
    document.getElementById('chapter-list').addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const version = e.target.dataset.version;
            const chapterId = e.target.dataset.chapterId;
            loadChapterContent(version, chapterId);
        }
    });
    // 版本切换事件
    document.getElementById('version-select').addEventListener('change', (e) => {
        const version = e.target.value;
        loadVersion(version);
    });
}

// 暴露方法：更新Markdown内容（外部可直接调用替换）
window.updateMarkdownContent = function(newContent) {
    markdownContent = newContent;
    // 重新加载当前版本和章节
    const currentVersion = document.getElementById('version-select').value;
    const currentChapter = document.querySelector('.chapter-nav__link.active')?.dataset.chapterId;
    if (currentVersion && currentChapter) {
        loadChapterContent(currentVersion, currentChapter);
    }
}