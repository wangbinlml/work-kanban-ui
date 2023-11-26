import request from '@/utils/request'

// 查询文件模版列表
export function listTemplate(query) {
  return request({
    url: '/docs/template/list',
    method: 'get',
    params: query
  })
}

// 查询文件模版详细
export function getTemplate(id) {
  return request({
    url: '/docs/template/' + id,
    method: 'get'
  })
}

// 新增文件模版
export function addTemplate(data) {
  return request({
    url: '/docs/template',
    method: 'post',
    data: data
  })
}

// 修改文件模版
export function updateTemplate(data) {
  return request({
    url: '/docs/template',
    method: 'put',
    data: data
  })
}

// 删除文件模版
export function delTemplate(id) {
  return request({
    url: '/docs/template/' + id,
    method: 'delete'
  })
}
