import request from '@/utils/request'

// 查询卡片人员关系列表
export function listCardUser(query) {
  return request({
    url: '/board/cardUser/list',
    method: 'get',
    params: query
  })
}
// 查询卡片人员关系列表
export function cardUserList(query) {
  return request({
    url: '/board/cardUser/userList',
    method: 'get',
    params: query
  })
}

// 查询卡片人员关系详细
export function getCardUser(id) {
  return request({
    url: '/board/cardUser/' + id,
    method: 'get'
  })
}

// 新增卡片人员关系
export function addCardUser(data) {
  return request({
    url: '/board/cardUser',
    method: 'post',
    data: data
  })
}

// 修改卡片人员关系
export function updateCardUser(data) {
  return request({
    url: '/board/cardUser',
    method: 'put',
    data: data
  })
}
// 修改卡片人员关系
export function batchUpdateCardUser(data) {
  return request({
    url: '/board/cardUser/batchUpdateCardUser',
    method: 'put',
    data: data
  })
}

// 删除卡片人员关系
export function delCardUser(id) {
  return request({
    url: '/board/cardUser/' + id,
    method: 'delete'
  })
}
