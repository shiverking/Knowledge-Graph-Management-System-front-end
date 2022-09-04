<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="artillery_id"
        label="火炮编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="火炮名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="country"
        label="国家"
        width="100">
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
        prop="description"
        label="简介"
        width="200">
      </el-table-column>
      <el-table-column
        prop="product_date"
        label="研发时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="rd_company"
        label="研发公司"
        width="100">
      </el-table-column>
      <el-table-column
        prop="length"
        label="长度"
        width="50">
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量"
        width="50">
      </el-table-column>
      <el-table-column
        prop="diameter"
        label="口径"
        width="50">
      </el-table-column>
      <el-table-column
        prop="barrel_length"
        label="炮管长度"
        width="50">
      </el-table-column>
      <el-table-column
        prop="muzzle_velocity"
        label="炮口初速"
        width="50">
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
      axios.get('http://localhost:8181/artillery/findAll/'+(currentPage-1)+'/3').then(function(resp){
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
    axios.get('http://localhost:8181/artillery/findAll/0/3').then(function(resp){
      console.log(resp)
      _this.tableData = resp.data.content
      _this.pageSize = resp.data.size
      _this.total = resp.data.totalElements
    })
  }
}
</script>
