/**
 * LearnHub 教材與分類設定檔
 * 
 * 【如何新增分類】
 * 在 CATEGORIES 陣列中新增一個物件：
 * { id: '分類英文ID', name: '分類顯示名稱', icon: '圖示名稱', color: '#色碼', description: '分類簡介' }
 * 
 * 【如何新增教材】
 * 1. 將您的 HTML 教材檔案放入 `materials/` 對應的分類資料夾中
 * 2. 在 MATERIALS 陣列中新增一個物件：
 * {
 *   id: '唯一識別碼',
 *   title: '教材標題',
 *   category: '對應的分類英文ID',
 *   description: '教材內容簡短介紹...',
 *   path: 'materials/分類資料夾/檔案名稱.html',
 *   date: 'YYYY-MM-DD',
 *   duration: '預計閱讀或授課時間 (例如: 45 分鐘)',
 *   level: '難度 (入門 / 進階 / 實戰)',
 *   tags: ['標籤1', '標籤2']
 * }
 */

window.LEARNHUB_DATA = {
  siteConfig: {
    title: "LearnHub",
    subtitle: "個人上課教材與知識庫中心",
    instructor: "講師教材庫",
    footerText: "LearnHub 個人上課教材網站 · 專為高效教學與自主複習打造"
  },

  categories: [
    {
      id: "web-dev",
      name: "網頁前端開發",
      icon: "code",
      color: "#3b82f6",
      description: "HTML5、CSS3 現代排版與 JavaScript 互動網頁開發核心教材"
    },
    {
      id: "python",
      name: "Python 程式設計",
      icon: "terminal",
      color: "#10b981",
      description: "從基礎語法、資料結構到自動化腳本與資料分析實戰"
    },
    {
      id: "algorithms",
      name: "資料結構與演算法",
      icon: "cpu",
      color: "#8b5cf6",
      description: "圖解常見資料結構、演算法思維與時間複雜度分析"
    },
    {
      id: "tools",
      name: "開發工具與實務",
      icon: "wrench",
      color: "#f59e0b",
      description: "Git 版本控制、終端機指令與現代軟體工程工作流"
    }
  ],

  materials: [
    {
      id: "html-css-flexbox",
      title: "Ch.01 現代 CSS Flexbox 彈性盒子完全指南",
      category: "web-dev",
      description: "透過視覺化圖解與互動範例，徹底掌握主軸與交錯軸對齊、彈性縮放比例及常見響應式導覽列排版實戰。",
      path: "materials/web-dev/flexbox-guide.html",
      date: "2026-10-15",
      duration: "50 分鐘",
      level: "入門",
      tags: ["CSS3", "Flexbox", "RWD排版", "互動範例"]
    },
    {
      id: "js-dom-events",
      title: "Ch.02 JavaScript DOM 操作與事件委派機制",
      category: "web-dev",
      description: "深入理解瀏覽器文件物件模型 (DOM)、元素選取器、事件冒泡與捕獲流程，並實作高效率的動態清單互動。",
      path: "materials/web-dev/js-dom-events.html",
      date: "2026-10-18",
      duration: "60 分鐘",
      level: "進階",
      tags: ["JavaScript", "DOM", "Event", "前端互動"]
    },
    {
      id: "python-data-structures",
      title: "Unit 01 Python 四大核心容器：List、Tuple、Dict 與 Set",
      category: "python",
      description: "比較 Python 內建資料結構的特性、記憶體操作差異與推導式 (Comprehension) 高效寫法，附帶隨堂練習題。",
      path: "materials/python/python-containers.html",
      date: "2026-10-12",
      duration: "45 分鐘",
      level: "入門",
      tags: ["Python", "資料結構", "List推導式", "隨堂練習"]
    },
    {
      id: "algo-big-o-searching",
      title: "Lec 01 時間複雜度 Big-O 與二分搜尋法實戰",
      category: "algorithms",
      description: "為什麼程式會跑得慢？從 O(1) 到 O(n²) 建立演算法效率直覺，並手把手推導二分搜尋法 (Binary Search) 邊界條件。",
      path: "materials/algorithms/big-o-and-binary-search.html",
      date: "2026-10-19",
      duration: "55 分鐘",
      level: "進階",
      tags: ["演算法", "Big-O", "二分搜尋", "圖解教學"]
    },
    {
      id: "git-workflow-basics",
      title: "Lab 01 Git 版本控制核心概念與分支協作流程",
      category: "tools",
      description: "認識工作目錄、暫存區與儲存庫三階段架構，演練日常 Commit、Branch 分支切換與 Merge 衝突解決步驟。",
      path: "materials/tools/git-workflow.html",
      date: "2026-10-20",
      duration: "40 分鐘",
      level: "實戰",
      tags: ["Git", "版本控制", "GitHub", "團隊協作"]
    }
  ]
};
