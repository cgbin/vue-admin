<template>
  <el-drawer
    v-if="dialogFormVisible"
    :title="dialogTitle"
    ref="drawer"
    with-header
    size="50%"
    @close="handleClose(0)"
    :visible.sync="dialogFormVisible"
    direction="rtl"
    custom-class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; padding:10px; height: 100vh;overflow-y: scroll;">

        
            <el-form-item label="上级" prop="pid">
              <el-cascader v-model="pid" :options="getRulesList" :props="props_pid"  filterable placeholder="请选择"  @change="handleChange" />
            </el-form-item>
            <el-form-item label="名称" prop="title">
              <el-input v-model="temp.title" clearable />
            </el-form-item>
            <el-form-item label="标识" prop="name">
              <el-input v-model="temp.name" clearable />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="temp.icon" clearable />
            </el-form-item>
            <el-form-item label="路径" prop="path">
              <el-input v-model="temp.path" clearable />
            </el-form-item>
            <el-form-item label="组件" prop="component">
              <el-input v-model="temp.component" clearable />
            </el-form-item>
            <el-form-item label="跳转" prop="redirect">
              <el-input v-model="temp.redirect" clearable />
            </el-form-item>           
             <el-form-item label="类型">
              <el-radio-group v-model="temp.ptype">
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="temp.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="隐藏">
              <el-radio-group v-model="temp.hidden">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="缓存">
              <el-radio-group v-model="temp.no_cache">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="根路由">
              <el-radio-group v-model="temp.always_show">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
      </el-form>
      <div class="demo-drawer__footer" style="position:fixed;top:15px;right:30px;">
        <el-button size="mini" @click="handleClose(0)">取 消</el-button>
        <el-button size="mini" :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { getinfo, save } from '@/api/rules'
import tree from '@/utils/tree'
export default {
  name: 'RulesForm',
  components: {},
  props: {
    ruleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      btnLoading: false,
      ruleTop: [{ 'id': 0, 'title': '顶级' }],
      pid: [],
      props_pid: { 
        label: 'title', 
        value: 'id' , 
        expandTrigger: 'hover', 
        children:'children',  
        checkStrictly:true, //取消父子关联，可选子节点
      },
      temp: {
        id: 0,
        pid: 0,
        title: '',
        name: '',
        status: 1,
        icon: '',
        path: '',
        component: 'layout',
        hidden: 0,
        no_cache: 1,
        always_show: 1,
        redirect: '',
        ptype:1, //类型， 1菜单，2按钮
      },
      dialogFormVisible: false,
      dialogTitle:'新增权限',
      rules: {
        title: [{ required: true, message: '名称必填', trigger: 'blur' }],
        name: [{ required: true, message: '标识必填', trigger: 'blur' }],
        icon: [{ required: true, message: '图标必填', trigger: 'blur' }],
        path: [{ required: true, message: '路径必填', trigger: 'blur' }],
        component: [{ required: true, message: '组件必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    getRulesList() {
      return this.ruleTop.concat(tree.listToTreeMulti(this.ruleList))
    }
  },
  watch: {
    // dialogFormVisible: function() {
    //   this.resetTemp()
    // },
    temp: {
      handler(newVal, oldVal) {},
      immediate: true,
      deep: true
    }
  },
  created() {
     
  },
  mounted(){

  },
  destroyed() {
  },
  methods: {
    handleCreate() {
      this.dialogTitle = '新增权限'
      this.temp = {
        id: 0,
        pid: 0,
        title: '',
        name: '',
        status: 1,
        icon: '',
        path: '',
        component: 'layout',
        hidden: 0,
        no_cache: 1,
        always_show: 1,
        redirect: '',
        ptype:1, //类型， 1菜单，2按钮
      }
      this.currentIndex = -1
      this.pid = []
      this.$nextTick(() => {
        this.btnLoading = false
        this.dialogFormVisible = true;
      })
    },
    //编辑权限
    async handleUpdate(id) {
      const _this = this
      _this.dialogTitle = '编辑权限'
      _this.pid = [];
      const response  = await getinfo(id)
      if (response.status === 1) {
         _this.temp = response.data
         if(response.data.pid > 0){
            //获取父级栏目的id数组
            tree.getParentsId(_this.ruleList, id , _this.pid)
         }else{
            _this.pid = [0];
         }
        
      }
      this.$nextTick(() => {
        this.btnLoading = false
        this.dialogFormVisible = true;
      })
    
    },
    //保存数据
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          const d = this.temp
          save(d).then(response => {
            if (response.status === 1) {
              if (!d.id) {
                d.id2 = response.data.id
              }
              this.$message.success(response.msg)
              this.handleClose(1) //新增成功
            } else {
              this.$message.error(response.msg)
            }
             this.btnLoading = false
          // eslint-disable-next-line handle-callback-err
          }).catch((error) => {
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
        }
      })
    },
    handleClose(flag) {
      if (this.btnLoading) {
        return
      }
      //关闭并重置表单
      this.$refs["dataForm"].resetFields();
      this.dialogFormVisible = false;
      this.$emit("closeDrawerForm", flag);
    },
    //处理选项的改变
    handleChange(value) {
      if (value.length) {
        this.temp.pid = value[value.length - 1]
      }
    }
  }
}
</script>