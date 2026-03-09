/**
 * AI 辅助功能模块
 * 提供自动提取关键词、生成摘要、智能推荐等功能
 */

import type { KBDocument } from "@/lib/client/kb-storage";

/**
 * 从文档内容中提取关键词
 */
export function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  // 移除 Markdown 语法
  const cleanContent = content
    .replace(/#{1,6}\s/g, "") // 标题
    .replace(/\*\*(.+?)\*\*/g, "$1") // 粗体
    .replace(/\*(.+?)\*/g, "$1") // 斜体
    .replace(/`(.+?)`/g, "$1") // 代码
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // 链接
    .replace(/\[\[([^\]]+)\]\]/g, "$1") // 双链
    .toLowerCase();

  // 分词（简单实现，按空格和标点分割）
  const words = cleanContent
    .split(/[\s\n\r,.!?;:，。！？；：、]+/)
    .filter((word) => word.length > 1);

  // 统计词频
  const wordFreq = new Map<string, number>();
  words.forEach((word) => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  // 排序并返回前 N 个
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * 从文档内容中提取标签
 */
export function extractTags(content: string): string[] {
  const tagRegex = /#(\w+)/g;
  const tags = new Set<string>();
  let match;

  while ((match = tagRegex.exec(content)) !== null) {
    tags.add(match[1]);
  }

  return Array.from(tags);
}

/**
 * 生成文档摘要（简单实现）
 */
export function generateSummary(content: string, maxLength: number = 200): string {
  // 移除 Markdown 语法
  const cleanContent = content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .trim();

  // 获取前几句话
  const sentences = cleanContent.split(/[。！？\n]+/).filter((s) => s.trim());
  let summary = "";

  for (const sentence of sentences) {
    if (summary.length + sentence.length > maxLength) break;
    summary += sentence + "。";
  }

  return summary || cleanContent.slice(0, maxLength) + "...";
}

/**
 * 计算两个文档的相似度（基于标签和关键词）
 */
export function calculateSimilarity(doc1: KBDocument, doc2: KBDocument): number {
  // 标签相似度
  const commonTags = doc1.tags.filter((tag) => doc2.tags.includes(tag));
  const tagSimilarity = commonTags.length / Math.max(doc1.tags.length, doc2.tags.length, 1);

  // 关键词相似度
  const keywords1 = extractKeywords(doc1.content, 20);
  const keywords2 = extractKeywords(doc2.content, 20);
  const commonKeywords = keywords1.filter((kw) => keywords2.includes(kw));
  const keywordSimilarity =
    commonKeywords.length / Math.max(keywords1.length, keywords2.length, 1);

  // 综合相似度（标签权重 0.6，关键词权重 0.4）
  return tagSimilarity * 0.6 + keywordSimilarity * 0.4;
}

/**
 * 推荐相关文档
 */
export function recommendDocuments(
  currentDoc: KBDocument,
  allDocs: KBDocument[],
  maxRecommendations: number = 5
): KBDocument[] {
  return allDocs
    .filter((doc) => doc.id !== currentDoc.id)
    .map((doc) => ({
      doc,
      similarity: calculateSimilarity(currentDoc, doc),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxRecommendations)
    .filter((item) => item.similarity > 0.1) // 过滤相似度太低的
    .map((item) => item.doc);
}

/**
 * 分析文档统计信息
 */
export function analyzeDocument(content: string) {
  // 字数统计
  const wordCount = content.replace(/\s+/g, "").length;

  // 段落数
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim()).length;

  // 标题数
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;

  // 链接数
  const links = (content.match(/\[\[([^\]]+)\]\]/g) || []).length;

  // 代码块数
  const codeBlocks = (content.match(/```/g) || []).length / 2;

  // 列表项数
  const listItems = (content.match(/^[-*]\s/gm) || []).length;

  // 预计阅读时间（按每分钟 300 字计算）
  const readingTime = Math.ceil(wordCount / 300);

  return {
    wordCount,
    paragraphs,
    headings,
    links,
    codeBlocks,
    listItems,
    readingTime,
  };
}

/**
 * 内容优化建议
 */
export function getContentSuggestions(content: string): string[] {
  const suggestions: string[] = [];
  const stats = analyzeDocument(content);

  // 检查内容长度
  if (stats.wordCount < 100) {
    suggestions.push("内容较短，建议添加更多细节和说明");
  }

  // 检查结构
  if (stats.headings === 0 && stats.wordCount > 200) {
    suggestions.push("建议添加标题来组织内容结构");
  }

  // 检查段落
  if (stats.paragraphs < 2 && stats.wordCount > 300) {
    suggestions.push("建议将内容分成多个段落，提高可读性");
  }

  // 检查标签
  const tags = extractTags(content);
  if (tags.length === 0) {
    suggestions.push("建议添加标签（使用 #标签 格式）以便分类和检索");
  }

  // 检查链接
  if (stats.links === 0 && stats.wordCount > 500) {
    suggestions.push("建议添加相关文档的双链（使用 [[文档名]] 格式）");
  }

  return suggestions;
}

/**
 * 智能标题建议
 */
export function suggestTitle(content: string): string[] {
  const suggestions: string[] = [];

  // 提取第一个标题
  const firstHeading = content.match(/^#\s+(.+)$/m);
  if (firstHeading) {
    suggestions.push(firstHeading[1]);
  }

  // 提取关键词组合
  const keywords = extractKeywords(content, 5);
  if (keywords.length >= 2) {
    suggestions.push(keywords.slice(0, 3).join(" "));
  }

  // 提取第一句话
  const firstSentence = content
    .replace(/^#{1,6}\s/gm, "")
    .split(/[。！？\n]/)[0]
    .trim();
  if (firstSentence && firstSentence.length < 50) {
    suggestions.push(firstSentence);
  }

  return suggestions.filter((s) => s && s.length > 0).slice(0, 3);
}
