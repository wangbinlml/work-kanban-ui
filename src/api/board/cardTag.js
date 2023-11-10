import request from '@/utils/request'

// 查询卡片标签关系列表
export function listCardTag(query) {
  return request({
    url: '/board/cardTag/list',
    method: 'get',
    params: query
  })
}

// 查询卡片标签关系详细
export function getCardTag(id) {
  return request({
    url: '/board/cardTag/' + id,
    method: 'get'
  })
}

// 新增卡片标签关系
export function addCardTag(data) {
  return request({
    url: '/board/cardTag',
    method: 'post',
    data: data
  })
}

// 新增卡片标签关系
export function cardBindTags(data) {
  return request({
    url: '/board/cardTag/cardBindTags',
    method: 'post',
    data: data
  })
}

// 修改卡片标签关系
export function updateCardTag(data) {
  return request({
    url: '/board/cardTag',
    method: 'put',
    data: data
  })
}

// 删除卡片标签关系
export function delCardTag(id) {
  return request({
    url: '/board/cardTag/' + id,
    method: 'delete'
  })
}
