import { getBasePath } from "@/lib/utils";

// Folder mapping matching convert-images.mjs
const folderMap: Record<string, string> = {
  'AI MATCH': 'ai-match',
  'APP REVIEW': 'app-review',
  'B&A': 'before-after',
  'banner': 'banner',
  'BLOG REVIEW': 'blog-review',
  'CAFE REVIEW': 'cafe-review',
  'HOMEPAGE REVIEW': 'homepage-review',
  'ICON': 'icon',
  'LOGO': 'logo',
  'MAIN PAGE': 'main',
  'WELCOME PAGE': 'welcome'
};

// Convert image path to match converted webp structure
function convertThumbPath(imgPath: string): string {
  if (!imgPath) return "";

  let cleanPath = imgPath.replace(/\\/g, "/").replace(/['"]/g, "").trim();

  const imgIdx = cleanPath.toLowerCase().indexOf("img/");
  if (imgIdx !== -1) {
    const relativePath = cleanPath.substring(imgIdx + 4);
    const parts = relativePath.split("/");

    if (parts.length < 2) return cleanPath;

    const sourceFolder = parts[0];
    const mappedFolder = folderMap[sourceFolder] || sourceFolder.toLowerCase().replace(/\s+/g, '-');

    const filename = parts[parts.length - 1];
    const originalName = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "");
    const cleanName = originalName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9가-힣\-_]/g, '');

    let outputName = cleanName;
    if (parts.length > 2) {
      const subFolder = parts.slice(1, -1).join('-').toLowerCase().replace(/\s+/g, '-');
      outputName = `${subFolder}-${cleanName}`;
    }

    return `${getBasePath()}/images/${mappedFolder}/${outputName}.webp`;
  }

  return cleanPath;
}

// Google Sheets CSV URLs
const SHEET_URLS = {
  homepage: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkW3PlSOac3BejYTlX3CxvD8tuGIp44DJ568LJ7cltNLWsNtE_liXd2TGaaDjs5COZKevgIvN24mrK/pub?gid=1808767262&single=true&output=csv",
  blog: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkW3PlSOac3BejYTlX3CxvD8tuGIp44DJ568LJ7cltNLWsNtE_liXd2TGaaDjs5COZKevgIvN24mrK/pub?gid=411332681&single=true&output=csv",
  app: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkW3PlSOac3BejYTlX3CxvD8tuGIp44DJ568LJ7cltNLWsNtE_liXd2TGaaDjs5COZKevgIvN24mrK/pub?gid=1564767700&single=true&output=csv",
  video: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkW3PlSOac3BejYTlX3CxvD8tuGIp44DJ568LJ7cltNLWsNtE_liXd2TGaaDjs5COZKevgIvN24mrK/pub?gid=774400724&single=true&output=csv",
};

export type SheetTab = "homepage" | "blog" | "cafe" | "app" | "video";
export type Category = "tv" | "mini" | "face";

export interface ReviewItem {
  no: string;
  tab: SheetTab;
  category: string;
  level?: number; // Added level field
  title: string;
  author: string;
  date: string;
  badge: string;
  star: string;
  tags: string;
  thumb: string;
  html: string;
  plan?: string;
}

// Parse CSV text to array of objects
function parseCSV(csvText: string, defaultTab: SheetTab): ReviewItem[] {
  if (!csvText) return [];

  // Remove BOM
  csvText = csvText.replace(/^\uFEFF/, "");

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let insideQuote = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === "," && !insideQuote) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\r" || char === "\n") && !insideQuote) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().trim());

  return rows
    .slice(1)
    .map((row) => {
      if (row.length < 2) return null;

      const item: Record<string, string> = {};
      headers.forEach((h, idx) => {
        item[h] = row[idx] || "";
      });

      // Use sheet's tab value or default
      let tab = defaultTab;
      if (item.tab && item.tab.trim() !== "") {
        tab = item.tab.toLowerCase().trim() as SheetTab;
      }

      // Clean thumb path using same logic as convert-images.mjs
      if (item.thumb) {
        item.thumb = convertThumbPath(item.thumb);
      }

      // For app reviews without thumb, extract first image from html content
      if ((!item.thumb || item.thumb.trim() === "") && tab === "app" && item.html) {
        // First try <img> tag
        const imgMatch = item.html.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) {
          item.thumb = convertThumbPath(imgMatch[1]);
        } else {
          // Try raw image path (e.g., img/APP REVIEW/UNNI 1/UNNI 1-1.webp)
          // Allow spaces in path since folder/file names can have spaces
          const rawPathMatch = item.html.match(/(?:^|\n|\r|>)\s*(img\/[^\n\r<]+\.(jpg|jpeg|png|gif|webp))/im);
          if (rawPathMatch && rawPathMatch[1]) {
            item.thumb = convertThumbPath(rawPathMatch[1].trim());
          }
        }
      }

      // Normalize category
      if (item.category) {
        item.category = item.category.toLowerCase();
      }

      // Parse Level (if exists)
      let level: number | undefined;
      if (item.level && !isNaN(Number(item.level))) {
        level = Number(item.level);
      }

      return {
        no: item.no || "",
        tab,
        category: item.category || "",
        level, // New Field
        title: item.title || "",
        author: item.author || "",
        date: item.date || "",
        badge: item.badge || "",
        star: item.star || "★★★★★",
        tags: item.tags || "",
        thumb: item.thumb || "",
        html: item.html || "",
        plan: item.plan || "",
      } as ReviewItem;
    })
    .filter((item): item is ReviewItem => item !== null && (item.title !== "" || item.plan !== ""));
}

// Fetch all review data from Google Sheets
export async function fetchAllReviews(): Promise<ReviewItem[]> {
  try {
    const responses = await Promise.all([
      fetch(SHEET_URLS.homepage).then((r) => r.text()),
      fetch(SHEET_URLS.blog).then((r) => r.text()),
      fetch(SHEET_URLS.app).then((r) => r.text()),
      fetch(SHEET_URLS.video).then((r) => r.text()),
    ]);

    const allData = [
      ...parseCSV(responses[0], "homepage"),
      ...parseCSV(responses[1], "blog"),
      ...parseCSV(responses[2], "app"),
      ...parseCSV(responses[3], "video"),
    ];

    // Sort by no
    allData.sort((a, b) => Number(a.no) - Number(b.no));

    return allData;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

// Filter reviews by tab and category
export function filterReviews(
  reviews: ReviewItem[],
  tab: SheetTab | SheetTab[],
  category?: Category
): ReviewItem[] {
  return reviews.filter((item) => {
    const tabMatch = Array.isArray(tab) ? tab.includes(item.tab) : item.tab === tab;
    const categoryMatch = !category || item.category.includes(category);
    return tabMatch && categoryMatch;
  });
}
