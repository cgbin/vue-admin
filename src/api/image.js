import request from '@/utils/request'

function getAlbums(query = {}) {
  return request({
    url: '/admin/image/getalbums',
    method: 'post',
    data: query,
  })
}

function getImages(query = {}) {
  return request({
    url: '/admin/image/getimages',
    method: 'post',
    data: query,
  })
}

function uploadImage(data = {}) {
  return request({
    url: '/admin/image/uploadimage',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

export { getAlbums, getImages, uploadImage }
