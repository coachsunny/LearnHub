# LearnHub — 個人上課教材與知識庫網站

**LearnHub** 是一個專為個人教學、課堂投影與學生課後複習打造的純靜態 HTML 教材中心網站。支援透過 **GitHub + Cloudflare Pages / Workers** 自動化持續部署。

## ✨ 核心功能

- **課程分類與標籤篩選**：左側分類導覽列與熱門標籤雲，快速切換不同領域的課程講義。
- **關鍵字即時搜尋**：支援按 `/` 快速聚焦搜尋框，即時檢索教材標題、簡介、分類與標籤。
- **卡片目錄 + 站內內嵌閱讀器**：點擊卡片即可在站內直接開啟 HTML 教材，支援一鍵切換「全螢幕投影授課模式」或「新分頁開啟原始 HTML」。
- **深色 / 淺色主題切換**：自動記憶使用者偏好，並與內嵌 HTML 教材同步深淺色主題。
- **標準化教材模板**：提供 `materials/template.html` 與 `css/courseware.css`，方便快速複製編寫新教材。

## 📁 專案目錄結構

```text
LearnHub/
├── index.html                  # LearnHub 網站主入口
├── wrangler.jsonc              # Cloudflare 部署設定檔
├── css/
│   ├── style.css               # 主站台版面與深淺色主題樣式
│   └── courseware.css          # 單份 HTML 教材共用排版樣式
├── js/
│   ├── materials-data.js       # 教材分類與教材清單設定檔（新增教材改這裡）
│   └── app.js                  # 搜尋、分類篩選、內嵌閱讀器與主題控制邏輯
└── materials/                  # 存放所有 HTML 教材檔案
    ├── template.html           # 新教材標準範例模板
    ├── web-dev/                # 網頁前端開發分類教材
    ├── python/                 # Python 程式設計分類教材
    ├── algorithms/             # 資料結構與演算法分類教材
    └── tools/                  # 開發工具與實務分類教材
```

## 🚀 如何新增一份 HTML 教材？

1. 將您的 `.html` 教材檔案放入 `materials/<分類資料夾>/` 下。
2. 編輯 `js/materials-data.js`，在 `materials` 陣列中新增教材資訊。
3. 推送至 GitHub，Cloudflare 即會自動完成線上更新：
   ```bash
   git add .
   git commit -m "新增教材"
   git push
   ```
