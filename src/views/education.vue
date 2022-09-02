<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="id"
        label="编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="person.name_cn"
        label="中文名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="开始时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="finish_time"
        label="结束时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="major"
        label="专业"
        width="200">
      </el-table-column>
      <el-table-column
        prop="degree"
        label="学位"
        width="200">
      </el-table-column>


      <!--            <el-table-column-->
      <!--                    fixed="right"-->
      <!--                    label="操作"-->
      <!--                    width="100">-->
      <!--                <template slot-scope="scope">-->
      <!--                    <el-button @click="edit(scope.row)" type="text" size="small" >修改</el-button>-->
      <!--                    <el-button @click="deleteBook(scope.row)" type="text" size="small">删除</el-button>-->
      <!--                </template>-->
      <!--            </el-table-column>-->
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
    deleteBook(row){
      const _this = this
      axios.delete('http://localhost:8181/book/deleteById/'+row.id).then(function(resp){
        _this.$alert('《'+row.name+'》删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
      })
    },
    edit(row) {
      this.$router.push({
        path: '/update',
        query:{
          id:row.id
        }
      })
    },
    page(currentPage){
      const _this = this
      axios.get('http://localhost:8181/education/findAll/'+(currentPage-1)+'/9').then(function(resp){
        console.log(resp)
        _this.tableData = resp.data.content
        _this.pageSize = resp.data.size
        _this.total = resp.data.totalElements
      })
    }
  },

  data() {
    return {
      pageSize:'1',
      total:'11',
      tableData: []
    }
  },

  created() {
    const _this = this
    axios.get('http://localhost:8181/education/findAll/0/9').then(function(resp){
      console.log(resp)
      _this.tableData = resp.data.content
      _this.pageSize = resp.data.size
      _this.total = resp.data.totalElements
    })
  }
}
</script>

