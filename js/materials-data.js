/**
 * LearnHub 教材與分類設定檔
 * 
 * 【如何新增分類】
 * 在 categories 陣列中新增一個物件：
 * { id: '分類英文ID', name: '分類顯示名稱', icon: '圖示名稱', color: '#色碼', description: '分類簡介' }
 * 
 * 【如何新增教材】
 * 1. 將您的 HTML 教材檔案放入 `materials/` 對應的分類資料夾中
 * 2. 在 materials 陣列中新增一個物件：
 * {
 *   id: '唯一識別碼',
 *   title: '教材標題',
 *   category: '對應的分類英文ID',
 *   description: '教材內容簡短介紹...',
 *   path: 'materials/分類資料夾/檔案名稱.html',
 *   date: 'YYYY-MM-DD',
 *   duration: '預計閱讀或授課時間 (例如: 120 分鐘)',
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
      id: "ai-workshop",
      name: "AI 互動實戰工作坊",
      icon: "sparkles",
      color: "#0ea5e9",
      description: "零基礎 AI Agent 指揮官實戰課程，運用黃金提示詞打造專屬互動小程式與益智遊戲"
    }
  ],

  materials: [
    {
      id: "ai-memory-game-slides",
      title: "AI Agent 指揮官：打造專屬『腦力翻牌』益智遊戲（2 小時實戰工作坊簡報）",
      category: "ai-workshop",
      description: "零基礎帶領學員化身 AI 指揮官，透過黃金 Prompt 提示詞一鍵複製、自訂主題材料包與微調指令，親手完成專屬腦力翻牌記憶遊戲。",
      path: "materials/ai-workshop/index.html",
      date: "2026-10-21",
      duration: "120 分鐘",
      level: "實戰",
      tags: ["AI互動小程式", "Prompt工程", "腦力翻牌遊戲", "互動簡報", "熟齡友善"]
    }
  ]
};
