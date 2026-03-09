/**
 * AI 助手配置
 *
 * 用于配置 AI 模型和相关参数
 */

export const AI_CONFIG = {
  // AI 提供商: 'mock' | 'modelscope' | 'openai' | 'anthropic' | 'local'
  provider: process.env.NEXT_PUBLIC_AI_PROVIDER || 'modelscope',

  // ModelScope 配置
  modelscope: {
    apiKey: process.env.MODELSCOPE_API_KEY,
    baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1',
    model: process.env.MODELSCOPE_CHAT_MODEL || 'Qwen/Qwen3-8B',
    maxTokens: 2000,
    temperature: 0.7,
  },

  // OpenAI 配置
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
  },

  // Anthropic Claude 配置
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    maxTokens: 2000,
    temperature: 0.7,
  },

  // 本地模型配置（Ollama）
  local: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama2',
  },

  // 通用配置
  general: {
    // 最大上下文长度（字符数）
    maxContextLength: 2000,

    // 对话历史保留轮数
    maxHistoryRounds: 6,

    // 请求超时时间（毫秒）
    timeout: 30000,

    // 是否启用流式响应
    enableStreaming: false,
  },

  // 提示词模板
  prompts: {
    system: `你是 EduNexus 知识库的 AI 写作助手。你的任务是帮助用户：
1. 生成文档摘要
2. 扩展和丰富内容
3. 解释概念和术语
4. 改进写作质量和表达
5. 提供写作建议

请基于用户提供的文档内容和问题，给出专业、准确、有帮助的回答。
回答要简洁明了，适合直接插入到文档中。`,

    contextTemplate: (title?: string, content?: string, selectedText?: string) => {
      let context = '';
      if (title) {
        context += `当前文档标题：${title}\n\n`;
      }
      if (content) {
        const preview = content.slice(0, 2000);
        context += `文档内容：\n${preview}\n\n`;
      }
      if (selectedText) {
        context += `用户选中的文本：\n${selectedText}\n\n`;
      }
      return context;
    },
  },
};

/**
 * 获取 AI 配置
 */
export function getAIConfig() {
  return AI_CONFIG;
}

/**
 * 检查 AI 服务是否可用
 */
export function isAIServiceAvailable(): boolean {
  const { provider, modelscope, openai, anthropic } = AI_CONFIG;

  switch (provider) {
    case 'modelscope':
      return !!modelscope.apiKey;
    case 'openai':
      return !!openai.apiKey;
    case 'anthropic':
      return !!anthropic.apiKey;
    case 'local':
      return true; // 假设本地服务总是可用
    case 'mock':
      return true; // 模拟服务总是可用
    default:
      return false;
  }
}

/**
 * 获取当前使用的 AI 模型名称
 */
export function getCurrentModel(): string {
  const { provider, modelscope, openai, anthropic, local } = AI_CONFIG;

  switch (provider) {
    case 'modelscope':
      return modelscope.model;
    case 'openai':
      return openai.model;
    case 'anthropic':
      return anthropic.model;
    case 'local':
      return local.model;
    case 'mock':
      return 'mock-model';
    default:
      return 'unknown';
  }
}
