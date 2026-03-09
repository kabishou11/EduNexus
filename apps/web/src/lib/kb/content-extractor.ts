/**
 * 内容提取器 - 从笔记内容提取标签、关键词和引用
 */

/**
 * 提取 Markdown 标签 (#tag)
 */
export function extractTags(content: string): string[] {
  const tagRegex = /#([^\s#]+)/g;
  const matches = content.matchAll(tagRegex);
  const tags = Array.from(matches, (m) => m[1]);
  return [...new Set(tags)];
}

/**
 * 提取双链引用 [[reference]]
 */
export function extractWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  const matches = content.matchAll(wikiLinkRegex);
  const links = Array.from(matches, (m) => m[1]);
  return [...new Set(links)];
}

/**
 * 提取代码块
 */
export function extractCodeBlocks(content: string): Array<{ language: string; code: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const matches = content.matchAll(codeBlockRegex);
  return Array.from(matches, (m) => ({
    language: m[1] || 'text',
    code: m[2].trim(),
  }));
}

/**
 * 提取数学公式
 */
export function extractMathFormulas(content: string): string[] {
  const mathRegex = /\$\$([^\$]+)\$\$/g;
  const matches = content.matchAll(mathRegex);
  return Array.from(matches, (m) => m[1].trim());
}

/**
 * 提取关键词 (简单 TF-IDF 实现)
 */
export function extractKeywords(
  content: string,
  maxKeywords: number = 10
): string[] {
  // 移除代码块和公式，避免干扰
  let cleanContent = content.replace(/```[\s\S]*?```/g, '');
  cleanContent = cleanContent.replace(/\$\$[\s\S]*?\$\$/g, '');

  // 分词 - 支持中英文
  const words = cleanContent
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  // 停用词列表（简化版）
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一',
    '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有',
    '看', '好', '自己', '这', '那', '里', '就是', '可以', '什么', '如果',
  ]);

  // 过滤停用词
  const filteredWords = words.filter((w) => !stopWords.has(w));

  // 计算词频
  const freq = new Map<string, number>();
  filteredWords.forEach((word) => {
    freq.set(word, (freq.get(word) || 0) + 1);
  });

  // 排序并返回前 N 个
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * 提取标题层级结构
 */
export function extractHeadings(content: string): Array<{ level: number; text: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const matches = content.matchAll(headingRegex);
  return Array.from(matches, (m) => ({
    level: m[1].length,
    text: m[2].trim(),
  }));
}

/**
 * 提取所有链接
 */
export function extractLinks(content: string): Array<{ text: string; url: string }> {
  const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const matches = content.matchAll(linkRegex);
  return Array.from(matches, (m) => ({
    text: m[1],
    url: m[2],
  }));
}

/**
 * 综合提取 - 一次性提取所有内容
 */
export interface ExtractedContent {
  tags: string[];
  wikiLinks: string[];
  keywords: string[];
  codeBlocks: Array<{ language: string; code: string }>;
  mathFormulas: string[];
  headings: Array<{ level: number; text: string }>;
  links: Array<{ text: string; url: string }>;
  wordCount: number;
  characterCount: number;
}

export function extractAll(content: string): ExtractedContent {
  return {
    tags: extractTags(content),
    wikiLinks: extractWikiLinks(content),
    keywords: extractKeywords(content),
    codeBlocks: extractCodeBlocks(content),
    mathFormulas: extractMathFormulas(content),
    headings: extractHeadings(content),
    links: extractLinks(content),
    wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
    characterCount: content.length,
  };
}

/**
 * 计算内容相似度（简单的 Jaccard 相似度）
 */
export function calculateSimilarity(content1: string, content2: string): number {
  const keywords1 = new Set(extractKeywords(content1, 20));
  const keywords2 = new Set(extractKeywords(content2, 20));

  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}
