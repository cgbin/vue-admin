<template>
  <div>
    <el-dialog
      title="选择图片"
      :visible.sync="chooseImageModel"
      width="80vw"
      top="5vh"
      @close="hide"
    >
      <el-container
        class="position-relative"
        style="height: 70vh;margin: -30px -20px;"
      >
        <el-header class="d-flex align-items-center border-bottom">
          <div class="d-flex mr-auto">
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
              v-model="keyword"
              placeholder="请输入要搜索的图片名"
              size="small"
              class="mx-2"
            ></el-input>
          </div>
          <el-button
            v-if="chooseList.length"
            type="warning"
            size="small"
            @click="unChoose"
            >取消选中</el-button
          >
        </el-header>
        <el-container>
          <el-aside
            width="200px"
            style="top: 60px; bottom: 60px"
            class="bg-white border-right position-absolute"
          >
            <!-- 相册列表 -->
            <ul class="list-group list-group-flush">
              <album-item
                v-for="(album, index) in getCurPageAlbum"
                :key="index"
                :album="album"
                :index="index"
                :active="albumIndex === index"
                :showOptions="false"
              ></album-item>
            </ul>
          </el-aside>
          <el-container
            class="position-absolute"
            style="top: 60px; left: 200px; right: 0; bottom: 60px"
          >
            <el-main>
              <!-- 图片列表 -->
              <el-row :gutter="15">
                <image-item
                  v-for="(image, index) in getCurPageImage"
                  :key="index"
                  :index="index"
                  :image="image"
                ></image-item>
              </el-row>
            </el-main>
          </el-container>
        </el-container>
        <el-footer class="border d-flex align-items-center px-0">
          <!-- 相册分页 -->
          <el-aside width="200px" class="album-pagination">
            <el-pagination
              layout="prev, next"
              :page-size="album.size"
              :total="album.total"
              class="d-flex align-items-center justify-content-center"
              @current-change="albumPageChange"
            >
            </el-pagination>
          </el-aside>
          <!-- 图片分页 -->
          <div class="text-center flex-fill">
            <el-pagination
              :current-page="page.current"
              :page-sizes="page.sizes"
              :page-size="page.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
              @size-change="pageSizeChange"
              @current-change="curPageChange"
            ></el-pagination>
          </div>
        </el-footer>
      </el-container>
      <span slot="footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
      :visible.sync="previewModel"
      top="5vh"
      :show-close="false"
      :destroy-on-close="true"
      append-to-body
    >
      <div style="margin: -60px -20px -30px">
        <img :src="previewUrl" class="w-100" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import albumItem from '@/components/image/album-item'
