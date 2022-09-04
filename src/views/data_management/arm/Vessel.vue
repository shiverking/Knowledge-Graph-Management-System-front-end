<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 95%">
      <el-table-column
        fixed
        prop="vessel_id"
        label="舰船编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="舰船名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="picture"
        label="图片"
        width="100">
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
        prop="manufacturer"
        label="制造商"
        width="100">
      </el-table-column>
      <el-table-column
        prop="product_date"
        label="生产时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="launch_time"
        label="下水时间"
        width="50">
      </el-table-column>
      <el-table-column
        prop="service_time"
        label="服役时间"
        width="50">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="50">
      </el-table-column>
      <el-table-column
        prop="subtype"
        label="次型"
        width="50">
      </el-table-column>
      <el-table-column
        prop="length"
        label="长度"
        width="50">
      </el-table-column>
      <el-table-column
        prop="width"
        label="宽度"
        width="100">
      </el-table-column>
      <el-table-column
        prop="crew_num"
        label="载员"
        width="100">
      </el-table-column>
      <el-table-column
        prop="full_load_displacement"
        label="满载排水量"
        width="50">
      </el-table-column>
      <el-table-column
        prop="speed"
        label="速度"
        width="100">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="50">
      </el-table-column>
      <el-table-column
        prop="task.task_name"
        label="执行任务"
        width="50">
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
      axios.get('http://localhost:8181/vessel/findAll/'+(currentPage-1)+'/4').then(function(resp){
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
    axios.get('http://localhost:8181/vessel/findAll/0/4').then(function(resp){
      console.log(resp)
      _this.tableData = resp.data.content
      _this.pageSize = resp.data.size
      _this.total = resp.data.totalElements
    })
  }
}
</script>
