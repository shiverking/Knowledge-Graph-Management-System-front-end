<template>
  <div>

    <br/>
    <el-dialog title="任务配置" :visible.sync="dialogVisible" width="60%">

        <el-form style="width: 80%" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="id" prop="id " v-show="false">
            <el-input v-model="ruleForm.id"></el-input>
          </el-form-item>
          <div class="addFormBox">
            <!-- 循环data中定义的数组 -->
            <h2>指挥官</h2>
            <el-form label-width="80px" ref="formperson">
              <div v-for="(item,index) in form.person_new" :key="index">
                <div class="formOuterBox">
                  <div class="formCotantBox">

                    <!-- 表单内容 -->
                    <el-col :span="12">
                      <el-form-item  class="form-style">
                        <el-select v-model="item.id"  placeholder="请选择">
                          <el-option
                            v-for="item1 in options1"
                            :label="item1.name_cn"
                            :value="item1.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
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
          <div class="addFormBox">
          <h2>舰船舰艇</h2>
            <!-- 循环data中定义的数组 -->
            <el-form label-width="80px" ref="formpvessel">
              <div v-for="(item,index) in form.vessel_new" :key="index">
                <div class="formOuterBox">
                  <div class="formCotantBox">

                    <!-- 表单内容 -->
                    <el-col :span="12">
                      <el-form-item  class="form-style">
                        <el-select v-model="item.id"  placeholder="请选择">
                          <el-option
                            v-for="item1 in options2"
                            :label="item1.name"
                            :value="item1.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item class="form-style">
                        <el-button @click="addForm2()" type="success">+</el-button>
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
            <el-button type="primary" @click="submitForm1()" >提交</el-button>
          </div>

          <!--    <el-form-item>-->
          <!--      <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>-->
          <!--      <el-button @click="resetForm('ruleForm')">重置</el-button>-->
          <!--    </el-form-item>-->

        </el-form>
<!--      <div>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--          <el-button @click="dialogVisible = false">取 消</el-button>-->
<!--          <el-button type="primary" @click="submitForm1('ruleForm');dialogVisible = false"-->
<!--          >确 定</el-button-->
<!--          >-->
<!--        </span>-->
<!--      </div>-->
    </el-dialog>

    <div>指挥官信息</div>
    <el-table
      :data="tableData1"
      border
      style="width: 100%">

      <el-table-column
        fixed
        prop="id"
        label="人员编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name_cn"
        label="中文名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name_en"
        label="英文名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="200">
      </el-table-column>
      <el-table-column
        prop="picture"
        label="图片"
        width="200">
        <template slot-scope="scope">
          <img :src="scope.row.picture" width="80" height="80"  />
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="100">
      </el-table-column>


