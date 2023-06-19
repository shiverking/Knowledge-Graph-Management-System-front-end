<template>
  <div>
    <el-form style="width: 80%" :model="form.plan" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">


      <el-form-item label="计划名称" prop="plan_name">
        <el-input v-model="form.plan.plan_name"></el-input>
      </el-form-item>

      <el-form-item label="开始时间" prop="start_time">
        <el-input v-model="form.plan.start_time"></el-input>
      </el-form-item>

      <el-form-item label="结束时间" prop="end_time">
        <el-input v-model="form.plan.end_time"></el-input>
      </el-form-item>
      <el-form-item label="计划状态" prop="plan_status">
        <el-input v-model="form.plan.plan_status"></el-input>
      </el-form-item>

<!--          <el-form-item label ="计划" prop = "plan_id">-->
<!--            <el-select style="width:500px;" v-model="ruleForm.plan_id" @change="change1" placeholder="请选择">-->
<!--              <el-option-->
<!--                v-for="item in options1"-->
<!--                :label="item.plan_name"-->
<!--                :value="item.id">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label ="指挥官" prop = "person_id">
            <el-select style="width:500px;" v-model="form.person_id"  placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.id"
                :label="item.name_cn"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      <div class="addFormBox">
        <h2>作战任务 </h2>
        <!-- 循环data中定义的数组 -->
        <el-form label-width="80px" ref="formtask">
          <div v-for="(item,index) in form.task" :key="index">
            <div class="formOuterBox">
              <div class="formCotantBox">

                <!-- 表单内容 -->


                <el-col :span="4">
                  <el-form-item label="任务名称" class="form-style">
                    <el-input v-model="item.task_name" class="special-style"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="开始时间" class="form-style">
                    <el-input v-model="item.start_time" class="special-style"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="结束时间" class="form-style">
                    <el-input v-model="item.end_time" class="special-style"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="任务状态" class="form-style">
                    <el-input v-model="item.task_status" class="special-style"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="form-style">
                    <el-button @click="addForm()" type="success">+</el-button>
                    <el-button v-if="index!=0" @click="removeIdx(item, index)" type="danger">-</el-button>
                  </el-form-item>
                </el-col>


              </div>
              <!-- 操作按钮 -->
              <!--          <div>-->
              <!--            <el-button @click="addForm" type="success">+</el-button>-->
              <!--            <el-button v-if="index!=0" @click="removeIdx(item, index)" type="danger">-</el-button>-->
              <!--          </div>-->
            </div>
          </div>
        </el-form>
      </div>

      <div>
        <el-button type="primary" @click="submitForm1('ruleForm')" >提交</el-button>
      </div>

      <!--      <el-button type="primary" @click="submitForm1('ruleForm')" style='position: absolute;right:750px;'>提交</el-button>-->
      <!--      <el-button @click="resetForm('ruleForm')"></el-button>-->


    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form:{
        person_id:null,
        task:[{}],
        plan:{},
      },

      options1:[],
      options2:[],

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
    //   添加操作
    addForm() {
      // 定义一个标识，通过标识判断是否能添加信息

      this.form.task.push({
        start_time: "",
        end_time: "",
        task_name: "",
        task_status: "",
      });

    },
    // 删除操作
    removeIdx(item, index) {
      this.form.task.splice(index, 1);
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },

    // change1(){
    //   const _this = this
    //   axios.get('/api/findByPlanid/'+this.ruleForm.plan_id).then(function(resp){
    //     _this.options2 = resp.data
    //   })
    // },
    submitForm1(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post('/api/plan/save',this.form).then(function(resp){
            _this.$alert('《' + _this.form.plan.plan_name + '》添加成功！', '消息', {
              confirmButtonText: '确定',
              callback: action => {
                _this.$router.push('/data/structure/plan/plan')
              }
            })
          })
        }
        else {
          return false;
        }
      });


    },
    // submitForm2(formName) {
    //   const _this = this
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       axios.post('/api/task/saves',this.formtask).then(function(resp){
    //
    //       })
    //     }
    //     else {
    //       return false;
    //     }
    //   })
    //   axios.get('/api/person/saveplanid/'+this.person_id).then(function(resp){
    //     _this.$alert('《' + _this.ruleForm.plan_name + '》添加成功！', '消息', {
    //       confirmButtonText: '确定',
    //       callback: action => {
    //         _this.$router.push('/plan')
    //       }
    //     })
    //   })
    //
    // },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    const _this = this
    _this.axios.get('/api/person/findAll').then(function(resp){
      _this.options1 = resp.data
    })
  }
}
</script>

