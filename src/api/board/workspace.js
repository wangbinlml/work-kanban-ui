import request from '@/utils/request'

// 查询工作区列表
export function listWorkspace(query) {
  return request({
    url: '/board/workspace/list',
    method: 'get',
    params: query
  })
}

// 查询工作区详细
export function getWorkspace(id) {
  return request({
    url: '/board/workspace/' + id,
    method: 'get'
  })
}

// 新增工作区
export function addWorkspace(data) {
  return request({
    url: '/board/workspace',
    method: 'post',
    data: data
  })
}

// 修改工作区
export function updateWorkspace(data) {
  return request({
    url: '/board/workspace',
    method: 'put',
    data: data
  })
}

// 删除工作区
export function delWorkspace(id) {
  return request({
    url: '/board/workspace/' + id,
    method: 'delete'
  })
}
