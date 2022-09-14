<template>
  <div class="login-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="login-title">🔐用户注册</span>
      </div>
      <div class="login-form">
        <el-form :model="form" :rules="loginRules" ref="registerForm">
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
          <el-form-item prop="newPassword">
            <el-input type="text" v-model="form.newPassword" auto-complete="off" placeholder="请再次输入密码">
              <template slot="prepend"><i style="font-size:20px" class="el-icon-key"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%;" type="primary" @click="handleRegister" :loading="loading">注册</el-button>
          </el-form-item>
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
        passWord: '',
        newPassword:'',
      },
      loginRules:{
        userName: [
          { required: true, message: '请输入账户', trigger: 'blur' },
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur'}
        ],
        newPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    handleRegister(){
      this.$refs.registerForm.validate().then(()=>{
        this.loading = true;
        if(this.form.passWord!=this.form.newPassword){
            this.loading=false;
            this.$message({
              message: '两次密码输入不一致',
              type:'warning'
            });
        }
        else{
          axios.post('/api/user/register', {
            username: this.form.userName,
            password: this.form.passWord
          }).then((response)=>{
            this.loading=false;
            //返回正确信息
            if(response.data.status==200){
              console.log(response)
              this.$message({
                message: '注册成功! 3秒后跳转登录界面',
                type:'success'
              });
              setTimeout(() => {
                // 跳转登录界面
                this.$router.push('/login')
              }, 3000);
            }
            else{
              this.$message({
                message: '注册失败！',
                type:'waring'
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        }
      }).catch((error=>{
        this.$message({
          message: '输入错误！',
          type: 'warning'
        });
      }))
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

