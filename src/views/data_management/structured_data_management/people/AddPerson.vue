<template>
  <div>
  <el-form style="width: 80%" :model="form.person" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">


    <el-form-item label="中文名" prop="name_cn">
      <el-input v-model="form.person.name_cn"></el-input>
    </el-form-item>

    <el-form-item label="英文名" prop="name_en">
      <el-input v-model="form.person.name_en"></el-input>
    </el-form-item>

    <el-form-item label="性别" prop="gender">
      <el-input v-model="form.person.gender"></el-input>
    </el-form-item>
<!--    <el-form-item label="图片" prop="picture">-->
<!--      <el-input v-model="form.person.picture"></el-input>-->
<!--    </el-form-item>-->

    <el-form-item label="地址" prop="address">
      <el-input v-model="form.person.address"></el-input>
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
    <div class="addFormBox" style="float: left">
      <h2>教育信息 </h2>
      <!-- 循环data中定义的数组 -->
      <el-form label-width="80px" ref="formeducation">
      <div v-for="(item,index) in form.education" :key="index">
        <div class="formOuterBox">
          <div class="formCotantBox">

            <!-- 表单内容 -->


              <el-col :span="4">
              <el-form-item label="开始时间" class="form-style">
                <el-input v-model="item.start_time" class="special-style"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="4">
              <el-form-item label="结束时间" class="form-style">
                <el-input v-model="item.finish_time" class="special-style"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="5">
              <el-form-item label="专业" class="form-style">
                <el-input v-model="item.major" class="special-style"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="学位" class="form-style">
                  <el-input v-model="item.degree" class="special-style"></el-input>
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

    <div class="addFormBox" style="float: left">
      <h2>履历信息 </h2>
      <!-- 循环data中定义的数组 -->
      <el-form label-width="80px" ref="formresume">
        <div v-for="(item,index) in form.resume" :key="index">
          <div class="formOuterBox">
            <div class="formCotantBox">

              <!-- 表单内容 -->


              <el-col :span="4">
                <el-form-item label="开始时间" class="form-style">
                  <el-input v-model="item.start_time" class="special-style"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="结束时间" class="form-style">
                  <el-input v-model="item.end_time" class="special-style"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="专业" class="form-style">
                  <el-input v-model="item.department" class="special-style"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="学位" class="form-style">
                  <el-input v-model="item.title" class="special-style"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="form-style">
                  <el-button @click="addForm2" type="success">+</el-button>
                  <el-button v-if="index!=0" @click="removeIdx2(item, index)" type="danger">-</el-button>
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
    <div style="float: left">
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
        person:{},
        education:[
          {
          },
        ],
        resume:[
          {
          },
        ]
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

        this.form.education.push({
          start_time: "",
          finish_time: "",
          degree: "",
          major: "",
        });

    },
    // 删除操作
    removeIdx(item, index) {
      this.form.education.splice(index, 1);
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },
    addForm2() {

        this.form.resume.push({
          start_time: "",
          end_time: "",
          department: "",
          title: "",
        })
    },
    // 删除操作
    removeIdx2(item, index) {
      this.form.resume.splice(index, 1);
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },
    change1(){
      const _this = this
      _this.axios.get('/api/task/findByPlanid/'+this.ruleForm.plan_id).then(function(resp){
        _this.options2 = resp.data
      })
    },
    submitForm1(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post('/api/person/save',this.form).then(function(resp){
                _this.$alert('《' + _this.form.person.name_cn + '》添加成功！', '消息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.$router.push('/data/structure/people/person')
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
    //       axios.post('/api/education/save',this.formeducation).then(function(resp){
    //       console.log(_this.formeducation)
    //     })
    //     }
    //     else {
    //       return false;
    //     }
    //   });
    //   axios.post('/api/resume/save',this.formresume).then(function(resp){
    //     _this.$alert('《' + _this.ruleForm.name_cn + '》添加成功！', '消息', {
    //       confirmButtonText: '确定',
    //       callback: action => {
    //         _this.$router.push('/person')
    //       }
    //     })
    //   })
    //
    //
    // },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  // created() {
  //   const _this = this
  //   _this.axios.get('/api/plan/findAll').then(function(resp){
  //     _this.options1 = resp.data
  //   })
  // }
}
</script>

