<template>
  <el-form style="width: 80%" :model="form.person" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="人员编号">
      <el-input v-model="form.person.id" readOnly></el-input>
    </el-form-item>
    <el-form-item label="中文名" prop="name_cn">
      <el-input v-model="form.person.name_cn"></el-input>
    </el-form-item>

    <el-form-item label="英文名" prop="name_en">
      <el-input v-model="form.person.name_en"></el-input>
    </el-form-item>

    <el-form-item label="性别" prop="gender">
      <el-input v-model="form.person.gender"></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="picture">
      <el-input v-model="form.person.picture"></el-input>
    </el-form-item>

    <el-form-item label="地址" prop="address" >
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
    <div class="addFormBox">
      <h2>教育信息 </h2>
      <!-- 循环data中定义的数组 -->
      <el-form label-width="80px" ref="formeducation">
        <div v-for="(item,index) in form.education" :key="index">
          <div class="formOuterBox">
            <div class="formCotantBox">

              <!-- 表单内容 -->

              <el-form-item label="id" class="form-style" v-show="false">
                <el-input v-model="item.id" class="special-style" value=1></el-input>
              </el-form-item>
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

              <el-form-item label="人员id" class="form-style" v-show="false">
                <el-input v-model="item.person_id" class="special-style" value="ruleForm.id"></el-input>
              </el-form-item>
              <el-col :span="6">
                <el-form-item class="form-style" >
                  <el-button @click="addForm(form.person)" type="success">+</el-button>
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

    <div class="addFormBox">
      <h2>履历信息 </h2>
      <!-- 循环data中定义的数组 -->
      <el-form label-width="80px" ref="formresume">
        <div v-for="(item,index) in form.resume" :key="index">
          <div class="formOuterBox">
            <div class="formCotantBox">

              <!-- 表单内容 -->


              <el-form-item label="id" class="form-style" v-show="false">
                <el-input v-model="item.id" class="special-style"></el-input>
              </el-form-item>
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
              <el-form-item label="人员id" class="form-style" v-show="false">
                <el-input v-model="item.person_id" class="special-style" value="ruleForm.id"></el-input>
              </el-form-item>
              <el-col :span="6">
                <el-form-item class="form-style">
                  <el-button @click="addForm2(form.person)" type="success">+</el-button>
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
      // formeducation: [
      //   {
      //
      //   },
      // ],
      // formresume: [
      //   {
      //
      //   },
      // ],
      options1:[],
      options2:[],
      // ruleForm: {
      //   id: '',
      //   name_cn: '',
      //   name_en: '',
      //   gender:'',
      //   picture:'',
      //   address:'',
      //   task_id:'',
      //   plan_id:'',
      // },
      rules: {
        name: [
          { required: true, message: '飞机名称不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    addForm(ru) {
      // 定义一个标识，通过标识判断是否能添加信息

      this.form.education.push({
        id:"",
        start_time: "",
        finish_time: "",
        degree: "",
        major: "",
        person_id:ru.id,
      });

    },
    // 删除操作
    removeIdx(item, index) {
      const _this = this
      // if(item.id==""){
        _this.form.education.splice(index, 1);
        _this.$message({
          message: "删除成功",
          type: "success",
        })
      // }
      // else {
      //   axios.delete('/api/education/deleteById/' + item.id).then(function (resp) {
      //
      //     _this.formeducation.splice(index, 1);
      //     _this.$message({
      //       message: "删除成功",
      //       type: "success",
      //     })
      //   })
      // }
    },
    addForm2(rule) {

      this.form.resume.push({
        id:"",
        start_time: "",
        end_time: "",
        department: "",
        title: "",
        person_id:rule.id,
      })
    },
    // 删除操作
    removeIdx2(item, index) {
      const _this = this

        _this.form.resume.splice(index, 1);
        _this.$message({
          message: "删除成功",
          type: "success",
        })
      // else {
      //   axios.delete('/api/resume/deleteById/' + item.id).then(function (resp) {
      //
      //     _this.formresume.splice(index, 1);
      //     _this.$message({
      //       message: "删除成功",
      //       type: "success",
      //     })
      //   })
      // }
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
          _this.axios.put('/api/person/update',this.form).then(function(resp){
                _this.$alert('《' + _this.form.person.name_cn + '》修改成功！', '消息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.$router.push('/data/people/person')
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
    //       axios.put('/api/education/update',this.formeducation).then(function(resp){
    //         console.log(_this.formeducation)
    //       })
    //     }
    //     else {
    //       return false;
    //     }
    //   });
    //   axios.put('/api/resume/update',this.formresume).then(function(resp){
    //     _this.$alert('《' + _this.ruleForm.name_cn + '》修改成功！', '消息', {
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
  created() {
    const _this = this
    _this.axios.get('/api/person/findById/'+this.$route.query.id).then(function(resp){
      console.log(resp)
      _this.form.person = resp.data
    })
    _this.axios.get('/api/person/searchedu/'+this.$route.query.id).then(function(resp){
      console.log(resp.data)
      _this.form.education = resp.data
    })
    _this.axios.get('/api/person/searchresu/'+this.$route.query.id).then(function(resp){
      _this.form.resume = resp.data
    })
  }
}
</script>
