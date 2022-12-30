<template>
  <div class="block" style="margin: 10px;">
        <!--版本查询-->
        <div  v-show="showDetail">
          <div class="search_kg_input">
            <el-input placeholder="过滤器" v-model="input3" class="input-with-select">
              <el-select v-model="select" slot="prepend" placeholder="请选择"></el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <el-button class="search_button" type="primary">查询</el-button>
          <el-button class="search_button" type="danger" @click="showDetail = !showDetail">测试按钮</el-button>
          <el-button class="search_button" type="success">发布</el-button>
        <!--概况-->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          key="1">
          <el-table-column
              prop="date"
              label="ID"
              width="180">
          </el-table-column>
          <el-table-column
              prop="name"
              label="图谱名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="address"
              label="版本日期">
          </el-table-column>
          <el-table-column
              prop="address"
              label="版本号">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">详情</el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :total="1000">
        </el-pagination>
        </div>
        <!--详情-->
        <div v-show="!showDetail">
          <el-button @click="showDetail=true">返回</el-button>
          <el-table
              :data="tableData"
              border
              style="width: 100%">
            <el-table-column
                prop="date"
                label="ID"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="头实体"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="尾实体">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
            </el-table-column>
            <el-table-column
                prop="address"
                label="日期">
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :total="1000">
        </el-pagination>
        </div>
      </div>
</template>
<script>
import moment from 'moment';
import $ from "../../../plugins/jquery.min"
export default {
  data() {
    return {
      kgs: [],
      state: '',
      timeout:  null,
      input1: '',
      input2: '',
      input3: '',
      select: '',

      //tab页默认激活
      activeName:"first",
      //展示候选图谱的分页
      candidateKgPageList:[],
      candidateKgCurrentPage: 1,
      candidateKgTotal: 0,
      candidateKgPageSize: 20,
      candidateKgPageSizes: [10, 50, 100, 200],
      reverse: false,
      activities: [{
        content: '活动按期开始',
        status:"untreated",
        user:"zhangsan",
        timestamp: '2018-04-13'
      }, {
        content: '通过审核',
        status:"untreated",
        user:"lisi",
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        status:"untreated",
        user:"wangwu",
        timestamp: '2018-04-11'
      }],
      //未处理
      untreated:3,
      // 已处理个数
      treated:10,
      isIndeterminate: true,
      //是否展示界面
      showDetail:true,
    }
    },
  methods: {
    loadAll() {
      return [
        {"value": "第十一航母打击群"},
        {"value": "第十二航母打击群"},
        {"value": "第七舰载机联队"},
        {"value": "第五战斗机编队"},
      ];
    },
    querySearchAsync(queryString, cb) {
      var kgs = this.kgs;
      var results = queryString ? kgs.filter(this.createStateFilter(queryString)) : kgs;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //多选框
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    //处理候选图谱分页事件
    candidateKgHandleSizeChange(val) {
      //修改当前分页大小
      this.candidateKgPageSize= val;
      //重新请求数据
      this.get_candidate_kgs(this.candidateKgCurrentPage,val)
    },
    //翻页动作
    candidateKgHandleCurrentChange(val) {
      this.get_candidate_kgs(val,this.candidateKgPageSize)
    },
    //向后端请求候选三元组数据
    get_candidate_kgs(num, limit) {
      //axios请求
      axios.request({
        method:"POST",
        url:'/api/candidateKg/getAllCandidateKg',
        params:{page:num,limit:limit}
      })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.candidateKgPageList = response.data.data
              this.candidateKgTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //时间格式化
    dateFormat(data) {return moment(new Date(data).getTime()).format('YYYY-MM-DD');},
    //检查未处理的版本记录
    checkOutTreated(){
      this.activities =[{
        content: '测试活动1',
        status:"finished",
        user:"zhangsan",
        timestamp: '2018-04-13'
      }, {
        content: '测试活动2',
        status:"discard",
        user:"lisi",
        timestamp: '2018-04-13'
      }, {
        content: '测试活动3',
        status:"finished",
        user:"wangwu",
        timestamp: '2018-04-11'
      }]
    },
    //查看处理的版本
    checkOutUntreated(){
      this.activities = [{
        content: '活动按期开始',
        status:"untreated",
        user:"zhangsan",
        timestamp: '2018-04-13'
      }, {
        content: '通过审核',
        status:"untreated",
        user:"lisi",
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        status:"untreated",
        user:"wangwu",
        timestamp: '2018-04-11'
      }]
    }
  },
  mounted() {
    //获取候选图谱列表
    this.get_candidate_kgs(this.candidateKgCurrentPage,this.candidateKgPageSize);
  }
}
</script>
<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  width: 10%;
  background-color: #fff;
}
.search_kg_input{
  width: 70%;
  margin-top: 15px;
  margin-bottom: 10px;
  display: inline-block;
}
.search_button{
  display: inline-block;
}
.button_group{
  float: right;
}
.card_group{
  border-right-width: 1px;
  border-left-width: 1px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.el-card__body{
  padding: 0px;
}
.card_item{
  border-radius: 0px;
  margin-top: 0px;
  border-top-width: 1px;
  border-right: 0px;
  border-left: 0px;
  border-bottom: 0px;
  padding:10px;
}
.operation_row{
  border-right-width: 0px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-bottom-width: 1px;
  background-color: #F6F8FA;
  padding: 15px;
}
.pagination{
  margin-top: 10px;
  text-align: center;
}
.icon_image{
  top:3px;
  width: 20px;
  height:20px
}
.change_data_icon{
  padding:0px;
  font-size: medium;
  display: inline-block;
  color:black;
}
.label{
  font-weight: bold;
  display: inline-block;
  margin: 0px;
  font-size: medium;
}
.small_label{
  font-weight: 100;
  font-size: small;
}
.my_sub_menu{
  display: inline-block;
  width: 100px;
}
</style>