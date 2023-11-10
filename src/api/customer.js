import request from '@/utils/request'

// 查询客户信息列表
export function listCustomer(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/user',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/user/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/user/avatar',
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}