<!--                  <el-table-column-->
<!--                          fixed="right"-->
<!--                          label="操作"-->
<!--                          width="100">-->
<!--                      <template slot-scope="scope">-->
<!--                          <el-button @click="edit(scope.row)" type="text" size="small" >修改</el-button>-->
<!--                          <el-button @click="deleteBook(scope.row)" type="text" size="small">删除</el-button>-->
<!--                      </template>-->
<!--                  </el-table-column>-->
    </el-table>
    <div>任务信息</div>
    <el-table
      :data="tableData"
      border
      style="width: 750px">
      <el-table-column
        fixed
        prop="id"
        label="编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="task_name"
        label="任务名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="开始时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="end_time"
        label="结束时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="task_status"
        label="任务状态"
        width="100">
      </el-table-column>


                  <el-table-column
                          fixed="right"
                          label="操作"
                          width="200">
                      <template slot-scope="scope">
                          <el-button @click="edit1(scope.row)" type="text" size="big" >详情</el-button>
                          <el-button @click="editmsg(scope.row)" type="text" size="big">配置</el-button>
                      </template>
                  </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  data() {

    return {
      form:{
        person_new:[],
        vessel_new:[],
      },

      options1:[],
      options2:[],
      dialogVisible: false,
      ruleForm:[],
      pageSize: '1',
      total: '11',
      tableData: [],
      tableData1: [],
    }
  },
  methods: {
    addForm() {
      const _this =this
      this.form.person_new.push({
        id:"",
        task_id:_this.ruleForm.id
      });

    },
    // 删除操作
    removeIdx(item, index) {
      const _this = this
      // if(item.id==""){
        _this.form.person_new.splice(index, 1);
        _this.$message({
          message: "删除成功",
          type: "success",
        })
      // }
      // else {
        // axios.get('/api/person/deletetask/' + item.id).then(function (resp) {
        //
        //   _this.formtask.splice(index, 1);
        //   _this.$message({
        //     message: "删除成功",
        //     type: "success",
        //   })
        // })
      //   this.form.deleteperson.push(item)
      // }
    },
    addForm2() {

      this.form.vessel_new.push({
        id:"",
        task_id:_this.ruleForm.id
      });

    },
    // 删除操作
    removeIdx2(item, index) {
      const _this = this
      // if(item.id==""){
        _this.form.vessel_new.splice(index, 1);
        _this.$message({
          message: "删除成功",
          type: "success",
        })
      // }
      // else {
        // axios.get('/api/vessel/deletetask/' + item.id).then(function (resp) {
        //
        //   _this.formtask.splice(index, 1);
        //   _this.$message({
        //     message: "删除成功",
        //     type: "success",
        //   })
        // })
      //
      // }
    },
    // deleteBook(row) {
    //   const _this = this
    //   axios.delete('/api/book/deleteById/' + row.id).then(function (resp) {
    //     _this.$alert('《' + row.name + '》删除成功！', '消息', {
    //       confirmButtonText: '确定',
    //       callback: action => {
    //         window.location.reload()
    //       }
    //     })
    //   })
    // },
    edit() {
      this.$router.push({
        path: '/data/plan/plan',
      })
    },

    editmsg(row) {
      const _this =this
      axios.get('/api/person/findByTaskid/'+row.id).then(function(resp){
        _this.form.person_new = resp.data
        console.log(resp.data)
      })
      axios.get('/api/vessel/findByTaskid/'+row.id).then(function(resp){
        _this.form.vessel_new = resp.data
        console.log(resp.data)
      })
      this.ruleForm.id=row.id;
      this.dialogVisible = true;
    },
    edit1(row) {
      const _this =this
      _this.$router.push({

        path: '/data/plan/TaskDetail',
        query:{
          id:row.id,
          id2:this.$route.query.id
        }
      })
    },

    submitForm1() {
      // for(var i =0;i<this.person_old.length;i++){
        axios.post('/api/task/update',this.form).then(function(resp){
        })
      // }
      // for(var m =0;m<this.vessel_old.length;m++){
      //   axios.get('/api/vessel/deletetask/'+this.vessel_old[m].id).then(function(resp){
      //   })
      // }
      this.dialogVisible =false;
    },
    // submitForm2() {
    //   const _this =this
    //   for(var j =0;j<this.formperson.length;j++){
    //     axios.get('/api/person/settaskid/'+this.formperson[j].id+'/'+this.ruleForm.id).then(function(resp){
    //     })
    //   }
    //   for(var n =0;n<this.formvessel.length;n++){
    //     axios.get('/api/vessel/settaskid/'+this.formvessel[n].id+'/'+this.ruleForm.id).then(function(resp){
    //     })
    //   }
    //   this.dialogVisible =false;
    //
    //
    // },
    allocation(row){
      const _this =this
      _this.$router.push({
        path: '/taskallocation',
        query:{
          id:row.id,
          id2:this.$route.query.id
        }
      })

}
    //   page(currentPage){
    //     const _this = this
    //     axios.get('http://localhost:8181/education/findAll/'+(currentPage-1)+'/9').then(function(resp){
    //       console.log(resp)
    //       _this.tableData = resp.data.content
    //       _this.total = resp.data.totalElements
    //     })
    //   }
    // },



  },
  created() {
    const _this = this
    axios.get('/api/task/findByPlanid/' + this.$route.query.id).then(function (resp) {
      // console.log(resp)
      _this.tableData = resp.data
    })
    axios.get('/api/person/findByPlanid/' + this.$route.query.id).then(function (resp) {
      console.log(resp)
      _this.tableData1 = resp.data
    });
    axios.get('/api/person/findAll/').then(function(resp){
      _this.options1 = resp.data
    })
    axios.get('/api/vessel/findAll/').then(function(resp){
      _this.options2 = resp.data
    })

    // axios.get('http://localhost:8181/plan/findById/' + this.$route.query.id1).then(function (resp) {
    //
    //   _this.tableData2 = resp.data
    // });
    // if (this.$route.query.id2 != null){
    //   axios.get('http://localhost:8181/task/findById/' + this.$route.query.id2).then(function (resp) {
    //     _this.tableData3 = resp.data
    //   });
    // }
    }
}


</script>
