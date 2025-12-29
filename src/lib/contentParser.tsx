import React from "react";
import { getBasePath } from "@/lib/utils";

/**
 * Parse review content with custom markup
 * Supports: (box), (grid), (high), (bold), (blue), (red), (orange), #tags
 */

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

// Convert image path to webp in public folder
// Matches the structure created by convert-images.mjs
function convertImagePath(imgPath: string): string {
  if (!imgPath) return "";

  let cleanPath = imgPath.replace(/\\/g, "/").replace(/['"]/g, "").trim();

  // Find img/ and convert
  const imgIdx = cleanPath.toLowerCase().indexOf("img/");
  if (imgIdx !== -1) {
    const relativePath = cleanPath.substring(imgIdx + 4);
    const parts = relativePath.split("/");

    if (parts.length < 2) return cleanPath;

    // Get mapped folder name
    const sourceFolder = parts[0];
    const mappedFolder = folderMap[sourceFolder] || sourceFolder.toLowerCase().replace(/\s+/g, '-');

    // Get original filename without extension
    const filename = parts[parts.length - 1];
    const originalName = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "");
    const cleanName = originalName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9가-힣\-_]/g, '');

    // Build output name with subfolder info (like convert-images.mjs)
    let outputName = cleanName;
    if (parts.length > 2) {
      // Include subfolder in filename: tv-blog2037-blog2037-2
      const subFolder = parts.slice(1, -1).join('-').toLowerCase().replace(/\s+/g, '-');
      outputName = `${subFolder}-${cleanName}`;
    }

    return `${getBasePath()}/images/${mappedFolder}/${outputName}.webp`;
  }

  return cleanPath;
}

