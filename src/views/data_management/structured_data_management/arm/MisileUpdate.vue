<template>
  <el-form style="width: 60%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="导弹编号">
      <el-input v-model="ruleForm.id" readOnly></el-input>
    </el-form-item>

    <el-form-item label="导弹名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>

    <el-form-item label="图片" prop="picture">
      <el-input v-model="ruleForm.picture"></el-input>
    </el-form-item>

    <el-form-item label="简介" prop="description">
      <el-input v-model="ruleForm.description"></el-input>
    </el-form-item>

    <el-form-item label="研发公司" prop="rd_company">
      <el-input v-model="ruleForm.rd_company"></el-input>
    </el-form-item>

    <el-form-item label="长度" prop="bomb_length">
      <el-input v-model="ruleForm.bomb_length"></el-input>
    </el-form-item>

    <el-form-item label="重量" prop="bomb_weight">
      <el-input v-model="ruleForm.bomb_weight"></el-input>
    </el-form-item>

    <el-form-item label="翼展" prop="winspan">
      <el-input v-model="ruleForm.winspan"></el-input>
    </el-form-item>
    <el-form-item label="制导系统" prop="guidance_system">
      <el-input v-model="ruleForm.guidance_system"></el-input>
    </el-form-item>
    <el-form-item label="最快速度" prop="max_speed">
      <el-input v-model="ruleForm.max_speed"></el-input>
    </el-form-item>
    <el-form-item label="射程" prop="scope">
      <el-input v-model="ruleForm.scope"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-input v-model="ruleForm.type"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        id: '',
        name: '',
        author: ''
      },
      rules: {
        name: [
          { required: true, message: '飞机名称不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.put('/api/misile/update',this.ruleForm).then(function(resp){
            if(resp.data == 'success'){
              _this.$alert('《'+_this.ruleForm.name+'》修改成功！', '消息', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/misile')
                }
              })
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    const _this = this
    axios.get('/api/misile/findById/'+this.$route.query.id).then(function(resp){
      _this.ruleForm = resp.data
    })
  }
}
</script>
