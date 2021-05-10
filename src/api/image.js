import request from '@/utils/request'

function getAlbums(data = {}) {
  return request({
    url: '/admin/image/getalbums',
    method: 'post',
    data,
  })
}

function getImages(data = {}) {
  return request({
    url: '/admin/image/getimages',
    method: 'post',
    data,
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
