/**
 * LearnHub 個人上課教材網站 主程式邏輯
 * 負責：分類導覽、關鍵字即時搜尋、標籤過濾、深色/淺色主題切換、內嵌全螢幕教材閱讀器與網址 Hash 路由
 */

(function () {
  "use strict";

  const data = window.LEARNHUB_DATA || { siteConfig: {}, categories: [], materials: [] };
  const categories = data.categories || [];
  const materials = data.materials || [];

  // 狀態管理
  const state = {
    selectedCategory: "all",
    selectedTag: null,
    searchQuery: "",
    sortBy: "date-desc",
    viewMode: "grid", // 'grid' | 'list'
    theme: localStorage.getItem("learnhub-theme") || "light",
    currentMaterial: null,
    isFullscreen: false
  };

  // DOM 元素參照
  const els = {
    brandHome: document.getElementById("brand-home"),
    searchInput: document.getElementById("search-input"),
    searchClearBtn: document.getElementById("search-clear-btn"),
    searchShortcut: document.getElementById("search-shortcut"),
    themeToggleBtn: document.getElementById("theme-toggle-btn"),
    howToAddBtn: document.getElementById("how-to-add-btn"),
    categoryNav: document.getElementById("category-nav"),
    tagCloud: document.getElementById("tag-cloud"),
    bannerBadge: document.getElementById("banner-badge"),
    bannerTitle: document.getElementById("banner-title"),
    bannerDesc: document.getElementById("banner-desc"),
    statTotalMaterials: document.getElementById("stat-total-materials"),
    statTotalCategories: document.getElementById("stat-total-categories"),
    resultSummary: document.getElementById("result-summary"),
    activeFiltersContainer: document.getElementById("active-filters"),
    sortSelect: document.getElementById("sort-select"),
    gridViewBtn: document.getElementById("view-grid-btn"),
    listViewBtn: document.getElementById("view-list-btn"),
    materialsContainer: document.getElementById("materials-container"),
    // 閱讀器 Modal
    viewerOverlay: document.getElementById("viewer-overlay"),
    viewerBackBtn: document.getElementById("viewer-back-btn"),
    viewerCategoryTag: document.getElementById("viewer-category-tag"),
    viewerTitle: document.getElementById("viewer-title"),
    viewerFullscreenBtn: document.getElementById("viewer-fullscreen-btn"),
    viewerNewTabBtn: document.getElementById("viewer-newtab-btn"),
    viewerCloseBtn: document.getElementById("viewer-close-btn"),
    viewerIframe: document.getElementById("viewer-iframe"),
    // 新增教材說明 Modal
    helpOverlay: document.getElementById("help-overlay"),
    helpCloseBtn: document.getElementById("help-close-btn")
  };

  // 初始化
  function init() {
    applyTheme(state.theme);
    renderCategories();
    renderTags();
    updateStats();
    renderAll();
    bindEvents();
    checkUrlHash();
  }

  // 主題切換 (深色 / 淺色)
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("learnhub-theme", theme);
    if (els.themeToggleBtn) {
      els.themeToggleBtn.innerHTML =
        theme === "dark"
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      els.themeToggleBtn.setAttribute(
        "title",
        theme === "dark" ? "切換至淺色模式" : "切換至深色模式"
      );
    }
    syncIframeTheme();
  }

  function syncIframeTheme() {
    try {
      if (els.viewerIframe && els.viewerIframe.contentDocument && els.viewerIframe.contentDocument.documentElement) {
        els.viewerIframe.contentDocument.documentElement.setAttribute("data-theme", state.theme);
      }
    } catch (_) {
      // 跨域或尚未載入完成時忽略
    }
  }

  // 取得分類資訊
  function getCategoryById(catId) {
    return (
      categories.find((c) => c.id === catId) || {
        id: catId,
        name: "未分類教材",
        color: "#64748b",
        description: ""
      }
    );
  }

  // 渲染左側分類清單
  function renderCategories() {
    const counts = { all: materials.length };
    categories.forEach((c) => (counts[c.id] = 0));
    materials.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });

    let html = `
      <button type="button" class="category-btn ${state.selectedCategory === "all" ? "active" : ""}" data-cat="all">
        <span class="category-btn-left">
          <span class="category-dot" style="background-color: #2563eb;"></span>
          <span class="category-name">全部課程教材</span>
        </span>
        <span class="category-count">${counts.all}</span>
      </button>
    `;

    categories.forEach((cat) => {
      const isActive = state.selectedCategory === cat.id;
      const count = counts[cat.id] || 0;
      html += `
        <button type="button" class="category-btn ${isActive ? "active" : ""}" data-cat="${escapeHtml(cat.id)}">
          <span class="category-btn-left">
            <span class="category-dot" style="background-color: ${escapeHtml(cat.color || "#3b82f6")};"></span>
            <span class="category-name">${escapeHtml(cat.name)}</span>
          </span>
          <span class="category-count">${count}</span>
        </button>
      `;
    });

    els.categoryNav.innerHTML = html;
  }

  // 渲染熱門標籤雲
  function renderTags() {
    const tagSet = new Set();
    materials.forEach((m) => {
      (m.tags || []).forEach((t) => tagSet.add(t));
    });

    const allTags = Array.from(tagSet);
    let html = "";
    allTags.forEach((tag) => {
      const isActive = state.selectedTag === tag;
      html += `
        <button type="button" class="tag-chip ${isActive ? "active" : ""}" data-tag="${escapeHtml(tag)}">
          #${escapeHtml(tag)}
        </button>
      `;
    });
    els.tagCloud.innerHTML = html;
  }

  // 更新統計數字
  function updateStats() {
    if (els.statTotalMaterials) els.statTotalMaterials.textContent = materials.length;
    if (els.statTotalCategories) els.statTotalCategories.textContent = categories.length;
  }

  // 過濾與排序教材
  function getFilteredMaterials() {
    const q = state.searchQuery.trim().toLowerCase();

    const filtered = materials.filter((item) => {
      if (state.selectedCategory !== "all" && item.category !== state.selectedCategory) {
        return false;
      }
      if (state.selectedTag && !(item.tags || []).includes(state.selectedTag)) {
        return false;
      }
      if (q) {
        const catObj = getCategoryById(item.category);
        const haystack = [
          item.title,
          item.description,
          catObj.name,
          item.level,
          ...(item.tags || [])
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (state.sortBy === "date-desc") {
        return (b.date || "").localeCompare(a.date || "");
      }
      if (state.sortBy === "date-asc") {
        return (a.date || "").localeCompare(b.date || "");
      }
      if (state.sortBy === "title-asc") {
        return (a.title || "").localeCompare(b.title || "", "zh-Hant");
      }
      return 0;
    });

    return filtered;
  }

  // 更新頂部橫幅與教材列表
  function renderAll() {
    renderCategories();
    renderTags();
    renderBanner();
    renderMaterialsList();
  }

  function renderBanner() {
    if (state.selectedCategory === "all") {
      els.bannerBadge.textContent = "ALL COURSES";
      els.bannerTitle.textContent = "所有上課教材總覽";
      els.bannerDesc.textContent =
        "點擊任一教材卡片即可在站內閱讀器直接開啟 HTML 講義，或切換全螢幕進行課堂投影教學。";
    } else {
      const cat = getCategoryById(state.selectedCategory);
      els.bannerBadge.textContent = cat.id.toUpperCase();
      els.bannerTitle.textContent = cat.name;
      els.bannerDesc.textContent = cat.description || `${cat.name}分類下的所有 HTML 教材講義。`;
    }
  }

  function renderMaterialsList() {
    const filtered = getFilteredMaterials();

    // 更新結果摘要與篩選標籤
    els.resultSummary.innerHTML = `共顯示 <strong>${filtered.length}</strong> 份教材`;

    let pillsHtml = "";
    if (state.selectedTag) {
      pillsHtml += `
        <button type="button" class="active-filter-pill" id="clear-tag-btn" title="點擊移除標籤篩選">
          <span>標籤: #${escapeHtml(state.selectedTag)}</span>
          <span>&times;</span>
        </button>
      `;
    }
    if (state.searchQuery.trim()) {
      pillsHtml += `
        <button type="button" class="active-filter-pill" id="clear-query-btn" title="點擊清除關鍵字">
          <span>搜尋: "${escapeHtml(state.searchQuery.trim())}"</span>
          <span>&times;</span>
        </button>
      `;
    }
    els.activeFiltersContainer.innerHTML = pillsHtml;

    if (filtered.length === 0) {
      els.materialsContainer.className = "";
      els.materialsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div class="empty-title">找不到符合條件的教材</div>
          <div class="empty-desc">請嘗試更換搜尋關鍵字，或重置目前的分類與標籤篩選條件。</div>
          <button type="button" class="btn-primary" id="reset-filters-btn">重置所有篩選</button>
        </div>
      `;
      return;
    }

    els.materialsContainer.className = `materials-grid ${state.viewMode === "list" ? "list-view" : ""}`;

    els.materialsContainer.innerHTML = filtered
      .map((item) => {
        const cat = getCategoryById(item.category);
        const tagsHtml = (item.tags || [])
          .map((t) => `<span class="card-tag">#${escapeHtml(t)}</span>`)
          .join("");

        return `
          <article class="material-card" data-id="${escapeHtml(item.id)}" style="--card-accent: ${escapeHtml(cat.color || "#2563eb")}">
            <div class="card-top">
              <div class="card-meta-row">
                <span class="card-category-badge">
                  <span class="category-dot" style="background-color: ${escapeHtml(cat.color || "#2563eb")}"></span>
                  ${escapeHtml(cat.name)}
                </span>
                ${
                  item.level
                    ? `<span class="card-level-badge level-${escapeHtml(item.level)}">${escapeHtml(item.level)}</span>`
                    : ""
                }
              </div>
              <h3 class="card-title">${escapeHtml(item.title)}</h3>
              <p class="card-desc">${escapeHtml(item.description || "")}</p>
              <div class="card-tags">${tagsHtml}</div>
            </div>

            <div class="card-footer">
              <div class="card-info-items">
                ${
                  item.duration
                    ? `<span class="card-info-item" title="預計授課/閱讀時間">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${escapeHtml(item.duration)}
                      </span>`
                    : ""
                }
                ${
                  item.date
                    ? `<span class="card-info-item" title="更新日期">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${escapeHtml(item.date)}
                      </span>`
                    : ""
                }
              </div>

              <div class="card-actions">
                <a href="${escapeHtml(item.path)}" target="_blank" rel="noopener" class="btn-new-tab" title="在新分頁單獨開啟 HTML 教材" data-stop-prop="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
                <span class="btn-read">
                  開啟教材
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </span>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // 開啟站內 HTML 教材閱讀器
  function openMaterialViewer(materialId) {
    const item = materials.find((m) => m.id === materialId);
    if (!item) return;

    state.currentMaterial = item;
    const cat = getCategoryById(item.category);

    els.viewerCategoryTag.textContent = cat.name;
    els.viewerTitle.textContent = item.title;
    els.viewerNewTabBtn.setAttribute("href", item.path);
    els.viewerIframe.setAttribute("src", item.path);

    els.viewerOverlay.classList.add("active");
    document.body.classList.add("viewer-open");

    history.replaceState(null, "", `#material=${encodeURIComponent(item.id)}`);
  }

  function closeMaterialViewer() {
    state.currentMaterial = null;
    state.isFullscreen = false;
    els.viewerOverlay.classList.remove("active", "fullscreen");
    document.body.classList.remove("viewer-open");
    els.viewerIframe.setAttribute("src", "about:blank");

    if (window.location.hash.startsWith("#material=")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function toggleViewerFullscreen() {
    state.isFullscreen = !state.isFullscreen;
    els.viewerOverlay.classList.toggle("fullscreen", state.isFullscreen);
    els.viewerFullscreenBtn.querySelector("span").textContent = state.isFullscreen
      ? "退出全螢幕"
      : "全螢幕投影";
  }

  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash.startsWith("#material=")) {
      const id = decodeURIComponent(hash.replace("#material=", ""));
      openMaterialViewer(id);
    }
  }

  // 綁定所有事件
  function bindEvents() {
    // 點擊 Logo 回到全部教材
    els.brandHome.addEventListener("click", () => {
      state.selectedCategory = "all";
      state.selectedTag = null;
      state.searchQuery = "";
      els.searchInput.value = "";
      updateSearchClearUI();
      renderAll();
    });

    // 分類切換
    els.categoryNav.addEventListener("click", (e) => {
      const btn = e.target.closest(".category-btn");
      if (!btn) return;
      state.selectedCategory = btn.getAttribute("data-cat");
      renderAll();
    });

    // 標籤切換
    els.tagCloud.addEventListener("click", (e) => {
      const chip = e.target.closest(".tag-chip");
      if (!chip) return;
      const tag = chip.getAttribute("data-tag");
      state.selectedTag = state.selectedTag === tag ? null : tag;
      renderAll();
    });

    // 搜尋輸入
    els.searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      updateSearchClearUI();
      renderMaterialsList();
    });

    els.searchClearBtn.addEventListener("click", () => {
      state.searchQuery = "";
      els.searchInput.value = "";
      updateSearchClearUI();
      renderMaterialsList();
      els.searchInput.focus();
    });

    // 快捷鍵 '/' 聚焦搜尋框，'Escape' 關閉閱讀器
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== els.searchInput && !state.currentMaterial) {
        e.preventDefault();
        els.searchInput.focus();
      } else if (e.key === "Escape") {
        if (state.currentMaterial) {
          closeMaterialViewer();
        } else if (els.helpOverlay.classList.contains("active")) {
          els.helpOverlay.classList.remove("active");
        }
      }
    });

    // 排序與檢視模式切換
    els.sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderMaterialsList();
    });

    els.gridViewBtn.addEventListener("click", () => {
      state.viewMode = "grid";
      els.gridViewBtn.classList.add("active");
      els.listViewBtn.classList.remove("active");
      renderMaterialsList();
    });

    els.listViewBtn.addEventListener("click", () => {
      state.viewMode = "list";
      els.listViewBtn.classList.add("active");
      els.gridViewBtn.classList.remove("active");
      renderMaterialsList();
    });

    // 主題切換
    els.themeToggleBtn.addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });

    // 動態篩選膠囊與重置按鈕
    document.addEventListener("click", (e) => {
      if (e.target.closest("#clear-tag-btn")) {
        state.selectedTag = null;
        renderAll();
      } else if (e.target.closest("#clear-query-btn")) {
        state.searchQuery = "";
        els.searchInput.value = "";
        updateSearchClearUI();
        renderMaterialsList();
      } else if (e.target.closest("#reset-filters-btn")) {
        state.selectedCategory = "all";
        state.selectedTag = null;
        state.searchQuery = "";
        els.searchInput.value = "";
        updateSearchClearUI();
        renderAll();
      }
    });

    // 點擊教材卡片開啟閱讀器
    els.materialsContainer.addEventListener("click", (e) => {
      if (e.target.closest("[data-stop-prop='true']")) return;
      const card = e.target.closest(".material-card");
      if (!card) return;
      const id = card.getAttribute("data-id");
      openMaterialViewer(id);
    });

    // 閱讀器控制項
    els.viewerBackBtn.addEventListener("click", closeMaterialViewer);
    els.viewerCloseBtn.addEventListener("click", closeMaterialViewer);
    els.viewerFullscreenBtn.addEventListener("click", toggleViewerFullscreen);
    els.viewerOverlay.addEventListener("click", (e) => {
      if (e.target === els.viewerOverlay) closeMaterialViewer();
    });

    els.viewerIframe.addEventListener("load", syncIframeTheme);

    // 新增教材說明視窗
    els.howToAddBtn.addEventListener("click", () => {
      els.helpOverlay.classList.add("active");
    });
    els.helpCloseBtn.addEventListener("click", () => {
      els.helpOverlay.classList.remove("active");
    });
    els.helpOverlay.addEventListener("click", (e) => {
      if (e.target === els.helpOverlay) els.helpOverlay.classList.remove("active");
    });
  }

  function updateSearchClearUI() {
    const hasText = state.searchQuery.trim().length > 0;
    els.searchClearBtn.style.display = hasText ? "flex" : "none";
    els.searchShortcut.style.display = hasText ? "none" : "block";
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
