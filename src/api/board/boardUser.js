import request from '@/utils/request'

// 查询看版人员关系列表
export function listBoardUser(query) {
  return request({
    url: '/board/boardUser/list',
    method: 'get',
    params: query
  })
}

// 查询看版人员关系列表
export function queryUserList(query) {
  return request({
    url: '/board/boardUser/queryUserList',
    method: 'get',
    params: query
  })
}

// 查询看版人员关系详细
export function getBoardUser(id) {
  return request({
    url: '/board/boardUser/' + id,
    method: 'get'
  })
}

// 新增看版人员关系
export function addBoardUser(data) {
  return request({
    url: '/board/boardUser',
    method: 'post',
    data: data
  })
}

// 修改看版人员关系
export function updateBoardUser(data) {
  return request({
    url: '/board/boardUser',
    method: 'put',
    data: data
  })
}

// 删除看版人员关系
export function delBoardUser(id) {
  return request({
    url: '/board/boardUser/' + id,
    method: 'delete'
  })
}
