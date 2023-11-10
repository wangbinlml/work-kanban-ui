import request from '@/utils/request'

// 查询卡片活动关系列表
export function listCardActivity(query) {
  return request({
    url: '/board/cardActivity/list',
    method: 'get',
    params: query
  })
}

// 查询卡片活动关系详细
export function getCardActivity(id) {
  return request({
    url: '/board/cardActivity/' + id,
    method: 'get'
  })
}

// 新增卡片活动关系
export function addCardActivity(data) {
  return request({
    url: '/board/cardActivity',
    method: 'post',
    data: data
  })
}

// 修改卡片活动关系
export function updateCardActivity(data) {
  return request({
    url: '/board/cardActivity',
    method: 'put',
    data: data
  })
}

// 删除卡片活动关系
export function delCardActivity(id) {
  return request({
    url: '/board/cardActivity/' + id,
    method: 'delete'
  })
}
