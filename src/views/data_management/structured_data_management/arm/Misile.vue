<template>
  <div>
    <div >
      <br>
      <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline">

        <el-form-item label="字段名称：">
          <el-select v-model="ruleForm.key" placeholder="请选择字段名称" >
            <el-option label="导弹名称" value ="name"></el-option>
            <el-option label="研发公司" value ="rd_company"></el-option>
            <el-option label="类型" value ="type"></el-option>
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
        style="width: 95%">
      <el-table-column
          fixed
          prop="id"
          label="导弹编号"
          width="50">
      </el-table-column>
      <el-table-column
          prop="name"
          label="导弹名称"
          width="100">
      </el-table-column>
      <el-table-column
          prop="picture"
          label="图片"
          width="100">
        <template slot-scope="scope">
          <el-image :src="scope.row.picture" style="width: 80px;height: 80px">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"  style="margin: 0 20px; font-size: 30px; "></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
          prop="description"
          label="简介"
          width="200">
      </el-table-column>
      <el-table-column
          prop="rd_company"
          label="研发公司"
          width="100">
      </el-table-column>
      <el-table-column
          prop="bomb_length"
          label="长度"
          width="100">
      </el-table-column>
      <el-table-column
          prop="bomb_weight"
          label="重量"
          width="100">
      </el-table-column>

      <el-table-column
          prop="winspan"
          label="翼展"
          width="100">
      </el-table-column>
      <el-table-column
          prop="guidance_system"
          label="制导系统"
          width="100">
      </el-table-column>

      <el-table-column
          prop="max_speed"
          label="最快速度"
          width="100">
      </el-table-column>
      <el-table-column
          prop="scope"
          label="射程"
          width="100">
      </el-table-column>
      <el-table-column
          prop="type"
          label="类型"
          width="100">
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="big" >编辑</el-button>
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
  data() {
    return {
      currentPage:1,
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
  methods: {
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.ruleForm.page = _this.currentPage
          axios.get('/api/misile/search',{params:_this.ruleForm}).then(function(resp){
            console.log(resp)
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
      axios.delete('/api/misile/deleteById/'+row.id).then(function(resp){

        _this.$alert('《'+row.name+'》删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
      })
    },
    add() {
      this.$router.push({
        path: '/data/structure/arm/AddMisile',
      })
    },
    edit(row) {
      this.$router.push({
        path: '/data/structure/arm/MisileUpdate',
        query:{
          id:row.id
        }
      })
    },
    page(currentPage){
      const _this = this
      if(_this.ruleForm.value =='') {
        axios.get('/api/misile/findAll/' + (currentPage ) + '/2').then(function (resp) {
          console.log(resp)
          _this.tableData = resp.data.list
          _this.pageSize = resp.data.pageSize
          _this.total = resp.data.total
        })
      }
      else{
        _this.ruleForm.page= currentPage
        axios.get('/api/misile/search',{params:_this.ruleForm}).then(function(resp){
          console.log(_this.ruleForm)
          _this.tableData = resp.data.list
          _this.pageSize = resp.data.pageSize
          _this.total = resp.data.total
        })

      }
    }

  },


  created() {
    const _this = this
    axios.get('/api/misile/findAll/0/2').then(function(resp){
      console.log(resp)
      _this.tableData = resp.data.list
      _this.pageSize = resp.data.pageSize
      _this.total = resp.data.total
    })
  }
}
</script>
