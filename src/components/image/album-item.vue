<template>
  <div>
    <li
      class="list-group-item list-group-item-action d-flex align-items-center"
      :class="{ 'album-active': active }"
      style="cursor: pointer"
      @click.stop="chooseAlbum(index)"
    >
      <el-badge :value="album.imagesCount" class="p-1 album-badge" type="primary">
        <span>{{ album.name }}</span>
      </el-badge>
      <el-dropdown
        v-if="showOptions"
        class="ml-auto"
        trigger="click"
        placement="bottom"
      >
        <button class="btn btn-link text-body">
          <i class="el-icon-arrow-down"></i>
        </button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.stop.native="$emit('update', { album, index })"
            >修改</el-dropdown-item
          >
          <el-dropdown-item @click.stop.native="delAlbum(index)"
            >删除</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </li>
  </div>
</template>

<script>
export default {
  name: 'AlbumItem',
  inject: ['$image'],
  props: {
    album: Object,
    index: Number,
    active: { type: Boolean, default: false },
    showOptions: { type: Boolean, default: true },
  },
  methods: {
    // 选择相册
    chooseAlbum(index) {
      const image = this.$image
      if (image.albumIndex === index) return
      image.keyword = ''
      image.albumIndex = index
      image.page.current = 1
      image.getImageList()
      image.unChoose()
    },
    // 删除相册
    delAlbum(index) {
      const image = this.$image
      this.$confirm('是否删除该相册?', {
        type: 'warning',
      })
        .then(() => {
          const id = image.getCurPageAlbum[index].id
          const delIndex = image.albumList.findIndex((v) => v.id === id)
          if (delIndex === -1) return
          // index不等于0
          if (index !== 0) {
            image.albumIndex--
            this.$store.commit('image/DELETE_albumList', delIndex)
            image.getImageList()
          } else {
            // index等于0且相册数量大于1
            if (image.getCurPageAlbum.length > 1) {
              this.$store.commit('image/DELETE_albumList', delIndex)
              image.getImageList()
            } else if (image.getCurPageAlbum.length === 1) {
              // 删除最后一个相册的时候
              this.$store.commit('image/DELETE_albumList', delIndex)
              image.page.total = 0
              image.imageList = []
            }
          }
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          image.album.total = image.albumList.length
          if (!image.getCurPageAlbum && image.album.current > 1) {
            image.albumPageChange(--image.album.current)
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.position-relative{
  position: relative;
}
.position-absolute{
  position: absolute;
}
// 相册菜单栏
.bg-white {
    background-color: #fff;
}

.list-group-flush .list-group-item {
    border-right-width: 0;
    border-left-width: 0;
    border-radius: 0;
    
}

.list-group-item {
    position: relative;
    display: block;
    padding: .75rem 1.25rem;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.125);
}
.list-group-flush:last-child .list-group-item:last-child {
    border-bottom-width: 0;
}
.list-group-flush .list-group-item:first-child {
    border-top-width: 0;
}
.list-group-item-action {
    width: 100%;
    color: #495057;
    text-align: inherit;
}
.p-1 {
    padding: .25rem;
}
.album-active{
    color: #67c23a ;
    background-color: #f0f9eb ;
    border-color: #c2e7b0 ;
}
.album-badge{
  right: 5px;
}

// 修改
.ml-auto, .mx-auto {
    float: right;
}
.text-body {
    color: #212529!important;
}
.btn-link {
    font-weight: 400;
    color: #007bff;
    text-decoration: none;
}
.btn {
    display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
</style>
