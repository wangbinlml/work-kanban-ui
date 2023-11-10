import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
  return request({
    url: '/config/list',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getConfig(configId) {
  return request({
    url: '/config/' + configId,
    method: 'get'
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/config/configKey/' + configKey,
    method: 'get'
  })
}

