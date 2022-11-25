<template>
  <div>
    <el-steps :active="active" finish-status="success"  simple>
      <el-step title="选择图谱" ></el-step>
      <el-step title="实体对齐" ></el-step>
      <el-step title="图谱融合" ></el-step>
    </el-steps>
    <div v-if="this.active==0">
      <el-button  @click="dialogAllKGVisible = true;loadCandidateData(candidateKgCurrentPage,candidateKgPageSize)" class="operation_button" type="primary">选择图谱</el-button>
      <el-button  class="operation_button" type="danger" @click="allClear">全部清空</el-button>
      <el-button  class="operation_button" type="primary" @click="importData">开始导入</el-button>
      <el-row :gutter="12">
        <el-col :span="11">
          <el-card class="box-card" shadow="never" style="display:block;margin-bottom:10px;">
            融合图谱:
            <span>{{currentRowName}}</span>
          </el-card>
          <!-- 显示要被融合的图谱-->
          <el-table
              :data="toKgTableData"
              border
              style="width: 100%"
              v-loading="toKgLoading"
          >
            <el-table-column
                prop="head"
                label="头实体"
                width="180">
            </el-table-column>
            <el-table-column
                prop="relation"
                label="关系"
                width="180">
            </el-table-column>
            <el-table-column
                prop="tail"
                label="尾实体">
            </el-table-column>
          </el-table>
          <el-pagination
              @current-change="toKgHandleCurrentChange"
              :current-page.sync="toKgCurrentPage"
              :page-size="toKgPageSize"
              layout="total, prev, pager, next"
              :total="toKgTotal">
          </el-pagination>
        </el-col>
        <el-col :span="1">
          <el-image
              style="width: auto; height: auto;position: relative;top: 10px;"
              src='../../../static/icon/left-arrow.jpeg'
              :fit="cover"></el-image>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="never" style="display:block;margin-bottom:10px;">
            候选图谱:
            <span>{{multipleSelectionName}}</span>
          </el-card>

          <!--显示要融合的图谱-->
          <el-table
              :data="fromKgTablePageData"
              border
              style="width: 100%"
              v-loading="toKgLoading">
            <el-table-column
                prop="head"
                label="头实体"
                width="180">
            </el-table-column>
            <el-table-column
                prop="relation"
                label="关系"
                width="180">
            </el-table-column>
            <el-table-column
                prop="tail"
                label="尾实体">
            </el-table-column>
            <el-table-column
                prop="candidateId"
                label="所属图谱">
            </el-table-column>
          </el-table>
          <el-pagination
              @current-change="fromKgHandleCurrentChange"
              :current-page.sync="fromKgCurrentPage"
              :page-size="fromKgPageSize"
              layout="total, prev, pager, next"
              :total="fromKgTotal">
          </el-pagination>
        </el-col>
      </el-row>
      <!--选择图谱对话框-->
      <el-dialog :visible.sync="dialogAllKGVisible"  :show-close='false'>
        <el-steps :active="select_kg_active" finish-status="success" simple>
          <el-step title="选择融合图谱"></el-step>
          <el-step title="选择候选图谱"></el-step>
        </el-steps>
        <!--选择融合图谱-->
        <div style="text-align: center;">
        <el-table
            v-if="this.select_kg_active==0"
            ref="selectMergeKgTable"
            :data="mergeKgTable"
            highlight-current-row
            @current-change="handleSelectCurrentChange"
            style="width: 100%"
            key="1"
            >
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="创建者">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.creator }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="备注">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.comment }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="最后修改时间">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{dateFormat(scope.row.changeTime)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            v-if="this.select_kg_active==0"
            background
            layout="prev, pager, next"
            @current-change="candidateKgHandleCurrentChange"
            :current-page="candidateKgCurrentPage"
            :page-size="candidateKgPageSize"
            :total="candidateKgTotal">
        </el-pagination>
        <el-table
            v-if="this.select_kg_active==1"
            ref="multipleCandidateKgTable"
            :data="multipleMergeKgTable"
            tooltip-effect="dark"
            border
            style="width: 100%"
            @selection-change="multipleCandidateKgHandleSelectionChange"
            key="2"
            >
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
<!--          <el-table-column type="selection"  width="55px" :reserve-selection="true">-->
<!--          </el-table-column>-->
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="创建者">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.creator }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="备注">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.comment }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="最后修改时间">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{dateFormat(scope.row.changeTime)}}</span>
            </template>
          </el-table-column>
          </el-table>
          <el-pagination
              v-if="this.select_kg_active==1"
              background
              layout="prev, pager, next"
              @current-change="multipleCandidateKgHandleCurrentChange"
              :current-page="multipleCandidateKgCurrentPage"
              :page-size="multipleCandidateKgPageSize"
              :total="multipleCandidateKgTotal">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="handleSelectKgClose">取消</el-button>
          <el-button type="primary" v-if="this.select_kg_active==1" @click="previousStep">上一步</el-button>
          <el-button id="nextStep" type="primary" @click="select_kg_next()">下一步</el-button>
        </div>
    </el-dialog>
    </div>
    <div v-if="this.active==1">
      <el-select v-model="value" placeholder="请选择算法">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input
          placeholder="请输入阈值(0-1)"
          v-model="input"
          style="width: inherit;"
          clearable>
      </el-input>
      <el-button style="margin-top: 12px;" @click="calculate">开始计算</el-button>
      <div style="margin-top: 20px;margin-bottom: 10px;">
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
      <el-dialog title="确认列表" :visible.sync="dialogTableVisible">
        <el-table :data="gridData">
          <el-table-column property="date" label="实体" width="150"></el-table-column>
          <el-table-column property="name" label="属性" width="200"></el-table-column>
          <el-table-column property="address" label="实体"></el-table-column>
        </el-table>
        <el-button style="margin-top: 12px;" @click="dialogTableVisible = false">确认</el-button>
      </el-dialog>
      <el-button style="margin-top: 12px;" @click="dialogTableVisible = true">筛选确认</el-button>
    </div>
    <div v-if="this.active==2">
      <el-descriptions title="融合信息确认" border>
        <el-descriptions-item label="原图谱实体数">1842</el-descriptions-item>
        <el-descriptions-item label="待融合实体数量">1321</el-descriptions-item>
        <el-descriptions-item label="原图谱列表"><a>点击查看</a></el-descriptions-item>
        <el-descriptions-item label="待融合实体列表"><a>点击查看</a></el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">装备</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作时间">2022-10-01</el-descriptions-item>
      </el-descriptions>
      <el-select v-model="selectedMergeStrategy" placeholder="请选择融合策略" style="width: 330px;">
        <el-option
            v-for="item in mergeStrategyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-top: 12px;" >开始融合</el-button>
      <el-progress :text-inside="false" :stroke-width="15" :percentage="70" style="margin-top: 10px;margin-bottom: 10px"></el-progress>
      <el-result icon="success" title="融合成功">
        <template slot="extra">
          <el-button type="primary" size="medium">查看结果</el-button>
        </template>
      </el-result>
    </div>
    <div style="text-align: right;">
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </div>
  </div>
