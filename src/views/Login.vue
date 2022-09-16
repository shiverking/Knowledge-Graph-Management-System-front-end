<template>
  <div class="login-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="login-title">🔐知识图谱中台</span>
      </div>
      <div class="login-form">
        <el-form :model="form" :rules="loginRules" ref="loginForm">
          <el-form-item prop="username">
            <el-input type="text" v-model="form.username" auto-complete="off" placeholder="请输入用户名">
              <template slot="prepend"><i style="font-size:20px" class="el-icon-user"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="text" v-model="form.password" auto-complete="off" placeholder="请输入密码">
              <template slot="prepend"><i style="font-size:20px" class="el-icon-key"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%;" type="primary" @click="handleLogin" :loading="loading">登录</el-button>
          </el-form-item>
          <el-button plain @click="notify" style="width: 100%">还没有账号？注册</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import store  from "../store";
export default {
  name: 'Login',
  data(){
    return {
      loading: false,
      form:{
        username: '',
        password: ''
      },
      loginRules:{
        username: [
          { required: true, message: '请输入账户', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    handleLogin() {
      this.$refs.loginForm.validate().then(() => {
        this.loading = true;
        axios.post('/api/user/login', this.$qs.stringify({
          username: this.form.username,
          password: this.form.password
        }),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
          this.loading = false;
          //登录成功
          if (response.data.code == 200) {
            const token = response.data.data.token
            const userinfo = response.data.data.userInfo
            store.commit('SET_TOKEN', token)
            store.commit('SET_USERINFO', userinfo)
            // 跳转登录界面
            this.$router.push('/')
          }
          //登录失败
          else {
            this.$message.error({
              message: '用户名或密码错误'
            });
          }
        }).catch(function (error) {
          console.log(error);
        })
      }).catch((error => {
        this.$message({
          message: '请输入正确数据',
          type: 'warning'
        })
      }))
    },
    notify()
    {this.$notify.info({
          title: '注册账户',
          message: '请联系管理员',
          position: 'bottom-right'
        });
      }
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

