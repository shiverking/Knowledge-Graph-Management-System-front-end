<template>
  <el-form style="width: 80%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="人员编号">
      <el-input v-model="ruleForm.id" readOnly></el-input>
    </el-form-item>
    <el-form-item label="计划名称" prop="plan_name">
      <el-input v-model="ruleForm.plan_name"></el-input>
    </el-form-item>

    <el-form-item label="开始时间" prop="start_time">
      <el-input v-model="ruleForm.start_time"></el-input>
    </el-form-item>

    <el-form-item label="结束时间" prop="end_time">
      <el-input v-model="ruleForm.end_time"></el-input>
    </el-form-item>
    <el-form-item label="计划状态" prop="plan_status">
      <el-input v-model="ruleForm.plan_status"></el-input>
    </el-form-item>
    <!--    <el-form-item label ="计划" prop = "plan_id">-->
    <!--      <el-select style="width:500px;" v-model="ruleForm.plan_id" @change="change1" placeholder="请选择">-->
    <!--        <el-option-->
    <!--          v-for="item in options1"-->
    <!--          :label="item.plan_name"-->
    <!--          :value="item.id">-->
    <!--        </el-option>-->
    <!--      </el-select>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label ="任务" prop = "task_id">-->
    <!--      <el-select style="width:500px;" v-model="ruleForm.task_id"  placeholder="请选择">-->
    <!--        <el-option-->
    <!--          v-for="item in options2"-->
    <!--          :label="item.task_name"-->
    <!--          :value="item.id">-->
    <!--        </el-option>-->
    <!--      </el-select>-->
    <!--    </el-form-item>-->
    <el-form-item label ="指挥官" prop = "person_id">
      <el-select style="width:500px;" v-model="person_id"  placeholder="请选择">
        <el-option
          v-for="item in options1"
          :label="item.name_cn"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <div class="addFormBox">
      <h2>作战任务 </h2>
      <!-- 循环data中定义的数组 -->
      <el-form label-width="80px" ref="formtask">
        <div v-for="(item,index) in formtask" :key="index">
          <div class="formOuterBox">
            <div class="formCotantBox">

              <!-- 表单内容 -->

              <el-form-item label="id" class="form-style" v-show="false">
                <el-input v-model="item.id" class="special-style"></el-input>
              </el-form-item>
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
                <el-form-item label="人员id" class="form-style" v-show="false">
                  <el-input v-model="item.plan_id" class="special-style" value="ruleForm.id"></el-input>
                </el-form-item>
                <el-form-item class="form-style">
                  <el-button @click="addForm(ruleForm)" type="success">+</el-button>
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
      <el-button type="primary" @click="submitForm1('ruleForm');submitForm2('ruleForm')" >修改</el-button>
    </div>

    <!--    <el-form-item>-->
    <!--      <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>-->
    <!--      <el-button @click="resetForm('ruleForm')">重置</el-button>-->
    <!--    </el-form-item>-->

  </el-form>
</template>

<script>
export default {
  data() {
    return {
      person_id_old:"",
      person_id:"",
      formtask: [
        {

        },
      ],
      options1:[],
      options2:[],
      ruleForm: {
        id: '',
        name_cn: '',
        name_en: '',
        gender:'',
        picture:'',
        address:'',
        task_id:'',
        plan_id:'',
      },
      rules: {
        name: [
          { required: true, message: '飞机名称不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    addForm(ru) {

      this.formtask.push({
        id:"",
        start_time: "",
        end_time: "",
        task_name: "",
        task_status: "",
        plan_id:ru.id,
      });

    },
    // 删除操作
    removeIdx(item, index) {
      const _this = this
      if(item.id==""){
        _this.formtask.splice(index, 1);
        _this.$message({
          message: "删除成功",
          type: "success",
        })
      }
      else {
        axios.delete('/api/task/deleteById/' + item.id).then(function (resp) {

          _this.formtask.splice(index, 1);
          _this.$message({
            message: "删除成功",
            type: "success",
          })
        })
      }
    },

    // submitForm(formName) {
    //   const _this = this
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       axios.put('http://localhost:8181/person/update',this.ruleForm).then(function(resp){
    //         if(resp.data == 'success'){
    //           _this.$alert('《'+_this.ruleForm.name_cn+'》修改成功！', '消息', {
    //             confirmButtonText: '确定',
    //             callback: action => {
    //               _this.$router.push('/person')
    //             }
    //           })
    //         }
    //       })
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    submitForm1(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.put('/api/plan/update',this.ruleForm).then(function(resp){

          })
        }
        else {
          return false;
        }
      });
    },
    submitForm2(formName) {

      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.get('/api/person/setplanid/'+this.person_id+'/'+this.ruleForm.id+'/'+this.person_id_old).then(function(resp){
            console.log(_this.formeducation)
          })
        }
        else {
          return false;
        }
      });
      axios.put('/api/task/update',this.formtask).then(function(resp){
        _this.$alert('《' + _this.ruleForm.plan_name + '》修改成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            _this.$router.push('/plan')
          }
        })
      })


    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    const _this = this
    axios.get('/api/plan/findById/'+this.$route.query.id).then(function(resp){

      _this.ruleForm = resp.data[0]
    })
    axios.get('/api/person/findByPlanid/'+this.$route.query.id).then(function(resp){
      _this.person_id = resp.data[0].id
      _this.person_id_old = resp.data[0].id
    })
    axios.get('/api/person/findAll/').then(function(resp){
      _this.options1 = resp.data
    })
    axios.get('/api/task/findByPlanid/'+this.$route.query.id).then(function(resp){
      _this.formtask = resp.data
    })
    // axios.get('http://localhost:8181/person/deleteplanid/'+this.person_id).then(function(resp){
    //
    // })
  },

}
</script>
