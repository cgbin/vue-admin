import request from '@/utils/request'

// /获取相册列表和分页
export function getAlbums(query = {}) {
  return request({
    url: '/admin/image_album/index',
    method: 'post',
    data: query,
  })
}

//新增相册
export function addAlbums(data  = {}) {
  return request({
    url: '/admin/image_album/save',
    method: 'post',
    data,
  })
}

// 修改相册
export function editAlbums(data  = {}) {
  return request({
    url: '/admin/image_album/edit',
    method: 'post',
    data,
  })
}

//删除相册
export function delAlbums(id) {
  return request({
    url: '/admin/image_album/del',
    method: 'post',
    data: { id }
  })
}

export function getImages(query = {}) {
  return request({
    url: '/admin/image/getimages',
    method: 'post',
    data: query,
  })
}

export function uploadImage(data = {}) {
  return request({
    url: '/admin/image/uploadimage',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}