// Extract images from HTML content - finds ALL images in order
export function extractImagesFromContent(content: string): string[] {
  if (!content) return [];

  const images: string[] = [];
  const seenPaths = new Set<string>();

  // Clean content - remove double quotes wrapping (CSV escaping)
  let cleanedContent = content.replace(/""/g, '"');

  // Strategy: Parse line by line to maintain order
  const lines = cleanedContent.split(/\r?\n|<br>/i);

  for (const line of lines) {
    // Remove surrounding quotes and trim
    let trimmedLine = line.trim().replace(/^["']+|["']+$/g, '');
    if (!trimmedLine) continue;

    // Check for <img> tag in this line
    const imgTagMatch = trimmedLine.match(/<img[^>]+src=['"]([^'"]+)['"][^>]*>/i);
    if (imgTagMatch) {
      const converted = convertImagePath(imgTagMatch[1]);
      if (converted && !seenPaths.has(converted)) {
        seenPaths.add(converted);
        images.push(converted);
      }
      continue;
    }

    // Check for raw image path in this line (with or without quotes)
    // Matches: img/... or "img/... or ""img/...
    const rawPathMatch = trimmedLine.match(/["']*(img\/[^\s"'\n\r<>]+\.(jpg|jpeg|png|gif|webp))["']*/i);
    if (rawPathMatch) {
      const converted = convertImagePath(rawPathMatch[1]);
      if (converted && !seenPaths.has(converted)) {
        seenPaths.add(converted);
        images.push(converted);
      }
      continue;
    }

    // Check if line is just an image path (with extension)
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(trimmedLine)) {
      const converted = convertImagePath(trimmedLine);
      if (converted && !seenPaths.has(converted)) {
        seenPaths.add(converted);
        images.push(converted);
      }
    }
  }

  return images;
}

// Apply inline styles to text
function applyStyles(text: string): string {
  if (!text) return "";

  return text
    // (high)...(high/) - highlight with green background
    .replace(
      /\(high\)(.*?)(\(\/high\)|\(high\/\))/gi,
      '<span class="bg-success/20 text-foreground px-1.5 py-0.5 rounded">$1</span>'
    )
    // (bold)...(bold/) - bold text
    .replace(
      /\(bold\)(.*?)(\(\/bold\)|\(bold\/\))/gi,
      '<strong class="font-bold text-foreground">$1</strong>'
    )
    // (blue)...(blue/) - blue text
    .replace(
      /\(blue\)(.*?)(\(\/blue\)|\(blue\/\))/gi,
      '<span class="text-blue-500 font-semibold">$1</span>'
    )
    // (red)...(red/) - red text
    .replace(
      /\(red\)(.*?)(\(\/red\)|\(red\/\))/gi,
      '<span class="text-red-500 font-semibold">$1</span>'
    )
    // (orange)...(orange/) - orange/accent text
    .replace(
      /\(orange\)(.*?)(\(\/orange\)|\(orange\/\))/gi,
      '<span class="text-accent font-semibold">$1</span>'
    );
}

// Parse content and return React elements
export function parseReviewContent(rawContent: string): React.ReactNode[] {
  if (!rawContent) return [];

  // Decode and clean
  let content = rawContent;
  try {
    content = content.replace(/""/g, '"');
    content = decodeURIComponent(content);
  } catch {
    // ignore decode errors
  }

  const lines = content.split(/\r?\n|<br>/i);
  const elements: React.ReactNode[] = [];
  let inGridMode = false;
  let gridImages: string[] = [];
  let key = 0;

  lines.forEach((line) => {
    line = line.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();

    if (line === "") {
      if (!inGridMode) {
        elements.push(<br key={key++} />);
      }
      return;
    }

    // End grid mode
    if (/(\(\/grid\)|\(grid\/\))/i.test(line)) {
      if (gridImages.length > 0) {
        elements.push(
          <div key={key++} className="grid grid-cols-2 gap-2 my-4">
            {gridImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt=""
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            ))}
          </div>
        );
      }
      inGridMode = false;
      gridImages = [];
      return;
    }

    // Start grid mode
    if (/\(grid\)/i.test(line)) {
      inGridMode = true;
      return;
    }

    // Box element (시술 전/후 등)
    if (/(\(box\)|\(box\/\))/i.test(line)) {
      let boxText = line
        .replace(/\(box\)/gi, "")
        .replace(/\(box\/\)/gi, "")
        .trim();
      boxText = applyStyles(boxText);

      elements.push(
        <div
          key={key++}
          className="my-4 py-3 px-4 bg-primary/10 border border-primary/20 rounded-lg text-center font-semibold text-foreground"
          dangerouslySetInnerHTML={{ __html: boxText }}
        />
      );
      return;
    }

    // Divider
    if (line.includes("------")) {
      elements.push(
        <hr key={key++} className="my-6 border-border" />
      );
      return;
    }

    // Clean line
    const cleanLine = line.replace(/^['"]+|['"]+$/g, "");

    // Check if image
    const isImageTag = cleanLine.toLowerCase().startsWith("<img") || cleanLine.toLowerCase().includes("<img src=");
    const isImagePath = cleanLine.match(/\.(jpg|jpeg|png|gif|webp)$/i) || cleanLine.toLowerCase().startsWith("img/");

    if (isImageTag || isImagePath) {
      let imgSrc = "";

      if (isImageTag) {
        const srcMatch = cleanLine.match(/src=['"]([^'"]+)['"]/i);
        if (srcMatch) {
          imgSrc = convertImagePath(srcMatch[1]);
        }
      } else {
        imgSrc = convertImagePath(cleanLine);
      }

      if (imgSrc) {
        if (inGridMode) {
          gridImages.push(imgSrc);
        } else {
          elements.push(
            <figure key={key++} className="my-4">
              <img
                src={imgSrc}
                alt=""
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </figure>
          );
        }
      }
      return;
    }

    // Title element
    if (/\(title\)/i.test(line)) {
      let titleText = line
        .replace(/\(title\)/gi, "")
        .replace(/\(title\/\)/gi, "")
        .trim();
      titleText = applyStyles(titleText);

      elements.push(
        <h4
          key={key++}
          className="text-lg font-bold text-foreground my-4"
          dangerouslySetInnerHTML={{ __html: titleText }}
        />
      );
      return;
    }

    // Regular paragraph
    const styledLine = applyStyles(cleanLine);

    if (inGridMode) {
      // In grid mode, paragraphs are ignored (only images)
      return;
    }

    elements.push(
      <p
        key={key++}
        className="text-muted-foreground leading-relaxed my-2"
        dangerouslySetInnerHTML={{ __html: styledLine }}
      />
    );
  });

  // Close unclosed grid
  if (inGridMode && gridImages.length > 0) {
    elements.push(
      <div key={key++} className="grid grid-cols-2 gap-2 my-4">
        {gridImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt=""
            className="w-full h-auto rounded-lg"
            loading="lazy"
          />
        ))}
      </div>
    );
  }

  return elements;
}

// Extract hashtags from content
export function extractHashtags(content: string): string[] {
  if (!content) return [];

  const hashtagRegex = /#([가-힣a-zA-Z0-9_]+)/g;
  const tags: string[] = [];
  let match;

  while ((match = hashtagRegex.exec(content)) !== null) {
    tags.push(match[1]);
  }

  return tags;
}