import imageItem from '@/components/image/image-item'
import { mapState } from 'vuex'
export default {
  name: 'chooseImage',
  provide() {
    return {
      $image: this,
    }
  },
  components: {
    albumItem,
    imageItem,
  },
  props: {
    max: { type: Number, default: 9 },
  },
  data() {
    return {
      page: {
        current: 1,
        sizes: [10, 20, 50],
        size: 10,
        total: 0,
      },
      album: {
        current: 1,
        size: 5,
        total: 0,
      },
      albumIndex: 0,
      sort: 'asc',
      previewModel: false,
      previewUrl: '',
      keyword: '',
      chooseList: [],
      searchList: [],
      imageList: [],
      chooseImageModel: false,
      callback: false,
    }
  },
  computed: {
    ...mapState({
      albumList: (state) => state.image.albumList,
    }),
    // 图片分页处理和搜索结果
    getCurPageImage: {
      get() {
        const curData = []
        // 如果有搜索结果或输入框有值,则取searchList的值,否则取imageList的值
        const dataList =
          this.searchList.length || this.keyword
            ? this.searchList
            : this.imageList
        const totalPage = Math.ceil(dataList.length / this.page.size)
        for (let index = 0; index < totalPage; index++) {
          curData[index] = dataList.slice(
            this.page.size * index,
            this.page.size * (index + 1),
          )
        }
        return curData[this.page.current - 1]
      },
      set(value) {
        let searchList = this.imageList
        const str = value.trim()
        if (str) {
          searchList = searchList.filter((v) => {
            if (v.name.indexOf(str) !== -1) {
              return v
            }
          })
        }
        // 如果搜索结果有值,则取searchList的值,否则为空数组
        this.searchList = searchList.length ? searchList : []
        if (this.searchList.length === this.imageList.length) {
          this.searchList = []
        }
        this.page.current = 1
        this.page.total = searchList.length
        this.unChoose()
      },
    },
    // 相册分页处理
    getCurPageAlbum() {
      const albumShow = []
      const totalPage = Math.ceil(this.albumList.length / this.album.size)
      for (let index = 0; index < totalPage; index++) {
        albumShow[index] = this.albumList.slice(
          this.album.size * index,
          this.album.size * (index + 1),
        )
      }
      return albumShow[this.album.current - 1]
    },
  },
  watch: {
    keyword(value) {
      this.getCurPageImage = value
    },
  },
  mounted() {
    this.$on('view', (image) => {
      this.previewUrl = image.url
      this.previewModel = true
    })
  },
  methods: {
    // 页面数据初始化
    __init() {
      // vuex中没有数据
      if (!this.albumList.length) {
        this.$store.dispatch('image/getAlbums').then(async (res) => {
          this.album.total = this.albumList.length
          const { imageList } = await this.$store.dispatch(
            'image/getImages',
            this.albumList[0].id,
          )
          this.imageList = imageList
          this.page.total = imageList.length
        })
      } else {
        // vuex中有数据
        this.album.total = this.albumList.length
        this.imageList = this.albumList[0].imageList
        this.page.total = this.imageList.length
      }
    },
    imageSort(sort) {
      this.$store.commit('image/SET_sort', sort)
      this.$store.commit('image/SORT_imageList')
    },
    showDialog(callback) {
      this.__init()
      this.callback = callback
      this.keyword = ''
      // this.searchList = []
      this.albumIndex = 0
      this.chooseImageModel = true
    },
    hide() {
      this.unChoose()
      this.chooseImageModel = false
    },
    confirm() {
      if (typeof this.callback === 'function' && this.chooseList.length) {
        this.callback(this.chooseList)
      }
      this.hide()
    },
    // 取消选中的图片
    unChoose() {
      this.imageList.forEach((img) => (img.isCheck = false))
      this.chooseList = []
    },
    // 获取图片列表
    getImageList() {
      const curAlbum = this.getCurPageAlbum[this.albumIndex]
      // 如果当前相册的图片列表为空,则发起请求
      if (curAlbum.imageList.length === 0) {
        this.$store
          .dispatch('image/getImages', curAlbum.id)
          .then((response) => {
            const { imageList } = response
            this.imageList = imageList
            this.page.total = imageList.length
          })
      } else {
        // 否则从vuex获取数据
        this.imageList = curAlbum.imageList
        this.page.total = this.imageList.length
      }
    },
    // 切换相册页码
    albumPageChange(val) {
      this.keyword = ''
      this.album.current = val
      this.albumIndex = 0
      this.page.current = 1
      this.getImageList()
      this.unChoose()
    },
    // 切换每页显示条数
    pageSizeChange(val) {
      this.page.size = val
    },
    // 改变页数
    curPageChange(val) {
      this.page.current = val
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.position-relative{
  position: relative;
}
.position-absolute{
  position: absolute;
}

.list-group {
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
}
dl, ol, ul {
    margin-top: 0;
    margin-bottom: 1rem;
}
.list-group-flush .list-group-item:first-child {
    border-top-width: 0;
}

aside{
  background: none;
  padding: none; 
  margin-bottom: none; 
  line-height: auto !important;
  font-size: auto !important;
}

.border {
    border: 0.5px solid #dee2e6!important;
}
.border-right {
    border-right: 1px solid #dee2e6;
}

.w-100{
  width: 100%;
}
.d-flex {
    display: flex;
}
.ml-2,.mx-2{
    margin-left: .5rem;
}
.el-dialog__header {
     border-bottom: none; 
}
.align-items-center {
    align-items: center;
}
.border-bottom {
    border-bottom: 1px solid #dee2e6;
}
.mr-auto {
    margin-right: auto;
}
// 分页
.pl-0, .px-0 {
    padding-left: 0!important;
}
.album-pagination {
    height: 60px;
}
.album-pagination .el-pagination {
    height: 100%;
}
.justify-content-center {
    justify-content: center;
}
.album-pagination .el-pagination .btn-prev {
    padding-right: 20px;
}
.album-pagination .el-pagination .btn-next {
    padding-left: 20px;
}
.album-pagination .el-pagination {
  .btn-prev,.btn-next {
    .el-icon {
      font-size: 20px;
    }
  }
}

.text-center {
    text-align: center!important;
}
.flex-fill {
    -ms-flex: 1 1 auto!important;
    flex: 1 1 auto!important;
}

// 滚动条美化s
::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
}
::-webkit-scrollbar-thumb {
    cursor: pointer;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.25);
    -webkit-transition: color 0.2s ease;
    transition: color 0.2s ease;
}
</style>
