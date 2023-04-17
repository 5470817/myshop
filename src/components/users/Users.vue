<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 表格主体 -->
  <el-card class="box-card">
    <!-- 搜索与添加用户 -->
    <div class="mt-4">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="userParams.query"
            placeholder="请输入内容"
            class="input-with-select"
            @keydown.enter="getUserList"
            clearable
            @clear="getUserList"
          >
            <template #append>
              <el-button icon="Search" @click="getUserList" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 用户列表渲染 -->
    <el-table :data="userlist" style="width: 100%" border stripe>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column prop="username" label="姓名" width="180" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="mobile" label="电话" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column label="状态">
        <template #="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <!-- 修改 -->
          <el-button type="primary" icon="Edit" size="small" @click="editUser(scope.row.id)" />
          <!-- 删除 -->
          <el-button type="danger" icon="Delete" size="small" @click="deleteUserById(scope.row.id)" />
          <!-- 分配权限 -->
          <el-tooltip :enterable="false" effect="dark" content="分配权限" placement="top">
            <el-button type="warning" icon="setting" size="small" @click="setRole(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="userParams.pagenum"
        v-model:page-size="userParams.pagesize"
        :page-sizes="[1, 2, 5, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加用户的对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加用户" width="30%" @close="addDialogClose">
      <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserRules" label-width="70px" status-icon>
        <!-- 用户名输入框 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" />
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" />
        </el-form-item>
        <!-- 邮箱输入框 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" />
        </el-form-item>
        <!-- 手机输入框 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser"> 添加 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog v-model="editUserVisible" title="修改用户信息" width="30%" @close="editDialogClose">
      <el-form
        ref="editUserFormRef"
        :model="editUserForm"
        :rules="editUserRules"
        label-width="80px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editUserVisible = false">取消</el-button>
          <el-button type="primary" @click="editUserUpdata"> 修改 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog v-model="settingRightsDialogVisible" title="分配角色" width="30%" @close="resetRoleValue">
      <p>当前用户：{{ userinfo.username }}</p>
      <p>当前角色：{{ userinfo.role_name }}</p>
      <p>
        分配新角色：
        <el-select v-model="selectValue" class="m-2" placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
        </el-select>
      </p>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="settingRightsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateRole"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      // 获取用户列表的参数
      userParams: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [], //获取的用户信息列表
      total: 0, // 分页总数
      addDialogVisible: false, //控制添加用户对话框的显示与隐藏
      editUserVisible: false, //控制编辑用户对话框的显示与隐藏
      settingRightsDialogVisible: false, //控制分配角色对话框的显示与隐藏
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 验证  添加用户表单的规则
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码的长度在6-15个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
              if (!value) {
                return callback(new Error('请输入邮箱'))
              } else if (!emailReg.test(value)) {
                callback(new Error('请输入正确的邮箱'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号' },
          {
            validator: (rule, value, callback) => {
              const mobileReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
              if (!value) {
                return callback(new Error('请输入手机号'))
              } else if (!mobileReg.test(value)) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      //编辑用户信息传递的数据
      editUserForm: {},
      // 验证 编辑用户表单的规则
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
              if (!value) {
                return callback(new Error('请输入邮箱'))
              } else if (!emailReg.test(value)) {
                callback(new Error('请输入正确的邮箱'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号' },
          {
            validator: (rule, value, callback) => {
              const mobileReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
              if (!value) {
                return callback(new Error('请输入手机号'))
              } else if (!mobileReg.test(value)) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      // 需要被分配用户角色的信息
      userinfo: {},
      // 用户角色列表
      roleList: [],
      // 即将更换的新角色
      selectValue: '',
    }
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.userParams })
      if (res.meta.status === 200) {
        this.userlist = res.data.users
        this.total = res.data.total
      } else {
        ElMessage({
          showClose: true,
          message: '获取用户列表失败',
          type: 'error',
        })
      }
    },
    // 监听pagesize改变
    handleSizeChange(newsize) {
      this.userParams.pagesize = newsize
      this.getUserList()
    },
    // 监听页码的变化
    handleCurrentChange(newpage) {
      this.userParams.pagenum = newpage
      this.getUserList()
    },
    // 用户状态切换
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        ElMessage({
          showClose: true,
          message: '切换状态失败',
          type: 'error',
        })
      } else {
        ElMessage({
          message: '切换状态成功',
          type: 'success',
        })
      }
    },
    // 关闭表单时清空表单
    addDialogClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击添加按钮后的操作
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        // 表单没有通过验证就直接 return
        if (!valid) {
          return
        } else {
          // 发起添加用户的请求
          const { data: res } = await this.$http.post('users', this.addUserForm)
          if (res.meta.status !== 201) {
            ElMessage.error(res.meta.msg)
          } else {
            ElMessage({
              message: '添加用户成功',
              type: 'success',
            })
            this.addDialogVisible = false
            this.getUserList()
          }
        }
      })
    },
    // 点击编辑，获取用户信息
    async editUser(id) {
      this.editUserVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        ElMessage.error(res.meta.msg)
      } else {
        this.editUserForm = res.data
      }
    },
    // 编辑用户信息对话框关闭时的处理函数
    editDialogClose() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 提交编辑用户信息
    editUserUpdata() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(`users/` + this.editUserForm.id, this.editUserForm)
          if (res.meta.status !== 200) {
            ElMessage.error('更新用户信息失败')
          } else {
            ElMessage({
              message: '更新用户信息成功',
              type: 'success',
            })
            this.editUserVisible = false
            this.getUserList()
          }
        } else {
          return
        }
      })
    },
    // 删除用户
    deleteUserById(id) {
      ElMessageBox.confirm('此操作将永久删除此用户，确定要继续吗?', '删除用户', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) {
            ElMessage.error('删除该用户失败')
          } else {
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            this.getUserList()
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })
    },
    // 分配权限
    async setRole(userinfo) {
      this.userinfo = userinfo
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return ElMessage.error('获取用户信息失败')
      }
      this.roleList = res.data
      this.settingRightsDialogVisible = true
    },
    // 分配用户角色
    async updateRole() {
      if (!this.selectValue) {
        return ElMessage.error('请选择要分配的用户角色')
      }

      const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, { rid: this.selectValue })
      if (res.meta.status !== 200) {
        return ElMessage.error('分配新角色失败')
      }
      ElMessage.success('更新角色成功')
      this.getUserList()
      this.settingRightsDialogVisible = false
    },
    // 关闭分配新角色的对话框后重置对话框选中的值
    resetRoleValue() {
      this.selectValue = ''
    },
  },
  created() {
    this.getUserList()
  },
}
</script>

<style lang="less" scoped></style>
