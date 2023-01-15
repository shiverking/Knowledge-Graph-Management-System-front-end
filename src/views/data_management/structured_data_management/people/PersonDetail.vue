<template>
  <div>
    <br/>
    <div>教育信息</div>
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
    <div>履历信息</div>
    <el-table
      :data="tableData1"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="id"
        label="编号"
        width="50">
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
        prop="department"
        label="部门"
        width="200">
      </el-table-column>
      <el-table-column
        prop="title"
        label="职位"
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
    <div>计划信息</div>
    <el-table
      :data="tableData2"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="id"
        label="编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="plan_name"
        label="计划名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="开始时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="end_time"
        label="结束时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="plan_status"
        label="计划状态"
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
    <div v-if="tableData3">任务信息</div>
    <el-table
      :data="tableData3"
      border
      style="width: 100%"
      v-if="tableData3">
      <el-table-column
        fixed
        prop="id"
        label="编号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="task_name"
        label="任务名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="开始时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="end_time"
        label="结束时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="task_status"
        label="任务状态"
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

  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: '1',
      total: '11',
      tableData: [],
      tableData1: [],
      tableData2:[],
      tableData3:null,
    }
  },
  methods: {
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
        path: '/data/people/person',
      })
    },
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
    _this.axios.get('/api/person/searchresu/' + this.$route.query.id).then(function (resp) {
      _this.tableData1 = resp.data
    })
    _this.axios.get('/api/person/searchedu/' + this.$route.query.id).then(function (resp) {
      console.log(resp)
      _this.tableData = resp.data
    });
    _this.axios.get('/api/plan/findById/' + this.$route.query.id1).then(function (resp) {
      _this.tableData2.push(resp.data)
    });
  //   if (this.$route.query.id2 != null){
  //     axios.get('/api/task/findById/' + this.$route.query.id2).then(function (resp) {
  //     _this.tableData3 = resp.data
  //   });
  // }
    }
}


</script>
