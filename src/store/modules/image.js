import { getAlbums, getImages } from '@/api/image'

export default {
  namespaced: true,
  state: {
    albumList: [],
    sort: 'asc',
  },
  mutations: {
    // 设置相册列表
    SET_albumList(state, value) {
      state.albumList = value
    },
    // 更新相册列表
    UPDATE_albumList(state, { id, value }) {
      state.albumList.some((v) => {
        if (v.id === id) {
          Object.assign(v, value)
        }
      })
    },
    // 删除当前相册
    DELETE_albumList(state, index) {
      state.albumList.splice(index, 1)
    },
    // 设置当前相册的图片列表
    SET_curAlbumImageList(state, { id, value }) {
      state.albumList.some((v) => {
        if (v.id === id) {
          v.imageList = value
        }
      })
    },
    // 修改图片名称
    UPDATE_imageName(state, { albumIdx, imgId, value }) {
      state.albumList[albumIdx].imageList.some((v) => {
        if (v.id === imgId) {
          v.name =
            value.trim() + v.name.slice(v.name.indexOf('.'), v.name.length)
        }
      })
    },
    // 删除单张图片
    DELETE_image(state, { albumIdx, index }) {
      state.albumList[albumIdx].imageList.splice(index, 1)
      state.albumList[albumIdx].imagesCount--
    },
    // 批量删除图片
    DELETE_images(state, { albumIdx, list }) {
      state.albumList[albumIdx].imageList = list
      state.albumList[albumIdx].imagesCount = list.length
    },
    // 设置排序
    SET_sort(state, value) {
      state.sort = value
    },
    // 更新图片排序
    SORT_imageList(state) {
      if (state.sort === 'asc') {
        state.albumList.forEach((item) => {
          item.imageList.sort((a, b) => {
            return a.id - b.id
          })
        })
      } else {
        state.albumList.forEach((item) => {
          item.imageList.sort((a, b) => {
            return b.id - a.id
          })
        })
      }
    },
  },
  actions: {
    // 获取相册列表
    getAlbums({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        getAlbums()
          .then((response) => {
            const { data } = response
         
            commit('SET_albumList', data.albumList)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取图片列表
    getImages({ commit, state, rootState }, id) {
      return new Promise((resolve, reject) => {
        getImages({ token: '', id })
          .then((response) => {
            const { data } = response
            commit('SET_curAlbumImageList', { id, value: data.imageList })
            commit('SORT_imageList', state.sort)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
}
