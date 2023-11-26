import request from '@/utils/request'

// 查询文件模版列表
export function listTag(query) {
  return request({
    url: '/docs/tag/list',
    method: 'get',
    params: query
  })
}

// 查询文件模版详细
export function getTag(id) {
  return request({
    url: '/docs/tag/' + id,
    method: 'get'
  })
}

// 新增文件模版
export function addTag(data) {
  return request({
    url: '/docs/tag',
    method: 'post',
    data: data
  })
}

// 修改文件模版
export function updateTag(data) {
  return request({
    url: '/docs/tag',
    method: 'put',
    data: data
  })
}

// 删除文件模版
export function delTag(id) {
  return request({
    url: '/docs/tag/' + id,
    method: 'delete'
  })
}
