/**
 * @file lib/api.js
 * @description API请求辅助函数
 */

const API_BASE = 'http://localhost:3001/api';

/**
 * 通用API请求函数
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    // 检查是否是 JSON 响应
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`服务器返回非 JSON 数据 (${response.status}): 请检查后端服务是否正常运行`);
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API请求失败:', {
      url,
      error: error.message,
      config
    });
    
    // 提供更友好的错误信息
    if (error.message.includes('fetch')) {
      throw new Error('无法连接到后端服务器，请检查服务器是否正常运行');
    }
    
    throw error;
  }
}

/**
 * 翻译文件API
 */
export const translationApi = {
  // 获取所有翻译文件
  async getAll() {
    return apiRequest('/translations');
  },

  // 获取单个翻译文件
  async get(filename) {
    return apiRequest(`/translations/${filename}`);
  },

  // 创建新翻译文件
  async create(domain) {
    return apiRequest('/translations', {
      method: 'POST',
      body: JSON.stringify({ domain })
    });
  },

  // 更新翻译文件
  async update(filename, data) {
    return apiRequest(`/translations/${filename}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // 删除翻译文件
  async delete(filename) {
    return apiRequest(`/translations/${filename}`, {
      method: 'DELETE'
    });
  }
};

/**
 * 检查API
 */
export const checkApi = {
  // 运行单个检查
  async run(checkType) {
    return apiRequest(`/checks/${checkType}`, {
      method: 'POST'
    });
  },

  // 获取检查类型列表
  async getTypes() {
    return apiRequest('/checks/types');
  },

  // 批量运行检查
  async runBatch(checkTypes) {
    return apiRequest('/checks/batch', {
      method: 'POST',
      body: JSON.stringify({ checkTypes })
    });
  }
};

/**
 * 操作API
 */
export const operationApi = {
  // 构建项目
  async build(options = {}) {
    return apiRequest('/operations/build', {
      method: 'POST',
      body: JSON.stringify(options)
    });
  },

  // 排序翻译
  async sort() {
    return apiRequest('/operations/sort', {
      method: 'POST'
    });
  },

  // 获取操作类型列表
  async getTypes() {
    return apiRequest('/operations/types');
  },

  // 批量执行操作
  async runBatch(operations) {
    return apiRequest('/operations/batch', {
      method: 'POST',
      body: JSON.stringify({ operations })
    });
  }
};

/**
 * 帮助API
 */
export const helpApi = {
  // 获取所有帮助内容
  async getAll() {
    return apiRequest('/help');
  },

  // 获取特定部分的帮助内容
  async get(section) {
    return apiRequest(`/help/${section}`);
  },

  // 更新所有帮助内容
  async updateAll(content) {
    return apiRequest('/help', {
      method: 'PUT',
      body: JSON.stringify(content)
    });
  },

  // 更新特定部分的帮助内容
  async update(section, content) {
    return apiRequest(`/help/${section}`, {
      method: 'PUT',
      body: JSON.stringify(content)
    });
  },

  // 上传图片
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiRequest('/help/upload', {
      method: 'POST',
      headers: {}, // 让浏览器自动设置Content-Type
      body: formData
    });
  },

  // 删除图片
  async deleteImage(filename) {
    return apiRequest(`/help/images/${filename}`, {
      method: 'DELETE'
    });
  },

  // 获取图片列表
  async getImages() {
    return apiRequest('/help/images');
  }
};

/**
 * 健康检查
 */
export const healthApi = {
  async check() {
    return apiRequest('/health');
  }
};