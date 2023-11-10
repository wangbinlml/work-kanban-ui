import request from '@/utils/request'

// 查询看版管理列表
export function listBoardViewRecord(query) {
  return request({
    url: '/board/boardViewRecord/list',
    method: 'get',
    params: query
  })
}

