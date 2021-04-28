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

            <el-form-item label="角色" prop="group_id">
              <el-select v-model="temp.group_id" class="filter-item" placeholder="请选择">
                <el-option v-for="item in roles" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="账号" prop="username">
              <el-input v-model="temp.username" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password" clearable placeholder="不修改则留空" />
            </el-form-item>
            <el-form-item label="头像" prop="img">
              <Uploadone v-model="temp.img" :config="config" :header="header" />
            </el-form-item>
            <el-form-item label="姓名" prop="realname">
              <el-input v-model="temp.realname" clearable />
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="temp.phone" clearable />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="temp.email" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="temp.is_enabled">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
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
import Uploadone from '@/components/Upload/singleImage'
import { getListAll } from '@/api/roles'
import { getinfo, save } from '@/api/user'
import { formatImgToArr } from '@/utils'
import { validUsername, validPassword, validPhone, validEmail } from '@/utils/validate'
import myconfig from '@/settings.js'
import { getToken } from '@/utils/auth'

export default {
  name: 'AdminForm',
  components: { Uploadone },
  data() {
    var checkUsername = (rule, value, callback) => {
      if (validUsername(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    var checkPassword = (rule, value, callback) => {
      if (!value || validPassword(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (!value || validPhone(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (!value || validEmail(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    return {
      btnLoading: false,
      roles: {},
      temp: {
        id: 0,
        group_id: '',
        username: '',
        password: '',
        realname: '',
        is_enabled: 1,
        phone: '',
        email: '',
        img: ''
      },
      config: {
        fileName: 'img',
        limit: 1,
        multiple: true,
        accept: 'image/*',
        action: myconfig.uploadUrl.img
      },
      header: {
        'x-access-appid': myconfig.appid,
        'x-access-token': getToken()
      },
      dialogFormVisible: false,
      dialogTitle:'新增用户',
      rules: {
        group_id: [{ required: true, message: '角色必选', trigger: 'change' }],
        username: [{ required: true, message: '账号必填', trigger: 'blur' }, { validator: checkUsername, message: '账号格式是字母，数字，下划线，长度6-18位', trigger: 'blur' }],
        password: [{ validator: checkPassword, message: '密码格式是字母，数字，下划线，长度6-18位', trigger: 'blur' }],
        phone: [{ validator: checkPhone, message: '手机号格式错误', trigger: 'blur' }],
        email: [{ validator: checkEmail, message: '邮箱格式错误', trigger: 'blur' }]
      }

    }
  },
  watch: {
    temp: {
      handler(newVal, oldVal) {},
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getRoles()
  },
  destroyed() {

  },
  methods: {
    getRoles() {
      getListAll().then(response => {
        this.roles = response.data.data
      })
    },
    handleCreate() {
      this.dialogTitle = '新增用户';
      this.temp = {
        id: 0,
        group_id: '',
        username: '',
        password: '',
        realname: '',
        is_enabled: 1,
        phone: '',
        email: '',
        img: ''
      }
      this.$nextTick(() => {
        this.btnLoading = false
        this.dialogFormVisible = true
      })
    },
    async handleUpdate(id) {
      const _this = this
      _this.dialogTitle = '编辑用户'
      const response = await getinfo(id) 
      if (response.status === 1) {
        _this.temp = response.data
      }
      this.$nextTick(() => {
        this.btnLoading = false
        this.dialogFormVisible = true
      })
    },
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          save(this.temp).then(response => {
            _this.btnLoading = false
            if (response.status === 1) {
              if (!_this.temp.id) {
                _this.temp.id = response.data.id
              }
              _this.$message.success(response.msg)
              this.handleClose(1) //新增成功
            } else {
              _this.$message.error(response.msg)
            }
            
          }).catch((error) => {
            _this.$message.error(error)
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
      this.defaultChecked = [];
      this.$refs["dataForm"].resetFields();
      this.dialogFormVisible = false;
      this.$emit("closeDrawerForm", flag);
    },
  }
}
</script>