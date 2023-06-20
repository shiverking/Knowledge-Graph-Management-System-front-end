<template>
  <div style="margin-top: 20px;">
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
      <el-tab-pane label="候选图谱列表"  name="overview">
        <el-card class="box-card" shadow="never">
          <div class="block">
            <el-switch
                v-model="switchValue"
                style="float: left;margin-top:10px;margin-bottom:20px;"
                active-text="原始图谱"
                inactive-text="融合图谱"
                @change="onSwitchChange">
            </el-switch>
          </div>
          <el-table
              :data="candidateKgPageList"
              border
              style="width: 100%; margin-top:10px"
              @selection-change="handleSelectionChange">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column label="名称(最新版本)" :show-overflow-tooltip="true">
              <template slot-scope="scope" >
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者" >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.creator }}</span>
            </template>
            </el-table-column>
            <el-table-column label="备注" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.comment}}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="创建时间">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ dateFormat(scope.row.createTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="最后修改时间" width>
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ dateFormat(scope.row.changeTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="addTab(scope.row.id,scope.row.name)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              @size-change="candidateKgHandleSizeChange"
              @current-change="candidateKgHandleCurrentChange"
              :current-page="candidateKgCurrentPage"
              :page-sizes="candidateKgPageSizes"
              :page-size="candidateKgPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="candidateKgTotal">
          </el-pagination>
        </el-card>
      </el-tab-pane>
      <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.candidateId"
          :label="item.title"
          :name="item.name"
          :closable="item.close">
        <keep-alive>
            <component :is="item.content" :containerId="item.name" :candidateID="item.candidateId" @delete="deleteCapture"></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <!--<el-button type="primary" @click="addTab(editableTabsValue)">查看候选图谱</el-button>-->
  </div>
</template>
<script>
import Detail from "../../../components/candidate_kg/Detail";
import DataSource from "../../../components/data_source/DataSource";
import Vue from 'vue'
// import {create} from "http-proxy-middleware/lib/path-rewriter";
import moment from "moment";
export default {
  components: {
    Detail,
  },
  data() {
    return {
      multipleSelection: [],
      activeName: 'first',
      pageSize: 10, // 每页多少条
      currentPage1: 1, // 当前页
      total: 29, // 总数据条数
      //可变分页结构
      editableTabsValue: 'overview',
      editableTabs: [],
      //存储打开的tab页的candidateId和tabName的关系
      openedTabsId: new Map,
      tabIndex: 0,
      //展示候选图谱的分页
      candidateKgPageList:[],
      candidateKgCurrentPage: 1,
      candidateKgTotal: 0,
      candidateKgPageSize: 10,
      candidateKgPageSizes: [10, 50, 100, 200],
      //选择原始图谱还是融合图谱
      switchValue:false,
    }
  },
  methods: {
    //动态增加删除tab页
    addTab(candidateId,targetName) {
      if (this.editableTabs.length > 5) {
        this.$message({
          message: "最多同时查看6个候选图谱!",
          type: "warning"
        });
        return;
      }
      //判断是否已经打开过，如已经打开过则跳转到打开的界面
      if(this.openedTabsId.has(candidateId)){
        this.editableTabsValue =this.openedTabsId.get(candidateId);
      }
      else{
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: targetName, //标签名
          name: newTabName,
          content: Detail, //对应组件名称
          candidateId:candidateId,//候选图铺的Id
          close: true
        });
        this.editableTabsValue = newTabName;
        this.openedTabsId.set(candidateId,newTabName);
      }
    },
    removeTab(targetName) {
      //删除对应关系
      for(var i of this.openedTabsId.keys()) {
        if(this.openedTabsId.get(i)==targetName){
          this.openedTabsId.delete(i);
          break;
        }
      }
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      //如果所有标签页都被关闭，则打开最初的候选图谱列表tab
      if(this.editableTabs.length==0){
        this.editableTabsValue = "overview";
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    del_all() {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        for (var j = 0; j < this.tableData.length; j++) {
          if (this.tableData[j] == this.multipleSelection[i])
            this.tableData.splice(j, 1)
        }
      }
    },
    getNowTime() {
      var date = new Date();
      //年 getFullYear()：四位数字返回年份
      var year = date.getFullYear(); //getFullYear()代替getYear()
      //月 getMonth()：0 ~ 11
      var month = date.getMonth() + 1;
      //日 getDate()：(1 ~ 31)
      var day = date.getDate();
      //时 getHours()：(0 ~ 23)
      var hour = date.getHours();
      //分 getMinutes()： (0 ~ 59)
      var minute = date.getMinutes();
      //秒 getSeconds()：(0 ~ 59)
      var second = date.getSeconds();
      var time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + '-' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
      return time;
    },
    //小于10的拼接上0字符串
    addZero(s) {
      return s < 10 ? ('0' + s) : s;
    },
    //选择多行数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    current_change(currentPage) { // 当前是第几页
      this.currentPage1 = currentPage
      this.currentChangePage(this.tableData, currentPage)
    },
    currentChangePage(list, currentPage) { // 分页方法(重点)
      let from = (currentPage - 1) * this.pageSize
      let to = currentPage * this.pageSize
      this.pageList = []
      for (; from < to; from++) {
        if (list[from]) {
          this.pageList.push(list[from])
        }
      }
    },
    //处理候选图谱分页事件
    candidateKgHandleSizeChange(val) {
      //修改当前分页大小
      this.candidateKgPageSize= val;
      if(this.switchValue==false) {
        //重新请求数据
        this.get_candidate_kgs(this.candidateKgCurrentPage, val)
      }
      else{
        this.get_old_candidate_kgs(val,this.candidateKgPageSize)
      }
    },
    //翻页动作
    candidateKgHandleCurrentChange(val) {
      //没有切换到原始图谱
      if(this.switchValue==false){
        this.get_candidate_kgs(val,this.candidateKgPageSize)
      }
      else{
        this.get_old_candidate_kgs(val,this.candidateKgPageSize)
      }
    },
    //向后端请求候选图谱数据
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
    //向后端请求已经融合过的候选图谱数据
    get_old_candidate_kgs(num, limit) {
      //axios请求
      axios.request({
        method:"POST",
        url:'/api/candidateKg/getAllOldCandidateKg',
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
    dateFormat(data) {
      return moment(new Date(data).getTime()).format('YYYY-MM-DD');

    },
    //switch开关改变动作
    onSwitchChange(val){
      //查看已经被融合过的图谱
      if(val==true){
        this.get_old_candidate_kgs(0,this.candidateKgPageSize);
      }
      //查看还未被融合的图谱
      else if(val==false){
        this.get_candidate_kgs(0,this.candidateKgPageSize);
      }
    },
    //删除整个候选图谱动作
    deleteCapture(id,containerId){
      axios.post('/api/candidateKg/deleteKg',{
           id:id,
      })
      .then((response) => {
        if (response.status == 200&&response.data.msg=="success") {
            //关闭标签页
            this.removeTab(containerId);
            //提示
            this.$message({
              message: '候选图谱删除成功',
              type: 'success'
            });
            //重新请求当页数据
            this.get_candidate_kgs(this.candidateKgCurrentPage,this.candidateKgPageSize);
          }
        else{
          this.$message({
            message: '候选图谱删除失败',
            type: 'danger'
          });
        }
        })
      .catch(function (error){
        console.log(error)
      })
    }
  },
  mounted() {
    this.get_candidate_kgs(this.candidateKgCurrentPage,this.candidateKgPageSize);
  },
}
</script>