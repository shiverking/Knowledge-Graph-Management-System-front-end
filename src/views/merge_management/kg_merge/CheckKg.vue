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
        <el-button id= "syn" class="search_button" type="success" :loading="synchronizationLoading">同步图数据库中</el-button>
        <!--概况-->
        <el-table
          :data="versionTablePageData"
          border
          style="width: 100%"
          key="1">
          <el-table-column
              prop="version_number"
              label="版本号"
              :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
              prop="name"
              label="版本名称"
              :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
              label="提交时间">
            <template slot-scope="scope">
              <span>{{dateFormat(scope.row.submit_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="submitted_by"
              label="提交人">
          </el-table-column>
          <el-table-column
              label="是否同步">
            <template slot-scope="scope">
              <el-image v-if="scope.row.synchronization==0" style="width: 25px; height: 25px"
                        :src="discard"></el-image>
              <el-image v-if="scope.row.synchronization==1"style="width: 25px; height: 25px"
                        :src="success"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  @click="showVersionDetail(scope.row.version_number)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
          <el-pagination
              @current-change="versionHandleCurrentChange"
              @size-change="versionHandleSizeChange"
              :current-page.sync="versionCurrentPage"
              :page-size="versionPageSize"
              :page-sizes="versionPageSizes"
              layout="total,sizes, prev, pager, next,jumper"
              :total="versionTotal">
          </el-pagination>
        </div>
        <!--详情-->
        <div v-show="!showDetail">
          <el-button @click="showDetail=true">返回</el-button>
          <el-tabs v-model="activeName" >
            <!--融合改动-->
            <el-tab-pane label="融合改动" name="first">
              <el-table border :data="mergeData" style="margin-top:0vh">
                <el-table-column  label="头实体">
                  <template slot-scope="scope">
                    {{scope.row.head}}
                    <el-tag size="small" type="info">{{ scope.row.head_category }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column property="head_from" label="From"></el-table-column>
                <el-table-column property="relation" label="关系" ></el-table-column>
                <el-table-column property="tail" label="尾实体" >
                  <template slot-scope="scope">
                    {{scope.row.tail}}
                    <el-tag size="small" type="info">{{ scope.row.tail_category }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column property="tail_from" label="From"></el-table-column>
                <el-table-column property="score" label="置信评分"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                  <span>
                  <el-tag type="success" v-if="scope.row.operation=='插入'">{{ scope.row.operation}}</el-tag>
                  <el-tag type="danger" v-if="scope.row.operation=='忽略'">{{ scope.row.operation}}</el-tag>
                </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作时间">
                  <template slot-scope="scope">{{ dateFormat(scope.row.time)}}</template>
                </el-table-column>
              </el-table>
              <el-pagination
                  @current-change="mergeHandleCurrentChange"
                  @size-change="mergeHandleSizeChange"
                  :current-page.sync="mergeCurrentPage"
                  :page-size="mergePageSize"
                  :page-sizes="mergePageSizes"
                  layout="total,sizes, prev, pager, next,jumper"
                  :total="mergeTotal">
              </el-pagination>
            </el-tab-pane>
            <!--补全改动-->
            <el-tab-pane label="补全改动" name="second">
              <el-table border :data="completionData">
                <el-table-column property="head" label="头实体"></el-table-column>
                <el-table-column property="rel" label="关系" ></el-table-column>
                <el-table-column property="tail" label="尾实体" ></el-table-column>
                <el-table-column property="pred_prob" label="评分"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span v-if="scope.row.pred_form=='0'">预测尾实体</span>
                    <span v-if="scope.row.pred_form=='1'">预测头实体</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作时间">
                  <template slot-scope="scope">{{ dateFormat(scope.row.time)}}</template>
                </el-table-column>
              </el-table>
              <el-pagination
                  @current-change="completionHandleCurrentChange"
                  @size-change="completionHandleSizeChange"
                  :current-page.sync="completionCurrentPage"
                  :page-size="completionPageSize"
                  :page-sizes="completionPageSizes"
                  layout="total,sizes, prev, pager, next,jumper"
                  :total="completionTotal">
              </el-pagination>
            </el-tab-pane>
            <!--质量评估改动-->
            <el-tab-pane label="质量评估改动" name="third">
              <el-table :data="evaluationData">
                <el-table-column property="head" label="头实体" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="head_new" label="新头实体" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="head_typ" label="类型" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="head_typ_new" label="新类型" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="rel" label="关系" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="rel_new" label="新关系" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="tail" label="尾实体" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="tail_new" label="新尾实体" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="tail_typ" label="类型" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="tail_typ_new" label="新类型" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="错误类型" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span v-if="scope.row.error_typ=='0'">实体错误</span>
                    <span v-if="scope.row.error_typ=='1'">链接错误</span>
                    <span v-if="scope.row.error_typ=='2'">属性值错误</span>
                  </template>
                </el-table-column>
                <el-table-column label="修改形式" >
                  <template slot-scope="scope">
                    <span v-if="scope.row.update_form=='0'"><el-tag type="danger">删除</el-tag></span>
                    <span v-if="scope.row.update_form=='1'"><el-tag type="warning">修改实体</el-tag></span>
                    <span v-if="scope.row.update_form=='2'"><el-tag type="warning">修改链接</el-tag></span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                  @current-change="evaluationHandleCurrentChange"
                  @size-change="evaluationHandleSizeChange"
                  :current-page.sync="evaluationCurrentPage"
                  :page-size="evaluationPageSize"
                  :page-sizes="evaluationPageSizes"
                  layout="total,sizes, prev, pager, next,jumper"
                  :total="evaluationTotal">
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
</template>
<script>
import moment from 'moment';
import $ from "../../../plugins/jquery.min"
import discard from "@/assets/icon/discard.png"
import success from "@/assets/icon/success.png"
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
      success:success,
      discard:discard,
      //tab页默认激活
      activeName:"first",
      //是否展示界面
      showDetail:true,
      //版本控制的分页
      versionTablePageData:[],
      versionCurrentPage:1,
      versionPageSize:10,
      versionPageSizes:[10,20,50,80,100],
      versionTotal:0,
      versionLoading:false,
      //查询所有的merge的版本数据
      mergeData:[],
      mergeCurrentPage:1,
      mergePageSize:10,
      mergePageSizes:[10,20,50,80,100],
      mergeTotal:0,
      //查询所有的completion的版本数据
      completionData:[],
      completionCurrentPage:1,
      completionPageSize:10,
      completionPageSizes:[10,20,50,80,100],
      completionTotal:0,
      //查询所有的evaluation的版本数据
      evaluationData:[],
      evaluationCurrentPage:1,
      evaluationPageSize:10,
      evaluationPageSizes:[10,20,50,80,100],
      evaluationTotal:0,
      //当前正在查询的versionId
      currentId:"",
      dialogLoading:false,
      //同步按钮loading
      synchronizationLoading:true,
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
    //处理版本pagesize改变事件
    versionHandleSizeChange(val) {
      //修改当前分页大小
      this.versionPageSize= val;
      //重新请求数据
      this.get_version(this.versionCurrentPage,val)
    },
    //版本翻页动作
    versionHandleCurrentChange(val) {
      this.get_version(val,this.versionPageSize)
    },
    //向后端请求版本数据
    get_version(num, limit) {
      //axios请求
      axios.request({
        method:"POST",
        url:'/api/version/getVersionByPage',
        params:{page:num,limit:limit}
      })
      .then((response) => {
        if (response.status == 200) {
          //修改数据
          this.versionTablePageData = response.data.data
          this.versionTotal = response.data.count
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    //获取mergeTableData
    get_merge(page,limit){
      axios.request({
        method:"POST",
        url:'/api/version/getMergeByPage',
        params:{page:page,limit:limit,versionId:this.currentId}
      })
      .then((response) => {
        if (response.status == 200) {
          //向表中加载数据
          this.mergeData= response.data.data
          this.mergeTotal= response.data.count
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    //mergeTable的PageSzie改变动作
    mergeHandleSizeChange(val){
      //修改当前分页大小
      this.mergePageSize = val;
      //重新请求数据
      this.get_merge(this.mergePageSize,val)
    },
    //mergeTable分页改变动作
    mergeHandleCurrentChange(val){
      this.get_merge(val,this.mergePageSize)
    },
    //获取completionTableData
    get_completion(page,limit){
      axios.request({
        method:"POST",
        url:'/api/version/getCompletionByPage',
        params:{page:page,limit:limit,versionId:this.currentId}
      })
          .then((response) => {
            if (response.status == 200) {
              //向表中加载数据
              this.completionData= response.data.data
              this.completionTotal= response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //completionTable的PageSzie改变动作
    completionHandleSizeChange(val){
      //修改当前分页大小
      this.completionPageSize = val;
      //重新请求数据
      this.get_completion(this.completionPageSize,val)
    },
    //completionTable分页改变动作
    completionHandleCurrentChange(val){
      this.get_completion(val,this.completionPageSize)
    },
    //获取evaluationTableData
    get_evaluation(page,limit){
      axios.request({
        method:"POST",
        url:'/api/version/getEvaluationByPage',
        params:{page:page,limit:limit,versionId:this.currentId}
      })
          .then((response) => {
            if (response.status == 200) {
              //向表中加载数据
              this.evaluationData= response.data.data
              this.evaluationTotal= response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //evaluationTable的PageSzie改变动作
    evaluationHandleSizeChange(val){
      //修改当前分页大小
      this.evaluationPageSize = val;
      //重新请求数据
      this.get_evaluation(this.evaluationPageSize,val)
    },
    //evaluationTable分页改变动作
    evaluationHandleCurrentChange(val){
      this.get_evaluation(val,this.evaluationPageSize)
    },
    //查看版本详细信息，包括merge,completion和evaluation
    showVersionDetail(version_id) {
      this.currentId = version_id
      //加载信息
      this.get_merge(this.mergeCurrentPage, this.mergePageSize)
      this.get_completion(this.completionCurrentPage, this.completionPageSize)
      this.get_evaluation(this.evaluationCurrentPage, this.evaluationPageSize)
      //将详情页打开
      this.showDetail = !this.showDetail;
    },
    //时间格式化
    dateFormat(data) {return moment(new Date(data).getTime()).format('YYYY-MM-DD HH:MM:SS');},
    //同步图数据库
    synchronize(){
      this.synchronizationLoading = true;
      axios.post('/pythonApi/coreKG2neo4j',{})
      .then((response) => {
        if (response.status == 200&&response.data.data=="true") {
          //向表中加载数据
          this.synchronizationLoading = false;
          //修改button文字
          $("#syn").text("已同步图数据库")
          //重新请求表格
          this.get_version(this.versionCurrentPage,this.versionPageSize);
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  },
  mounted() {
    //获取版本列表
    this.get_version(this.versionCurrentPage,this.versionPageSize);
    this.synchronize();
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
  margin-left: 8px !important;
}
.pagination{
  margin-top: 10px;
  text-align: center;
}
</style>