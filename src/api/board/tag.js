import request from '@/utils/request'

// 查询卡片标签关系列表
export function listTag(query) {
  return request({
    url: '/board/tag/list',
    method: 'get',
    params: query
  })
}

// 查询卡片标签关系详细
export function getTag(id) {
  return request({
    url: '/board/tag/' + id,
    method: 'get'
  })
}

// 新增卡片标签关系
export function addTag(data) {
  return request({
    url: '/board/tag',
    method: 'post',
    data: data
  })
}

// 修改卡片标签关系
export function updateTag(data) {
  return request({
    url: '/board/tag',
    method: 'put',
    data: data
  })
}

// 删除卡片标签关系
export function delTag(id) {
  return request({
    url: '/board/tag/' + id,
    method: 'delete'
  })
}
