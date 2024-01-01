import request from '@/utils/request'

// 查询工作空间人员关系列表
export function listWorkspaceUser(query) {
  return request({
    url: '/board/workspaceUser/list',
    method: 'get',
    params: query
  })
}

// 查询工作空间人员关系列表
export function queryWorkspaceList(query) {
  return request({
    url: '/board/workspaceUser/queryUserList',
    method: 'get',
    params: query
  })
}

// 查询工作空间人员关系详细
export function getWorkspaceUser(id) {
  return request({
    url: '/board/workspaceUser/' + id,
    method: 'get'
  })
}

// 新增工作空间人员关系
export function addWorkspaceUser(data) {
  return request({
    url: '/board/workspaceUser',
    method: 'post',
    data: data
  })
}

// 修改工作空间人员关系
export function updateWorkspaceUser(data) {
  return request({
    url: '/board/workspaceUser',
    method: 'put',
    data: data
  })
}

// 删除工作空间人员关系
export function delWorkspaceUser(id) {
  return request({
    url: '/board/workspaceUser/' + id,
    method: 'delete'
  })
}
