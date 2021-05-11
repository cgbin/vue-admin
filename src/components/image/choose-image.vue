<template>
  <div>
    <el-dialog
      v-if="chooseImageModel"
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
      <image-header
        ref="imageHeader"
        :chooseList="chooseList"
        @create="openAlbumModel"
        @imageSort="imageSort"
      ></image-header>

        <el-container>
          <el-aside
            width="200px"
            style="top: 60px; bottom: 60px"
            class="bg-white border-right position-absolute"
          >
            <!-- 相册列表 -->
            <ul class="list-group list-group-flush">
              <album-item
                v-for="(album, index) in albumList"
                :key="index"
                :album="album"
                :index="index"
                :active="albumIndex === index"
                :showOptions="true"
                @update="openAlbumModel"
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

    <!-- 创建 | 修改相册 -->
    <el-dialog
      :title="albumEditIndex > -1 ? '修改相册' : '创建相册'"
      :visible.sync="albumModel"
      :destroy-on-close="true"
      @close="closeAlbumModel"
    >
      <el-form :model="albumForm" :rules="formRules" label-width="80px">
        <el-form-item label="相册名称" prop="name">
          <el-input
            v-model="albumForm.name"
            size="medium"
            placeholder="请输入相册名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="相册排序">
          <el-input-number
            v-model="albumForm.order"
            :min="0"
            size="medium"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="albumModel = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="albumForm.name === ''"
          @click="confirmAlbumModel"
          >确 定</el-button
        >
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getAlbums, getImages } from '@/api/image'
import imageHeader from '@/components/image/image-header'
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
    imageHeader
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
      albumList:[],//相册列表
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
      // 相册表单数据
      albumModel: false,
      albumForm: {
        id: 0,
        name: '',
        order: 0,
        imagesCount: 0,
        imageList: [],
      },
      formRules: {
        name: [
          { required: true, message: '相册名称不能为空', trigger: 'blur' },
        ],
      },
      albumIndex: 0,
      albumEditIndex:-1
    }
  },
  computed: {
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
  },
  watch: {
    keyword(value) {
      this.getCurPageImage = value
    },
  },
  created(){
    this.getCurPageAlbum();
    this.getImageList();
  },
  mounted() {
    this.$on('view', (image) => {
      this.previewUrl = image.url
      this.previewModel = true
    })
  },
  methods: {
    // 请求相册列表
    getCurPageAlbum() {
        getAlbums(this.album)
          .then((response) => {
            const { data } = response
            this.albumList = data.albumList
            this.album.total = data.total
          })
          .catch((error) => {})
    },
     // 获取图片列表
    getImageList() {
       getImages(this.page)
          .then((response) => {
            const { data } = response
            this.imageList = data.imageList
            this.page.total = data.total
          })
          .catch((error) => {})
    },
    //图片排序
    imageSort(sort) {
     if (sort === 'asc') {
          this.imageList.sort((a, b) => {
            return a.id - b.id
          })
      } else {
          this.imageList.sort((a, b) => {
            return b.id - a.id
          })
      }
    },
    showDialog(callback) {
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
        // 编辑相册
    updateAlbum() {
      const curAlbum = this.getCurPageAlbum[this.albumEditIndex]
      const bol =
        curAlbum.name !== this.albumForm.name ||
        curAlbum.order !== this.albumForm.order
      // 相册名或排序有更改的情况下才执行
      if (bol) {
        this.$store.commit('image/UPDATE_albumList', {
          id: this.albumForm.id,
          value: this.albumForm,
        })
        this.$message({
          message: '修改成功',
          type: 'success',
        })
      }
      this.closeAlbumModel()
    },
    // 打开模态框
    openAlbumModel(obj) {
      // 修改相册
      if (obj) {
        const { album, index } = obj
        this.albumForm = { ...album }
        this.albumEditIndex = index
        return (this.albumModel = true)
      }
      // 创建相册
      this.albumForm = {
        id: this.albumList.length + 1,
        name: '',
        order: 50,
        imagesCount: 0,
        imageList: [],
      }
      this.albumEditIndex = -1
      this.albumModel = true
    },
    // 确认模态框数据
    confirmAlbumModel() {
      if (this.albumForm.name !== '') {
        // 判断是否为修改
        if (this.albumEditIndex > -1) {
          return this.updateAlbum()
        }
        // 创建相册
        this.albumList.unshift({ ...this.albumForm })
        this.$store
          .dispatch('image/getImages', this.albumForm.id)
          .then((response) => {
            const { imageList } = response
            this.albumList[0].imageList = imageList
            this.albumList[0].imagesCount = imageList.length
            this.$store.commit('image/SET_albumList', this.albumList)
          })
        this.albumIndex++
        this.album.total = this.albumList.length
        if (this.albumIndex === this.getCurPageAlbum.length) {
          this.albumPageChange(++this.album.current)
        }
      }
      this.closeAlbumModel()
    },
    // 关闭模态框
    closeAlbumModel() {
      this.albumForm = {
        id: 0,
        name: '',
        order: 0,
        imagesCount: 0,
        imageList: [],
      }
      this.albumModel = false
    },
    // 取消选中的图片
    unChoose() {
      this.imageList.forEach((img) => (img.isCheck = false))
      this.chooseList = []
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
  background:#fff ;
  padding:0px; 
  margin-bottom:0px; 
  line-height:20px;
  font-size: 14px;
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
.ml-2, .mx-2 {
    margin-left: .5rem!important;
}

.w-50 {
    width: 50%!important;
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
