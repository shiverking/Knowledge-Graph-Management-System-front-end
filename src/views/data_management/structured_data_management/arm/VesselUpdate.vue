<template>
  <el-form style="width: 60%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="舰船编号">
      <el-input v-model="ruleForm.id" readOnly></el-input>
    </el-form-item>

    <el-form-item label="舰船名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>

<!--    <el-form-item label="图片" prop="picture">-->
<!--      <el-input v-model="ruleForm.picture"></el-input>-->
<!--    </el-form-item>-->

    <el-form-item label="简介" prop="description">
      <el-input v-model="ruleForm.description"></el-input>
    </el-form-item>

    <el-form-item label="制造商" prop="manufacturer">
      <el-input v-model="ruleForm.manufacturer"></el-input>
    </el-form-item>

    <el-form-item label="生产时间" prop="product_date">
      <el-input v-model="ruleForm.product_date"></el-input>
    </el-form-item>

    <el-form-item label="下水时间" prop="launch_time">
      <el-input v-model="ruleForm.launch_time"></el-input>
    </el-form-item>

    <el-form-item label="服役时间" prop="service_time">
      <el-input v-model="ruleForm.service_time"></el-input>
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-input v-model="ruleForm.status"></el-input>
    </el-form-item>

    <el-form-item label="次型" prop="subtype">
      <el-input v-model="ruleForm.subtype"></el-input>
    </el-form-item>

    <el-form-item label="长度" prop="length">
      <el-input v-model="ruleForm.length"></el-input>
    </el-form-item>

    <el-form-item label="宽度" prop="width">
      <el-input v-model="ruleForm.width"></el-input>
    </el-form-item>

    <el-form-item label="载员" prop="crew_num">
      <el-input v-model="ruleForm.crew_num"></el-input>
    </el-form-item>
    <el-form-item label="满载排水量" prop="full_load_displacement">
      <el-input v-model="ruleForm.full_load_displacement"></el-input>
    </el-form-item>
    <el-form-item label="速度" prop="speed">
      <el-input v-model="ruleForm.speed"></el-input>
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
          _this.axios.put('/api/vessel/update',this.ruleForm).then(function(resp){
            if(resp.data == 'success'){
              _this.$alert('《'+_this.ruleForm.name+'》修改成功！', '消息', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/data/structure/arm/vessel')
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
    _this.axios.get('/api/vessel/findById/'+this.$route.query.id).then(function(resp){
      _this.ruleForm = resp.data
    })
  }
}
</script>

