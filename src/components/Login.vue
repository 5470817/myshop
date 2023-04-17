<template>
  <div class="login">
    <div class="container">
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" label-width="80" :rules="rules" ref="loginFormRef" @submit="onSubmit">
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名">
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" type="password" />
        </el-form-item>

        <!-- 提交 重置 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="preSubmit">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: { username: 'admin', password: '123456' },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度3-10', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度6-16', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 表单预校验
    preSubmit() {
      this.$refs.loginFormRef.validate(async val => {
        if (!val) return
        if (val) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            ElMessage.error('登录失败')
          } else {
            ElMessage({
              message: '登录成功',
              type: 'success',
            })
            localStorage.setItem('token', res.data.token)
            setTimeout(() => {
              this.$router.push('/home')
            }, 2000)
          }
        }
      })
    },
    // 提交登录表单，发起登录请求
    onSubmit() {
      console.log(11)
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    // height: 300px;
    padding: 30px 0;
    background-color: #fff;
    overflow: hidden;
    .el-form {
      padding: 20px;
      .btn {
        width: 100%;
        margin-left: 250px;
      }
    }
  }
}
</style>
