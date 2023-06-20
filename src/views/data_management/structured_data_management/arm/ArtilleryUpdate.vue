<template>
  <el-form style="width: 60%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="火炮编号">
      <el-input v-model="ruleForm.id" readOnly></el-input>
    </el-form-item>

    <el-form-item label="火炮名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="国家" prop="country">
      <el-input v-model="ruleForm.country"></el-input>
    </el-form-item>
<!--    <el-form-item label="图片" prop="picture">-->
<!--      <el-input v-model="ruleForm.picture"></el-input>-->
<!--    </el-form-item>-->

    <el-form-item label="简介" prop="description">
      <el-input v-model="ruleForm.description"></el-input>
    </el-form-item>

    <el-form-item label="研发公司" prop="rd_company">
      <el-input v-model="ruleForm.rd_company"></el-input>
    </el-form-item>

    <el-form-item label="研发时间" prop="product_date">
      <el-input v-model="ruleForm.product_date"></el-input>
    </el-form-item>

    <el-form-item label="长度" prop="length">
      <el-input v-model="ruleForm.length"></el-input>
    </el-form-item>

    <el-form-item label="重量" prop="weight">
      <el-input v-model="ruleForm.weight"></el-input>
    </el-form-item>

    <el-form-item label="口径" prop="diameter">
      <el-input v-model="ruleForm.diameter"></el-input>
    </el-form-item>

    <el-form-item label="炮管长度" prop="barrel_length">
      <el-input v-model="ruleForm.barrel_length"></el-input>
    </el-form-item>

    <el-form-item label="炮口初速" prop="muzzle_velocity">
      <el-input v-model="ruleForm.muzzle_velocity"></el-input>
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
          _this.axios.put('/api/artillery/update',this.ruleForm).then(function(resp){
            if(resp.data == 'success'){
              _this.$alert('《'+_this.ruleForm.name+'》修改成功！', '消息', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.$router.push('/data/structure/arm/artillery')
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
    _this.axios.get('/api/artillery/findById/'+this.$route.query.id).then(function(resp){
      _this.ruleForm = resp.data
    })
  }
}
</script>

