import request from '@/utils/request'

// 查询文档下拉树结构
export function docsTreeSelect() {
  return request({
    url: '/docs/file/docsTree',
    method: 'get'
  })
}

// 查询文档列表
export function listFile(query) {
  return request({
    url: '/docs/file/list',
    method: 'get',
    params: query
  })
}


// 查询文档目录列表
export function listFileDir(query) {
  return request({
    url: '/docs/file/dir',
    method: 'get',
    params: query
  })
}

// 查询文档详细
export function getFile(id) {
  return request({
    url: '/docs/file/' + id,
    method: 'get'
  })
}

// 新增文档
export function addFile(data) {
  return request({
    url: '/docs/file',
    method: 'post',
    data: data
  })
}

// 修改文档
export function updateFile(data) {
  return request({
    url: '/docs/file',
    method: 'put',
    data: data
  })
}

// 删除文档
export function delFile(id) {
  return request({
    url: '/docs/file/' + id,
    method: 'delete'
  })
}
