<template>
  <div class="login-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="login-title">🔐知识图谱管理系统</span>
      </div>
      <div class="login-form">
        <el-form :model="form" :rules="loginRules" ref="loginForm">
          <el-form-item prop="userName">
            <el-input type="text" v-model="form.userName" auto-complete="off" placeholder="请输入用户名">
              <template slot="prepend"><i style="font-size:20px" class="el-icon-user"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input type="text" v-model="form.passWord" auto-complete="off" placeholder="请输入密码">
              <template slot="prepend"><i style="font-size:20px" class="el-icon-key"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%;" type="primary" @click="handleLogin" :loading="loading">登录</el-button>
          </el-form-item>
          <el-button plain @click="open2">右下角</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data(){
    return {
      loading: false,
      form:{
        userName: '',
        passWord: ''
      },
      loginRules:{
        userName: [
          { required: true, message: '请输入账户', trigger: 'blur' },
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    handleLogin(){
      this.$refs.loginForm.validate().then(()=>{
        this.loading = true;

        //模拟异步请求后台接口 登录操作
        setTimeout(()=>{
          this.$router.push('/home');
          this.loading = false;
        }, 1000)
      }).catch((error=>{
        this.$message({
          message: '输入错误！',
          type: 'warning'
        });
      }))
    },
    open2() {
      this.$notify({
        title: '自定义位置',
        message: '右下角弹出的消息',
        position: 'bottom-right'
      });
    },
  }
}
</script>

<style scoped>
.login-page{
  background-image: linear-gradient(180deg, #2af598 0%, #009efd 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.login-title{
  font-size: 20px;
}

.box-card {
  width: 375px;
}

</style>