</template>
<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}


.el-dialog__header {
  /*display: none;*/
  padding: 10px;
}
.dj-dialog-content {
  padding: 0;
  overflow: unset;
}
.transfer{
  text-align: left;
  display: inline-block;
}
.el-dialog{
  margin-top: 2vh !important;
}
.operation_button{
  display: inline-block;
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
<script>
import moment from 'moment';
import $ from "../../../plugins/jquery.min"
export default {
  data() {
    return {
      active: 0,
      options: [{
        value: '选项1',
        label: '最小编辑距离'
      }, {
        value: '选项2',
        label: '余弦相似度'
      }, {
        value: '选项3',
        label: 'Difflib'
      }, {
        value: '选项4',
        label: 'Fuzzywuzzy'
      }, {
        value: '选项5',
        label: '加权混合'
      }],
      strategy: [{
        value: '选项1',
        label: '保留原图谱实体'
      }, {
        value: '选项2',
        label: '保留新图谱实体'
      }, {
        value: '选项3',
        label: '同时保留'
      },],
      //融合策略选择
      mergeStrategyOptions: [{
        value: '选项1',
        label: '融合进原图谱(保留候选图谱)'
      }, {
        value: '选项2',
        label: '融合进原图谱(不保留候选图谱)'
      }, {
        value: '选项3',
        label: '融合成新图谱(保留原图谱，保留候选图谱)'
      }, {
        value: '选项4',
        label: '融合成新图谱(不保留原图谱，保留候选图谱)'
      },{
        value: '选项5',
        label: '融合成新图谱(保留原图谱，不保留候选图谱)'
      }, {
        value: '选项6',
        label: '融合成新图谱(不保留原图谱，不保留候选图谱)'
      }],
      selectedMergeStrategy: '',
      //选择图谱可视化
      dialogAllKGVisible:false,
      //融合图谱分页数据
      candidateKgPageSize:10,
      candidateKgTotal:'',
      candidateKgCurrentPage:1,
      //融合图谱数据表
      mergeKgTable:[],
      //融合图谱的选中行
      currentRowName:'',
      currentRowId:'',
      //多选候选图谱表格
      multipleMergeKgTable:[],
      multipleCandidateKgPageSize:10,
      multipleCandidateKgTotal:'',
      multipleCandidateKgCurrentPage:1,
      multipleSelection: [],
      multipleSelectionName: [],
      
      //要被融合的图谱分页信息
      toKgTableData:[],
      toKgCurrentPage:1,
      toKgPageSize:20,
      toKgTotal:0,
      toKgLoading:false,
      //待融合融合的图谱分页信息
      fromKgTableData:[],
      fromKgTablePageData:[],
      fromKgCurrentPage:1,
      fromKgPageSize:20,
      fromKgTotal:0,
      fromKgLoading:false,
      //选择图谱切换步骤条
      select_kg_active:0,

    };
  },

  methods: {
    //总体的下一步
    next() {
      console.log("active: "+this.active);
      if(this.active == 0){
        if(this.currentRowName==""||this.multipleSelectionName.length==0){
          this.$message({
            message: '请选择必要数据',
            type: 'warning'
          });
        }
        else{
          this.active++;
        }
      }
      else if(this.active==1){
        this.active++;
      }
      else if (this.active==2) {
        this.active = 0;
      }
    },
    //跳转到上一步
    previousStep(){
      this.select_kg_active =0;
      $("#nextStep").text("下一步")
    },
    //跳转到下一步
    select_kg_next(){
      if(this.select_kg_active == 1){
        //先关闭对话框
        this.dialogAllKGVisible = false;
        //将值置为0
        this.select_kg_active = 0;
        $("#nextStep").text("下一步")
      }
      else if(this.select_kg_active == 0){
        if(this.currentRowName==""){
          this.$message({
            message: '请选择一个融合图谱',
            type: 'warning'
          });
        }
        else{
          this.loadMultipleSelectCandidateData(this.multipleCandidateKgCurrentPage,this.multipleCandidateKgPageSize);
          this.select_kg_active++;
          $("#nextStep").text("完成")
        }
      }
    },
    //关闭前动作
    handleSelectKgClose(){
      this.dialogAllKGVisible = false;
      //将信息还原
      $("#nextStep").text("下一步");
      this.select_kg_active = 0;
      this.multipleSelectionName = [];
      this.currentRowName ="";
      this.currentRowId="";
    },
    calculate(){
      console.log("开始计算")
    },
    //加载原图谱数据
    loadCandidateData(num,limit){
      //axios请求
      axios.request({
        method:"POST",
        url:'/api/candidateKg/getAllCandidateKg',
        params:{page:num,limit:limit}
      })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.mergeKgTable = response.data.data
              this.candidateKgTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //换页时动作
    candidateKgHandleCurrentChange(val){
      this.loadCandidateData(val,this.candidateKgPageSize)
    },
    //时间格式化
    dateFormat(data) {
      return moment(new Date(data).getTime()).format('YYYY-MM-DD');;

    },
    //table单选
    setCurrent(row) {
      this.$refs.selectMergeKgTable.setCurrentRow(row);
    },
    //选中时实时加载
    handleSelectCurrentChange(val) {
      this.currentRowName = val.name;
      this.currentRowId = val.id;
    },
    //加载原图谱数据
    loadMultipleSelectCandidateData(num,limit){
      //axios请求
      axios.request({
        method:"POST",
        url:'/api/candidateKg/getAllCandidateKg',
        params:{page:num,limit:limit}
      })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.multipleMergeKgTable = response.data.data
              this.multipleCandidateKgTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //翻页动作
    multipleCandidateKgHandleCurrentChange(){
      this.loadMultipleSelectCandidateData(val,this.multipleCandidateKgPageSize)
    },
    //选择候选图谱时的多选框动作
    multipleCandidateKgHandleSelectionChange(val){
      this.multipleSelection = val;
      if(val.length>2){
        this.$message({
          message: '最多选择两个融合图谱',
          type: 'warning'
        });
      }
      else{
        var selectionName=[];
        val.forEach(function (item){
          selectionName.push(item.name);
        });
       this.multipleSelectionName = selectionName;
      }
    },
    //去服务器请求所有候选图谱的数据
    async fetchFromKgData(candidateId){
      console.log("进入了")
      await axios.request({
        method:"POST",
        url:'/api/triples/getTriplesFromSameKgNotByPage',
        params:{id:candidateId}
      })
          .then((response) => {
            if (response.status == 200) {
              //向表中加载数据
              this.fromKgTableData.push(response.data.data);
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //开始导入数据
    importData(){
      if(this.currentRowId==""){
        this.$message({
          message: '请选择融合图谱!',
          type: 'warning'
        });
      }
      else if(this.multipleSelection.length==0){
        this.$message({
          message: '请选择候选图谱!',
          type: 'warning'
        });
      }
      //去请求数据
      else{
        this.toKgLoading = true;
        //加载toKgTable数据
        axios.request({
          method:"POST",
          url:'/api/triples/getTriplesFromSameKg',
          params:{page:this.toKgCurrentPage,limit:this.toKgPageSize,id:this.currentRowId}
        })
        .then(async (response) => {
          if (response.status == 200) {
            //向表中加载数据
            this.toKgTableData = response.data.data
            this.toKgTotal = response.data.count
            this.toKgLoading = false;
            this.fromKgLoading = true;
            for (const item of this.multipleSelection) {
              console.log("id: "+item.id);
              console.log(item);
              await axios.request({
                method:"POST",
                url:'/api/triples/getTriplesFromSameKgNotByPage',
                params:{id:item.id}
              })
              .then((response) => {
                if (response.status == 200) {
                  var list = response.data.data;
                  for(var triple of list){
                      //向表中加载数据
                      this.fromKgTableData.push(triple);
                  }
                  console.log(this.fromKgTableData);
                }
              })
              .catch(function (error) {
                console.log(error)
              })
            }
            await Promise.all(this.fromKgTableData);
            //分页
            this.getFromKgTableData(),
            this.fromKgLoading = false;
            this.$notify({
              title: '成功',
              message: '导入信息成功!',
              type: 'success'
            })
            //   //第一个表格是后端分页,第二个表格是前端分页
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      }
    },

    // // toKgTable分页改变动作
    toKgHandleCurrentChange(val){
      axios.request({
        method:"POST",
        url:'/api/triples/getTriplesFromSameKg',
        params:{page:val,limit:this.toKgPageSize,id:this.currentRowId}
      })
          .then((response) => {
            if (response.status == 200) {
              //向表中加载数据
              this.toKgTableData= response.data.data
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //fromKgTable的前端分页
    getFromKgTableData(){
      this.fromKgTotal = this.fromKgTableData.length;
      this.fromKgTablePageData = this.fromKgTableData.slice(
          (this.fromKgCurrentPage - 1) * this.fromKgPageSize,
          this.fromKgCurrentPage * this.fromKgPageSize
      );
      this.tableData1_total = this.allTriplesBeforeCheck.length
    },
    // fromKgTable的前端分页改变动作
    fromKgHandleCurrentChange(val){
      this.fromKgCurrentPage = val
      this.getFromKgTableData()
    },
    //清空
    allClear(){
      this. toKgTableData=[];
      this.fromKgTableData = [];
      this.fromKgTablePageData=[];
      this.multipleSelection=[];
      this.multipleSelectionName=[];
      this.currentRowName='';
      this.currentRowId='';
    }
  }
  // displayKgItems(){
  //   axios.post('/api/kg/getAllTriples', this.$qs.stringify({
  //     page: this.,
  //     limit: this.pageSize
  //   }),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
  //     this.loading = false;
  //     //登录成功
  //     if (response.data.code == 200) {
  //       const token = response.data.data.token
  //       const userinfo = response.data.data.userInfo
  //       store.commit('SET_TOKEN', token)
  //       store.commit('SET_USERINFO', userinfo)
  //       // 跳转登录界面
  //       this.$router.push('/')
  //     }
  // }
// },

}
</script>