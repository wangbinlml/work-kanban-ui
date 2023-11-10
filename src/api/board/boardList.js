import request from '@/utils/request'

// 查询看版列表列表
export function listBoardList(query) {
  return request({
    url: '/board/boardList/list',
    method: 'get',
    params: query
  })
}

// 查询看版列表详细
export function getBoardList(id) {
  return request({
    url: '/board/boardList/' + id,
    method: 'get'
  })
}

// 新增看版列表
export function addBoardList(data) {
  return request({
    url: '/board/boardList',
    method: 'post',
    data: data
  })
}

// 修改看版列表
export function updateBoardList(data) {
  return request({
    url: '/board/boardList',
    method: 'put',
    data: data
  })
}


// 移动看版列表
export function moveBoardList(data) {
  return request({
    url: '/board/boardList/move',
    method: 'put',
    data: data
  })
}

// 删除看版列表
export function delBoardList(id) {
  return request({
    url: '/board/boardList/' + id,
    method: 'delete'
  })
}
