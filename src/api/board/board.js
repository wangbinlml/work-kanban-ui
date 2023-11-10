import request from '@/utils/request'

// 查询看版管理列表
export function listBoard(query) {
  return request({
    url: '/board/board/list',
    method: 'get',
    params: query
  })
}

// 查询看版管理列表
export function userStarBoardList(query) {
  return request({
    url: '/board/board/userStarBoardList',
    method: 'get',
    params: query
  })
}
// 查询看版管理列表
export function userJoinBoardList(query) {
  return request({
    url: '/board/board/userJoinBoardList',
    method: 'get',
    params: query
  })
}

// 查询看版管理详细
export function getBoard(id) {
  return request({
    url: '/board/board/' + id,
    method: 'get'
  })
}

// 新增看版管理
export function addBoard(data) {
  return request({
    url: '/board/board',
    method: 'post',
    data: data
  })
}

// 修改看版管理
export function updateBoard(data) {
  return request({
    url: '/board/board',
    method: 'put',
    data: data
  })
}

// 删除看版管理
export function delBoard(id) {
  return request({
    url: '/board/board/' + id,
    method: 'delete'
  })
}
