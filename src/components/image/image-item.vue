<template>
  <div>
    <el-col :span="24" :xl="3" :lg="4" :md="6" :sm="8" :xs="24">
      <el-card
        :body-style="{ padding: '0' }"
        class="mb-2 position-relative"
        shadow="hover"
      >
        <div class="border" :class="{ 'border-success': image.isCheck }">
          <span
            v-if="image.isCheck"
            class="badge badge-success position-absolute"
            style="right: 0;top: 0"
          >
            <i class="el-icon-check"></i>
          </span>
          <img
            :src="image.url"
            class="w-100"
            style="height: 100px;cursor: pointer;"
            @click="chooseImage(image)"
          />
          <div
            style="background-color: rgba(0,0,0,.5);margin-top: -25px;"
            class="w-100 text-white position-absolute px-1"
          >
            <span class="small">{{
              image.name.slice(0, image.name.indexOf('.'))
            }}</span>
          </div>
          <div class="p-1 text-center">
            <el-button-group>
              <el-button
                class="p-2"
                size="mini"
                icon="el-icon-view"
                type="success"
                @click="$image.$emit('view', image)"
              ></el-button>
              <el-button
                class="p-2"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="updateImage(image)"
              ></el-button>
              <el-popconfirm
                title="是否删除该图片？"
                @onConfirm="delImage(image)"
              >
                <el-button
                  slot="reference"
                  class="p-2"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm>
            </el-button-group>
          </div>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'ImageItem',
  inject: ['$image'],
  props: {
    image: Object,
    index: Number,
  },
  methods: {
    // 修改图片名称
    updateImage(image) {
      this.$prompt('', '请输入图片名称', {
        inputPlaceholder: '请输入图片名称',
        inputValue: image.name.slice(0, image.name.indexOf('.')),
        inputValidator(value) {
          if (value === '') {
            return '图片名称不能为空'
          }
        },
      })
        .then(({ value }) => {
          this.$store.commit('image/UPDATE_imageName', {
            albumIdx: this.$image.albumIndex,
            imgId: image.id,
            value,
          })
          this.$message({
            message: '修改成功',
            type: 'success',
          })
        })
        .catch(() => {})
    },
    // 选择图片
    chooseImage(img) {
      const image = this.$image
      // 之前没选中
      if (!img.isCheck) {
        if (image.chooseList.length >= image.max) {
          return this.$message({
            message: '最多选择' + image.max + '张图片',
            type: 'warning',
          })
        }
        image.chooseList.push({ ...img })
        img.isCheck = true
        return
      }
      // 之前是选中状态
      const index = image.chooseList.findIndex((v) => v.id === img.id)
      if (index !== -1) {
        img.isCheck = false
        image.chooseList.splice(index, 1)
      }
    },
    // 删除单张图片
    delImage(img) {
      const image = this.$image
      const curAlbum = image.getCurPageAlbum[image.albumIndex]
      const albumIdx = image.albumList.findIndex((v) => v.id === curAlbum.id)
      const index = image.imageList.findIndex((v) => v.id === img.id)
      if (index !== -1) {
        this.$store.commit('image/DELETE_image', {
          albumIdx,
          index,
        })
        // 如果搜索列表有值,则删掉搜索列表里对应的值
        if (image.searchList.length !== 0) {
          const i = image.searchList.findIndex((v) => v.id === img.id)
          image.searchList.splice(i, 1)
          if (image.searchList.length !== 0) {
            image.page.total = image.searchList.length
          } else {
            image.page.total = image.imageList.length
            image.keyword = ''
          }
        } else {
          image.page.total = image.imageList.length
        }
        if (!image.getCurPageImage) {
          const totalPage = Math.ceil(image.imageList.length / image.page.size)
          if (totalPage < image.page.current) {
            image.page.current--
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped >

.position-relative{
  position: relative;
}
.position-absolute{
  position: absolute;
}
.border {
    border: 0.5px solid #dee2e6;
}
.border-success {
    border-color: #28a745!important;
}
.badge-success{
  background-color: #67C23A;
  color: #fff;
}
img {
    vertical-align: middle;
    border-style: none;
}
.text-center {
    text-align: center;
}

.p-1 {
    padding: .25rem;
}
.w-100{
  width: 100%;
}
.text-white{
  color: #fff;
}
.pl-1, .px-1 {
    padding-left: .25rem;
}

.pr-1, .px-1 {
    padding-right: .25rem;
}
</style>
