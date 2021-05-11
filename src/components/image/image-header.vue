<template>
  <div>
    <el-header class="d-flex align-items-center border-bottom">
      <div class="d-flex mr-auto flex-fill">
        <el-select
        
          v-model="sort"
          placeholder="请选择图片排序方式"
          size="small"
          @change="imageSort"
        >
          <el-option label="升序" value="asc"></el-option>
          <el-option label="降序" value="desc"></el-option>
        </el-select>
        <el-input
          v-model="$image.keyword"
          placeholder="请输入要搜索的图片名"
          size="small"
          class="mx-2 w-50"
        ></el-input>
      </div>
      <el-button type="success" size="small" @click="$emit('create', false)"
        >创建相册</el-button
      >
      <el-button type="primary" size="small" @click="uploadModel = true"
        >上传图片 <i class="el-icon-upload"></i
      ></el-button>
      <el-button
        v-if="$image.chooseList.length"
        type="warning"
        size="small"
        @click="$image.unChoose"
        >取消选中</el-button
      >
      <el-button
        v-if="$image.chooseList.length"
        type="danger"
        size="small"
        @click="delImages"
        >批量删除</el-button
      >
    </el-header>
    <!-- 上传图片 -->
    <el-dialog
      title="上传图片"
      :visible.sync="uploadModel"
      :destroy-on-close="true"
    >
      <div class="text-center">
        <el-upload
          drag
          action="/api/uploadImage"
          multiple
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageHeader',
  inject: ['$image'],
  data() {
    return {
      sort: 'asc',
      uploadModel: false,
      previewModel: false,
      previewUrl: '',
    }
  },
  methods: {
    // 批量删除图片
    delImages() {
      const image = this.$image
      const curAlbum = image.getCurPageAlbum[image.albumIndex]
      this.$confirm('是否删除选中的图片?', {
        type: 'warning',
      })
        .then(() => {
          const albumIdx = image.albumList.findIndex(
            (v) => v.id === curAlbum.id,
          )
          const list = image.imageList.filter((img) => {
            return !image.chooseList.some((c) => c.id === img.id)
          })
          this.$store.commit('image/DELETE_images', {
            albumIdx,
            list,
          })
          // 如果搜索列表有值,则删掉搜索列表里对应的值
          if (image.searchList.length !== 0) {
            const remain = image.searchList.filter((s) => {
              return !image.chooseList.some((c) => s.id === c.id)
            })
            image.searchList = remain
            if (image.searchList.length !== 0) {
              image.page.total = image.searchList.length
            } else {
              image.page.total = list.length
              image.keyword = ''
            }
          } else {
            image.page.total = list.length
          }
          image.imageList = list
          image.chooseList = []
          if (!image.getCurPageImage) {
            const totalPage = Math.ceil(
              image.imageList.length / image.page.size,
            )
            if (totalPage < image.page.current) {
              image.page.current--
            }
          }
        })
        .catch(() => {})
    },
    imageSort(sort) {
       this.$emit('imageSort',sort);
    },
    // 文件上传成功时的钩子, 接收mockjs返回的结果
    uploadSuccess(response, file, fileList) {
      if (response.code !== 20000) {
        return this.$message.error('上传失败!')
      }
      return this.$message.success('模拟上传成功!')
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUpload(file) {
      const isImage = file.type.includes('image')
      if (!isImage) {
        return this.$message.error('上传文件类型必须是图片!')
      }
      const sizeLimit = file.size / 1024 / 1024 < 0.5
      if (!sizeLimit) {
        return this.$message.error('上传图片大小不能超过 500kb!')
      }
      return isImage && sizeLimit
    },
  },
}
</script>

<style scoped>
.w-50,.el-select {
    width: 50%!important;
}
.ml-2, .mx-2 {
    margin-left: .5rem!important;
     margin-right: .5rem!important;
}
</style>
