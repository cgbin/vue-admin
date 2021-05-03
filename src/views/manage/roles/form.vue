<template>
  <el-dialog
    v-if="dialogFormVisible"
    :title="dialogTitle"
    ref="drawer"
    width="380px"
    @close="handleClose(0)"
    :visible.sync="dialogFormVisible"
  >
    <div class="demo-dialog__content">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px">
            
            <el-form-item label="名称" prop="title">
              <el-input v-model="temp.title" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="temp.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="权限">
             <el-scrollbar style="height: 39vh;" wrap-class="tree-scrollbar-wrapper"> 
              <el-tree
                ref="tree"
                :data="treeData"
                :default-checked-keys="defaultChecked"
                :props="defaultProps"
                default-expand-all
                show-checkbox   
                node-key="id"
              />
             </el-scrollbar>
            </el-form-item>
      </el-form>
    </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handleClose(0)">取 消</el-button>
        <el-button size="medium" :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
      </div>
  </el-dialog>
</template>

<script>
import { getListAll } from '@/api/rules'
import { getinfo, save } from '@/api/roles'
import treeUtil from '@/utils/tree'

export default {
  name: 'RolesForm',
  data() {
    return {
      btnLoading: false,
      treeData:[],
      temp: {
        id: 0,
        title: '',
        status: 1,
        rules: ''
      },
      dialogFormVisible: false,
      dialogTitle:'新增角色',
      rules: {
        title: [{ required: true, message: '名称必填', trigger: 'blur' }]
      },
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }

    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    //不在此调用获取权限列表是由于 handleUpdate()的方法有时会比 getRules 先执行，导致 this.treeData 的值为空
    // this.getRules()
  },
  destroyed() {
  },
  methods: {
    async getRules() {
      const response_tree = await getListAll();
      this.treeData = response_tree.data.data
    },
    //获取选中的节点数据
    getChecked() {
      return new Promise(resolve => {
          const CheckedKeys= [ 
          //获取全选数据
          ...this.$refs.tree.getCheckedKeys(),
          //获取半选数据
          ...this.$refs.tree.getHalfCheckedKeys(),
          ];
          if(CheckedKeys.length === 0){
            resolve('')
          }else{
            resolve(CheckedKeys.join(','))
          }
      })
    },
    handleCreate() {
      this.dialogTitle = '新增角色'
      this.temp = {
        id: 0,
        title: '',
        status: 1,
        rules: ''
      }
      this.getRules()
      this.$nextTick(() => {
        this.btnLoading = false
        this.dialogFormVisible = true
      })
    },
    async handleUpdate(id) {
      this.dialogTitle = '编辑角色'
      await this.getRules()
      const response = await getinfo(id);
      this.temp = response.data 
      //设置已选中的数据
      await treeUtil.getRoleAuthListData(this.treeData,this.temp.rules.split(','), this.defaultChecked)
      
      this.$nextTick(() => {
        this.btnLoading = false
        this.dialogFormVisible = true
      })
    },
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
            try{
                this.temp.rules = await this.getChecked() //获取选中的节点
                const _this = this
                const d = _this.temp
                const response = await save(d)
                _this.btnLoading = false
                if (response.status === 1) {
                  if (!d.id) {
                    d.id = response.data.id
                  }
                  _this.$message.success(response.msg)
                  _this.handleClose(1) //新增成功
                } else {
                  _this.$message.error(response.msg)
                }
            }catch(error){
              // catch 的 error错误信息使用 error.message 打印
              this.btnLoading = false
            }

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
      this.defaultChecked = [];
      this.$refs["dataForm"].resetFields();
      this.dialogFormVisible = false;
      this.$emit("closeDrawerForm", flag);
    },
  }
}
</script>

<style scoped>

</style>