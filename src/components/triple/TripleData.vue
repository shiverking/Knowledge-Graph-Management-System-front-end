<template>
  <div>
    <div>
      <br>
      <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline">


        <el-form-item label="头实体：">
          <el-input v-model="ruleForm.value" placeholder="请输入字段值"></el-input>

        </el-form-item >
        <el-form-item label="头实体类型：">
          <el-select v-model="ruleForm.key" placeholder="请选择字段名称" >
            <el-option label="驱逐舰" value ="aircraft_name"></el-option>
            <el-option label="per" value ="rd_company"></el-option>
            <el-option label="巡洋舰" value ="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尾实体实体：">
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
          label="编号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="head"
          label="头实体"
          width="200">
      </el-table-column>
      <el-table-column
          prop="head_typ"
          label="头实体类型"
          width="200">
      </el-table-column>
      <el-table-column
          prop="tail"
          label="尾实体"
          width="200">
      </el-table-column>
      <el-table-column
          prop="tail_typ"
          label="尾实体类型"
          width="200">
      </el-table-column>
      <el-table-column
          prop="rel"
          label="关系"
          width="150">
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
      currentPage: '1',
      pageSize: '1',
      total: '11',
      tableData: [
        {
          id:1,
          head: '约翰·保罗·琼斯号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '美国',
          tail_typ: '国家',
          rel: '产国',
        },
        {
          id:2,
          head: '普林斯顿号导弹巡洋舰',
          head_typ: '巡洋舰',
          tail: '英格尔斯造船',
          tail_typ: '制造厂',
          rel: '制造厂',
        },
        {
          id:3,
          head: '约书亚·温克',
          head_typ: 'Per',
          tail: '尼米兹号航空母舰',
          tail_typ: '航空母舰',
          rel: '指挥军舰',
        },
        {
          id:4,
          head: '安东尼·梅西',
          head_typ: 'Per',
          tail: '古巴关塔那摩湾',
          tail_typ: 'Loc',
          rel: '家庭信息',
        },
        {
          id:5,
          head: '本杰明·华盛顿',
          head_typ: 'Per',
          tail: '纽约罗切斯特',
          tail_typ: 'Loc',
          rel: '家庭信息',
        },
        {
          id:6,
          head: '柯蒂斯·威尔伯号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '道尔顿·特劳特',
          tail_typ: 'Per',
          rel: '指挥军士长',
        }
      ],
      ruleForm: {
        key: '',
        value: '',
        page: '',
        size: 2,
      },
      rules: {
        name: [
          {required: true, message: '图书名称不能为空', trigger: 'blur'}
        ],
        author: [
          {required: true, message: '作者不能为空', trigger: 'blur'}
        ]
      }
    };
    // },
    // methods: {
    //   submitForm(formName) {
    //     const _this = this
    //     _this.$refs[formName].validate((valid) => {
    //       if (valid) {
    //         _this.ruleForm.page = _this.currentPage
    //         axios.get('/api/aircraft/search',{params:_this.ruleForm}).then(function(resp){
    //           console.log(_this.ruleForm)
    //           _this.tableData = resp.data.content
    //           _this.total = resp.data.totalElements
    //         })
    //       } else {
    //         return false;
    //       }
    //     });
    //   },
    //   deleteBook(row){
    //     const _this = this
    //     axios.delete('/api/aircraft/deleteById/'+row.id).then(function(resp){
    //
    //       _this.$alert('《'+row.aircraft_name+'》删除成功！', '消息', {
    //         confirmButtonText: '确定',
    //         callback: action => {
    //           window.location.reload()
    //         }
    //       })
    //     })
    //   },
    //   add() {
    //     this.$router.push({
    //       path: '/data/arm/AddAircraft',
    //     })
    //   },
    //   edit(row) {
    //     this.$router.push({
    //       path: '/data/arm/AircraftUpdate',
    //       query:{
    //         id:row.id
    //       }
    //     })
    //   },
    //   page(currentPage){
    //
    //     const _this = this
    //     if(_this.ruleForm.value ==''){
    //       axios.get('/api/aircraft/findAll/'+(currentPage-1)+'/2').then(function(resp){
    //         console.log(resp)
    //         _this.tableData = resp.data.content
    //         _this.pageSize = resp.data.size
    //         _this.total = resp.data.totalElements
    //       })}
    //     else{
    //       _this.ruleForm.page = currentPage
    //       axios.get('/api/aircraft/search',{params:_this.ruleForm}).then(function(resp){
    //         console.log(_this.ruleForm)
    //         _this.tableData = resp.data.content
    //         _this.total = resp.data.totalElements
    //       })
    //     }
    //   }
    // },
    //
    //
    // created() {
    //   const _this = this
    //   axios.get('/api/aircraft/findAll/0/2').then(function(resp){
    //     console.log(resp)
    //     _this.tableData = resp.data.content
    //     _this.pageSize = resp.data.size
    //     _this.total = resp.data.totalElements
    //   })
    // }
  }
}
</script>
