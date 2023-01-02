<template>
  <div>

    <br/>
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
    <div>舰船信息</div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="id"
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



      <!--      <el-table-column-->
<!--        fixed="right"-->
<!--        label="操作"-->
<!--        width="100">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button @click="edit1(scope.row)" type="text" size="big" >详情</el-button>-->
<!--          &lt;!&ndash;                          <el-button @click="deleteBook(scope.row)" type="text" size="small">删除</el-button>&ndash;&gt;-->
<!--        </template>-->
<!--      </el-table-column>-->
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
    deleteBook(row) {
      const _this = this
      axios.delete('/api/book/deleteById/' + row.id).then(function (resp) {
        _this.$alert('《' + row.name + '》删除成功！', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            window.location.reload()
          }
        })
      })
    },
    edit() {
      const _this = this
      _this.$router.push({
        path: '/data/plan/plandetail',
        query:{
          id:this.$route.query.id2,
        }
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
    axios.get('/api/vessel/findByTaskid/' + this.$route.query.id).then(function (resp) {
      console.log(resp)
      _this.tableData = resp.data
    });
    axios.get('/api/person/findByTaskid/' + this.$route.query.id).then(function (resp) {
      _this.tableData1 = resp.data
    });
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
