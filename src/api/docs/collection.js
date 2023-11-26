import request from '@/utils/request'

// 查询文件收藏列表
export function listCollection(query) {
  return request({
    url: '/docs/collection/list',
    method: 'get',
    params: query
  })
}

// 查询文件收藏详细
export function getCollection(id) {
  return request({
    url: '/docs/collection/' + id,
    method: 'get'
  })
}

// 新增文件收藏
export function addCollection(data) {
  return request({
    url: '/docs/collection',
    method: 'post',
    data: data
  })
}

// 修改文件收藏
export function updateCollection(data) {
  return request({
    url: '/docs/collection',
    method: 'put',
    data: data
  })
}

// 删除文件收藏
export function delCollection(id) {
  return request({
    url: '/docs/collection/' + id,
    method: 'delete'
  })
}
