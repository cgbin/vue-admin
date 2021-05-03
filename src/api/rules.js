import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/admin/rules/index',
    method: 'post',
    data: query
  })
}

export function getListAll(query) {
  return request({
    url: '/admin/rules/getlists',
    method: 'post',
    data:query
  })
}

export function getinfo(id) {
  return request({
    url: '/admin/rules/getinfo',
    method: 'post',
    data: { id }
  })
}

export function save(data) {
  return request({
    url: data.id > 0? '/admin/rules/edit' :'/admin/rules/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/admin/rules/del',
    method: 'post',
    data: { id }
  })
}

export function change(id, field, value) {
  const data = {
    val: id,
    field: field,
    value: value
  }
  return request({
    url: '/admin/rules/change',
    method: 'post',
    data
  })
}

export function delAll(data) {
  return request({
    url: '/admin/rules/delall',
    method: 'post',
    data
  })
}

export function changeAll(data) {
  return request({
    url: '/admin/rules/changeall',
    method: 'post',
    data
  })
}
