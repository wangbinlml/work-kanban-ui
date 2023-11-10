import request from '@/utils/request'

// 查询卡片附件关系列表
export function listCardAttachment(query) {
  return request({
    url: '/board/cardAttachment/list',
    method: 'get',
    params: query
  })
}

// 查询卡片附件关系详细
export function getCardAttachment(id) {
  return request({
    url: '/board/cardAttachment/' + id,
    method: 'get'
  })
}

// 新增卡片附件关系
export function addCardAttachment(data) {
  return request({
    url: '/board/cardAttachment',
    method: 'post',
    data: data
  })
}

// 修改卡片附件关系
export function updateCardAttachment(data) {
  return request({
    url: '/board/cardAttachment',
    method: 'put',
    data: data
  })
}

// 删除卡片附件关系
export function delCardAttachment(id) {
  return request({
    url: '/board/cardAttachment/' + id,
    method: 'delete'
  })
}
