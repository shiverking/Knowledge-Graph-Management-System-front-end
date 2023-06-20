<template>
  <div>
    <div>
      <br>
      <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline">

        <el-form-item label="字段名称：">
          <el-select v-model="ruleForm.key" placeholder="请选择字段名称" >
            <el-option label="中文名" value ="name_cn"></el-option>
            <el-option label="英文名" value ="name_en"></el-option>
            <el-option label="地址" value ="address"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值：">
          <el-input v-model="ruleForm.value" placeholder="请输入字段值"></el-input>

        </el-form-item >
        <el-form-item>
          <el-button type="primary" class="primary-btn" @click="submitForm('formInline')" >搜索</el-button>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon = "el-icon-circle-plus-outline" size='big'  @click="add()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
        :data="tableData"
        border
        style="width: 1100px">
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
<!--      <el-table-column-->
<!--          prop="picture"-->
<!--          label="图片"-->
<!--          width="200">-->
<!--        <template slot-scope="scope">-->
<!--          <img :src="scope.row.picture" width="80" height="80"  />-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
          prop="address"
          label="地址"
          width="100">
      </el-table-column>


      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="big" >详情</el-button>
          <el-button @click="edit(scope.row)" type="text" size="big">编辑</el-button>
          <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>
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
          _this.axios.get('/api/person/search',{params:_this.ruleForm}).then(function(resp){
            _this.tableData = resp.data.list
            _this.pageSize = resp.data.pageSize
            _this.total = resp.data.total
          })
        } else {
          return false;
        }
      });
    },
    deleteBook(row){
      const _this = this
      _this.axios.delete('/api/person/deleteById/'+row.id).then(function(resp){
        _this.$alert('《'+row.name_cn+'》删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
      })
    },
    add() {
      this.$router.push({
        path: '/data/structure/people/AddPerson',
      })
    },
    edit(row) {
      this.$router.push({
        path: '/data/structure/people/PersonUpdate',
        query:{
          id:row.id,
          id1:row.plan_id
        }
      })
    },
    detail(row) {
      this.$router.push({

        path: '/data/structure/people/PersonDetail',
        query:{
          id:row.id,
          id1:row.plan_id,
          id2:row.task_id?row.task_id:""
        }
      })
    },
    page(currentPage){
      const _this = this
      if(_this.ruleForm.value =='') {
        _this.axios.get('/api/person/findAll/' + (currentPage ) + '/7').then(function (resp) {
          _this.tableData = resp.data.list
          _this.pageSize = resp.data.pageSize
          _this.total = resp.data.total
        })
      }
      else{
        _this.ruleForm.page = _this.currentPage
        _this.axios.get('/api/person/search',{params:_this.ruleForm}).then(function(resp){
          _this.tableData = resp.data.list
          _this.pageSize = resp.data.pageSize
          _this.total = resp.data.total
        })
      }
    }
  },

  data() {
    return {
      currentPage:'1',
      pageSize:1,
      total:11,
      tableData: [],
      ruleForm: {
        key: '',
        value: '',
        page: '',
        size: 3,
      },
      rules: {
        name: [
          { required: true, message: '图书名称不能为空', trigger: 'blur' }
        ],
        author:[
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    const _this = this
    _this.axios.get('/api/person/findAll/0/7').then(function(resp){
      _this.tableData = resp.data.list
      _this.pageSize = resp.data.pageSize
      _this.total = resp.data.total
    })
  }
}
</script>



