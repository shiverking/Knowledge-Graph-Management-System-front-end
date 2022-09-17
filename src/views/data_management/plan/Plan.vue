<template>
  <div>
    <div>
      <br>
      <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline">

        <el-form-item label="字段名称：">
          <el-select v-model="ruleForm.key" placeholder="请选择字段名称" >
            <el-option label="计划名称" value ="plan_name"></el-option>
            <el-option label="计划状态" value ="plan_status"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值：">
          <el-input v-model="ruleForm.value" placeholder="请输入字段值"></el-input>

        </el-form-item >
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="submitForm('formInline')" >搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon = "el-icon-circle-plus-outline" size='big'  @click="add()">添加</el-button>
        </el-form-item>


      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 800px">
      <el-table-column
        fixed
        prop="id"
        label="编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="plan_name"
        label="计划名称"
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
        prop="plan_status"
        label="计划状态"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150">
    <template slot-scope="scope">
        <el-button @click="detail(scope.row)" type="text" size="big" >详情</el-button>
      <el-button @click="edit(scope.row)" type="text" size="big" >编辑</el-button>
      <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>
<!--                          <el-button @click="deleteBook(scope.row)" type="text" size="small">删除</el-button>-->
    </template>
      </el-table-column>
</el-table>


    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      @current-change="page">
    </el-pagination>
  </div>
</template>

<script>
export default {
  methods: {
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.ruleForm.page = _this.currentPage
          axios.get('http://localhost:8181/plan/search',{params:_this.ruleForm}).then(function(resp){
            console.log(_this.ruleForm)
            _this.tableData = resp.data.content
            _this.total = resp.data.totalElements
          })
        } else {
          return false;
        }
      });
    },
    deleteBook(row){
      const _this = this
      axios.delete('http://localhost:8181/plan/deleteById/'+row.id).then(function(resp){
        _this.$alert('《'+row.plan_name+'》删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
      })
    },
    add() {
      this.$router.push({
        path: '/data/plan/AddPlan',
      })
    },
    edit(row) {
      this.$router.push({
        path: '/data/plan/PlanUpdate',
        query:{
          id:row.id
        }
      })
    },
    detail(row) {
      this.$router.push({
        path: '/data/plan/PlanDetail',
        query:{
          id:row.id
        }
      })
    },
    page(currentPage){
      const _this = this
      axios.get('http://localhost:8181/plan/findAll/'+(currentPage-1)+'/9').then(function(resp){
        console.log(resp)
        _this.tableData = resp.data.content
        _this.pageSize = resp.data.size
        _this.total = resp.data.totalElements
      })
    }
  },

  data() {
    return {
      currentPage:'1',
      pageSize:'1',
      total:'11',
      tableData: [],
      ruleForm: {
        key: '',
        value: '',
        page: '',
        size: 2,
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

  created() {
    const _this = this
    axios.get('http://localhost:8181/plan/findAll/0/9').then(function(resp){
      console.log(resp)
      _this.tableData = resp.data.content
      _this.pageSize = resp.data.size
      _this.total = resp.data.totalElements
    })
  }
}
</script>
