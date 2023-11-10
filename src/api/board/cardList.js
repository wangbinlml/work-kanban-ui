import request from '@/utils/request'

// 查询卡片清单关系列表
export function listCardList(query) {
  return request({
    url: '/board/cardList/list',
    method: 'get',
    params: query
  })
}

// 查询卡片清单关系详细
export function getCardList(id) {
  return request({
    url: '/board/cardList/' + id,
    method: 'get'
  })
}

// 新增卡片清单关系
export function addCardList(data) {
  return request({
    url: '/board/cardList',
    method: 'post',
    data: data
  })
}

// 修改卡片清单关系
export function updateCardList(data) {
  return request({
    url: '/board/cardList',
    method: 'put',
    data: data
  })
}

// 修改卡片清单关系
export function checkCardList(data) {
  return request({
    url: '/board/cardList/check',
    method: 'put',
    data: data
  })
}

// 移动卡片清单
export function moveTaskList(data) {
  return request({
    url: '/board/cardList/moveTaskList',
    method: 'put',
    data: data
  })
}

// 删除卡片清单关系
export function delCardList(id) {
  return request({
    url: '/board/cardList/' + id,
    method: 'delete'
  })
}
