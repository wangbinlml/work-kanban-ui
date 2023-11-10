import request from '@/utils/request'

// 查询卡片列表
export function listCard(query) {
  return request({
    url: '/board/card/list',
    method: 'get',
    params: query
  })
}

// 查询卡片详细
export function getCard(id) {
  return request({
    url: '/board/card/' + id,
    method: 'get'
  })
}

// 新增卡片
export function addCard(data) {
  return request({
    url: '/board/card',
    method: 'post',
    data: data
  })
}

// 修改卡片
export function updateCard(data) {
  return request({
    url: '/board/card',
    method: 'put',
    data: data
  })
}

// 移动卡片到别的board中
export function moveCard(data) {
  return request({
    url: '/board/card/moveCard',
    method: 'put',
    data: data
  })
}
// 移动卡片同一个board中
export function orderCard(data) {
  return request({
    url: '/board/card/orderCard',
    method: 'put',
    data: data
  })
}

// 删除卡片
export function delCard(id) {
  return request({
    url: '/board/card/' + id,
    method: 'delete'
  })
}
