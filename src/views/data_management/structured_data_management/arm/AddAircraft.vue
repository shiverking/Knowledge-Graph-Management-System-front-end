<template>
    <el-form style="width: 60%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">


      <el-form-item label="飞机名称" prop="aircraft_name">
        <el-input v-model="ruleForm.aircraft_name"></el-input>
      </el-form-item>

      <el-form-item label="图片" prop="picture">
        <el-input v-model="ruleForm.picture"></el-input>
      </el-form-item>

      <el-form-item label="简介" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="首飞时间" prop="fist_flight">
        <el-input v-model="ruleForm.fist_flight"></el-input>
      </el-form-item>

      <el-form-item label="研发公司" prop="rd_company">
        <el-input v-model="ruleForm.rd_company"></el-input>
      </el-form-item>

      <el-form-item label="引擎数量" prop="engines_num">
        <el-input v-model="ruleForm.engines_num"></el-input>
      </el-form-item>

      <el-form-item label="载员" prop="crew_num">
        <el-input v-model="ruleForm.crew_num"></el-input>
      </el-form-item>

      <el-form-item label="长度" prop="length">
        <el-input v-model="ruleForm.length"></el-input>
      </el-form-item>

      <el-form-item label="翼展" prop="winspan">
        <el-input v-model="ruleForm.winspan"></el-input>
      </el-form-item>

      <el-form-item label="高度" prop="height">
        <el-input v-model="ruleForm.height"></el-input>
      </el-form-item>

      <el-form-item label="引擎" prop="engine">
        <el-input v-model="ruleForm.engine"></el-input>
      </el-form-item>

      <el-form-item label="最快速度" prop="max_speed">
        <el-input v-model="ruleForm.max_speed"></el-input>
      </el-form-item>

      <el-form-item label="空重" prop="empty_wgt">
        <el-input v-model="ruleForm.empty_wgt"></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-input v-model="ruleForm.type"></el-input>
      </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

    </el-form>
</template>

<script>
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    author: ''
                },
                rules: {
                    name: [
                        { required: true, message: '图书名称不能为空', trigger: 'blur' }
                    ],
                    author:[
                        { required: true, message: '作者不能为空', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                const _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      _this.axios.post('/api/aircraft/save',this.ruleForm).then(function(resp){
                            if(resp.data == 'success'){
                                _this.$alert('《'+_this.ruleForm.aircraft_name+'》添加成功！', '消息', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        _this.$router.push('/data/structure/arm/Aircraft')
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
        }
    }
</script>

