<template>
  <div style="margin-top: 20px;">
    <el-tabs type="card" v-loading="loading">
      <el-tab-pane label="选择候选图谱">
        <el-button type="primary"  @click="dialogTableVisible = true; get_candidate_kgs(candidateKgCurrentPage,candidateKgPageSize);">读取候选图谱</el-button>
        <el-dialog title="读取候选图谱" :visible.sync="dialogTableVisible">
          <el-table
              :data="candidateKgPageList"
              border
              style="width: 100%; margin-top:10px"
              @selection-change="handleSelectionChange">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column label="名称(最新版本)" >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者" >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.creator }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="创建时间">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="最后修改时间" width>
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.changeTime}}</span>
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
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogTableVisible = false; readTriplesFromSelectedDataset(triplesCurrentPage, triplesPageSize)">确定</el-button>
          </div>
        </el-dialog>
        <el-button type="info" style="margin: 0px;">手动输入</el-button>
        <!-- <el-button type="primary" style="margin: 0px;">读取文件</el-button>
        <el-button type="primary" style="margin: 0px;">读取数据库</el-button> -->
        <el-button type="danger" @click="reset" style="margin: 0px;">重置</el-button>
        <el-table :data="triplesPageList">
        <el-table-column
          label="创建时间"
          prop="date">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.time }}</span>
        </template>
      </el-table-column>         
        <el-table-column
            label="源实体"
            prop="date">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.head }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="关系"
            prop="name">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.relation }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="目标实体"
            prop="name">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.tail }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            prop="name">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="triplesHandleSizeChange"
          @current-change="triplesHandleCurrentChange"
          :current-page="triplesCurrentPage"
          :page-sizes="triplesPageSizes"
          :page-size="triplesPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="triplesTotal">
      </el-pagination>
        <el-button type="primary" @click="dialogOfModelSelection = true; get_saved_models_list();" style="margin-top:10px;">开始检测</el-button>
        <el-dialog title="选择补全模型" :visible.sync="dialogOfModelSelection">
          <span style=" margin-right:10px"><font size="3">当前补全模型为<b>{{model_name}}</b></font></span>
          <el-table
            border
            ref="singleTable"
            :data="tableData4"
            highlight-current-row
            style="width: 100%; margin-top: 10px;">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="time"
              label="创建时间"
              width="250">
            </el-table-column>
            <el-table-column
              property="stem"
              label="模型名称"
              width ="200">
            </el-table-column>
            <el-table-column
              property="train_set"
              label="训练集"
              width="200">
            </el-table-column>
            <el-table-column
              property="Hits1"
              label="Hits@1" width="100">
            </el-table-column>
            <el-table-column
              property="Hits10"
              label="Hits@10" width="100">
            </el-table-column>
            <el-table-column width="100"
              property="MRR"
              label="MRR">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChange4"
            @current-change="currentChange4"
            :current-page="tableData4_page"
            :page-size="tableData4_size"
            :page-sizes="pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData4_total"
            style="margin-top: 10px;">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogOfModelSelection = false;">取消</el-button>
            <el-button type="primary" @click="dialogOfModelSelection = false; send_for_quality_inspection();">确定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="置信检测">
        <el-button type="info" style="margin: 0px;">手动输入</el-button>
        <el-button type="danger" @click="next" style="margin: 0px;">重置</el-button>
        <el-table
          :data="tableData2"
          border
          style="width: 100%; margin-top:10px">
          <el-table-column
            label="创建时间"
            width="230">
            <template slot-scope="scope">{{ scope.row.time }}</template>
          </el-table-column>
          <el-table-column
          label="三元组 (头实体,头实体类型,尾实体,尾实体类型,关系)"
          width= "600">
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.head }}</el-tag>
                  <!-- <el-tag size="medium">{{ scope.row.h_typ }}</el-tag> -->
                  <el-tag size="medium">{{ scope.row.tail }}</el-tag>
                  <!-- <el-tag size="medium">{{ scope.row.t_typ }}</el-tag> -->
                  <el-tag size="medium">{{ scope.row.relation }}</el-tag>
              </div>
          </template>
          </el-table-column>
          <el-table-column
          label="三元组分类结果"
          width="400">
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.res}}</span>
          </template>
          </el-table-column>       
          <el-table-column
          label="三元组来源"
          width="120">
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.from_where }}</span>
          </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChange2"
          @current-change="currentChange2"
          :current-page="tableData2_page"
          :page-size="tableData2_size"
          :page-sizes="pageSizes"
          key="page2"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData2_total"
          style="margin-top: 10px;">
        </el-pagination>
        <el-button type="primary" @click="insert_triples_to_neo4j();" style="margin-top:10px;">开始插入</el-button>
      </el-tab-pane>
      <el-tab-pane label="插入图谱">
        <el-button type="info" style="margin: 0px;">手动输入</el-button>
        <el-button type="danger" @click="next" style="margin: 0px;">重置</el-button>
        <el-table
          :data="tableData3"
          border
          style="width: 100%; margin-top:10px">
          <el-table-column
          label="插入时间"
          width="220">
          <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.time }}</span>
          </template>
          </el-table-column>
          <el-table-column
          label="三元组 (头实体,头实体类型,尾实体,尾实体类型,关系)"
          width = "600">
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.h }}</el-tag>
                  <el-tag size="medium">{{ scope.row.h_typ }}</el-tag>
                  <el-tag size="medium">{{ scope.row.t }}</el-tag>
                  <el-tag size="medium">{{ scope.row.t_typ }}</el-tag>
                  <el-tag size="medium">{{ scope.row.r }}</el-tag>
              </div>
          </template>
          </el-table-column>
          <el-table-column
          label="插入结果"
          width="500">
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.res }}</span>
          </template>
          </el-table-column>
          <el-table-column
          label="三元组来源"
          width="120">
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.from_where }}</span>
          </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChange3"
          @current-change="currentChange3"
          :current-page="tableData3_page"
          :page-size="tableData3_size"
          :page-sizes="pageSizes"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData3_total"
          style="margin-top: 10px;">
        </el-pagination>
        <el-button type="warning" style="margin-top:10px">冲突处理</el-button>
      </el-tab-pane>
      <el-tab-pane label="链接预测">
        <el-button type="primary" @click="link_prediction" style="margin: 0px;">开始识别</el-button>
        <el-button type="danger" @click="CleanLinkPredictionResult" style="margin: 0px;">重置</el-button>
        <el-input
        style="display: block;margin-top:10px;"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 20}"
        placeholder="请输入内容"
        v-model="TriplesBeforeLinkPrediction"
        >
        </el-input>
        <el-card shadow="always"  class="ner_card">
          <h4 class="ner_label">链接预测结果</h4>
          <span class="ner_result" id="ner_result" style="margin-top:10px">{{LinkPredictionResult}}</span>
        </el-card>      
      </el-tab-pane>
      <el-tab-pane label="模型管理">
        <el-table
          :data="tableData4"
          style="width: 100%; "
          border
          max-height="350">
          <el-table-column
            prop="time"
            label="创建时间"
            width="250">
          </el-table-column>
          <el-table-column
            prop="stem"
            label="模型名称"
            width="200">
          </el-table-column>
          <el-table-column
            prop="train_set"
            label="训练数据"
            width="200">
          </el-table-column>
          <el-table-column
            prop="Hits1"
            label="Hits@1"
            width="">
          </el-table-column>
          <el-table-column
            prop="Hits10"
            label="Hits@10"
            width="">
          </el-table-column>
          <el-table-column
            prop="MRR"
            label="MRR"
            width="">
          </el-table-column>
          <el-table-column
            label="操作"
            width="">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, modelSelectionTable)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChange4"
          @current-change="currentChange4"
          :current-page="tableData4_page"
          :page-size="tableData4_size"
          :page-sizes="pageSizes"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData4_total"
          style="margin-top: 10px;">
        </el-pagination>
        <el-card id="gpu_status" el-card shadow="always" style="height:360px; width:420px;float: left; margin-top:10px; margin-right: 10px;"></el-card>
        <el-card id="cpu_status" el-card shadow="always" style="height:360px; width:420px;float: left; margin-top:10px; margin-right: 10px;"></el-card>
        <el-card shadow="always" style="margin-top:10px; width:auto; height:360px;" v-loading="trainLoading" element-loading-text="拼命训练中">
          <el-form ref="form" :model="form" label-width="80px">
            <b>训练新模型</b>
            <el-form-item label="选择模型" style="margin-top:15px">
              <el-select v-model="form.model" placeholder="图谱嵌入模型">
                <el-option label="ConvE" value="shanghai"></el-option>
                <el-option label="SE-GNN" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="新模型名称">
              <el-input v-model="form.name" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="数据集路径">
              <el-input v-model="form.path" style="width:400px;"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="批次大小" style="width:200px; margin-bottom:0px;">
                  <el-input v-model="form.batch"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="迭代次数" style="width:200px; margin-left:30px;">
                  <el-input v-model="form.epoch"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button type="primary" @click="train_model();get_updating_train_log();">开始训练</el-button>
        </el-card>
        <el-card shadow="always"  class="ner_card" v-loading="loading">
          <h4 class="ner_label">训练日志</h4>
            <el-input
              style="display: block;margin-top:10px;"
              type="textarea"
              :rows="5"
              placeholder="没有训练进行..."
              v-model="resultAfterTrainNewModel"
              >
            </el-input>
        </el-card>
      </el-tab-pane>
    </el-tabs> 
  </div>
</template>
<style>
.ner_card{
  margin-top: 10px;
  margin-bottom: 10px;
  max-height:500px;
}
.ner_label{
  margin: 0px;
}
p {
  word-break: break-all;
  word-wrap: break-word;
  text-indent: 2em;
}
.ner_result{
  word-break: normal;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
</style>
<script>
  import * as echarts from 'echarts';
  export default {
    data() {
      return {
        // 右侧三元组显示
        triplesPageList:[],
        triplesCurrentPage: 1,
        triplesTotal: 0,
        triplesPageSize: 10,
        triplesPageSizes: [10, 20, 30, 50],
        // 选中补全模型的表格，放置在dialog中
        modelSelectionTable: [],
        dialogOfModelSelection: false, // 设置补全模型dialog显示的boolean变量
        currentRow: null, //补全模型的选中行
        loading :false,
        triplesBeforeInsert:[],
        resultAfterInsert:[],
        //展示候选图谱的分页
        candidateKgPageList:[],
        candidateKgCurrentPage: 1,
        candidateKgTotal: 0,
        candidateKgPageSize: 10,
        candidateKgPageSizes: [10, 50, 100, 200],
        //读取候选数据集后的分页
        tableData1_page: 1,
        tableData2_page: 1,
        tableData3_page: 1,
        tableData4_page: 1,
        tableData5_page: 1,
        tableData1_size: 10,
        tableData2_size: 10,
        tableData3_size: 10,
        tableData4_size: 5,
        tableData5_size: 5,
        tableData1_total: 0,
        tableData2_total: 0,
        tableData3_total: 0,
        tableData4_total: 0,
        tableData5_total: 0,
        tableData1 : [],
        tableData2 : [],
        tableData3 : [],
        tableData4 : [],
        tableData5 : [],
        pageSizes:[5,10,20,30,40,50,60],
        allTriplesBeforeCheck:[],
        gridData:[],
        datasets_path: 'E:/KG_system_service/candidate_datasets',
        saved_model_path: 'E:/KG_system_service/KGtest/ConvE/models',
        dialogTableVisible: false,
        model_name:'ConvE_2022_10_7_9_45.h5',
        multipleSelection: [],
        selectedDatasets:[],
        TriplesBeforeLinkPrediction:"育空号补给舰,制造厂\n尼米兹号航空母舰,执行官\n马修·托德,同事\n大卫·凯悦,同事\n以赛亚·因凡特,家庭信息\n邦克山号导弹巡洋舰,指挥军士长\n第9驱逐舰中队,巡洋舰\n约书亚 B.乔纳,家庭信息\n亚伦·温伯利,国籍\n普林斯顿号导弹巡洋舰,指挥官",
        LinkPredictionResult: '',
        trainingVisible: false,
        trainLoading: false,
        train_success: false,
        resultAfterTrainNewModel: '',
        form: {
          name: 'ConvE_2022_11_16',
          model: 'ConvE',
          path:'E:/KG_system_service/candidate_datasets/',
          batch:'128',
          epoch: '600'
        },
        formLabelWidth: '120px', //表单样式
      }
    },
    methods: {
      //处理页容量改变事件
      triplesHandleSizeChange(val) {
        //修改当前分页大小
        this.triplesPageSize= val;
        //重新请求数据
        this.readTriplesFromSelectedDataset(this.triplesCurrentPage, val)
      },
      //翻页动作
      triplesHandleCurrentChange(val) {
        this.readTriplesFromSelectedDataset(val, this.triplesPageSize)
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
      //tableData1获取表格数据，自行分页
      getTableData(){
        //allData为全部数据
        this.tableData1 = this.allTriplesBeforeCheck.slice(
          (this.tableData1_page - 1) * this.tableData1_size,
          this.tableData1_page * this.tableData1_size
        );
        this.tableData1_total = this.allTriplesBeforeCheck.length
      },
      currentChange(val){
        this.tableData1_page = val
        this.getTableData()
      },
      sizeChange(val){
        this.tableData1_size = val
        this.tableData1_page = 1
        this.getTableData()
      },
      //tableData2获取表格数据，自行分页
      getTableData2(){
        //allData为全部数据
        this.tableData2 = this.triplesBeforeInsert.slice(
          (this.tableData2_page - 1) * this.tableData2_size,
          this.tableData2_page * this.tableData2_size
        );
        this.tableData2_total = this.triplesBeforeInsert.length
      },
      currentChange2(val){
        this.tableData2_page = val
        this.getTableData2()
      },
      sizeChange2(val){
        this.tableData2_size = val
        this.tableData2_page = 1
        this.getTableData2()
      },
      //tableData3获取表格数据，自行分页
      getTableData3(){
        //allData为全部数据
        this.tableData3 = this.resultAfterInsert.slice(
          (this.tableData3_page - 1) * this.tableData3_size,
          this.tableData3_page * this.tableData3_size
        );
        this.tableData3_total = this.resultAfterInsert.length
      },
      currentChange3(val){
        this.tableData3_page = val
        this.getTableData3()
      },
      sizeChange3(val){
        this.tableData3_size = val
        this.tableData3_page = 1
        this.getTableData3()
      },
      //tableData4获取表格数据，自行分页
      getTableData4(){
        //allData为全部数据
        this.tableData4 = this.modelSelectionTable.slice(
          (this.tableData4_page - 1) * this.tableData4_size,
          this.tableData4_page * this.tableData4_size
        );
        this.tableData4_total = this.modelSelectionTable.length
      },
      currentChange4(val){
        this.tableData4_page = val
        this.getTableData4()
      },
      sizeChange4(val){
        this.tableData4_size = val
        this.tableData4_page = 1
        this.getTableData4()
      },
      // 候选数据集的多项选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }, 
      //读取候选三元组中的数据
      readTriplesFromSelectedDataset(num, limit){
        console.log('确实来这里了')
        console.log(this.multipleSelection[0]['id'])
        axios.request({
          method:"POST",
          url:'/api/triples/getTriplesFromSameKg',
          params:{page:num,limit:limit,id:this.multipleSelection[0]['id']}
        })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.triplesPageList = response.data.data
              this.triplesTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },  
      //送给后端质检服务
      send_for_quality_inspection(){
        //如果为空，提示
        //triplesPageList
        if(this.triplesPageList.length == 0){
          this.$message({
            type: 'warning',
            message: '请输入信息'
          });
        }
        else{
          this.loading = true;
          //axios请求
          axios.post('/pythonApi/triple_classification',{
            //triplesPageList
            data: this.triplesPageList,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '置信度检测完毕',
                message: h('i', { style: 'color: teal'}, '已选三元组置信度检测完毕！'),
                offset: 100
              });
              //赋值给表格
              this.triplesBeforeInsert = response.data.data;
              this.getTableData2();
              //设置文本高亮
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      }, 
      //插入图谱服务
      insert_triples_to_neo4j(){
        //如果为空，提示
        if(this.triplesBeforeInsert.length == 0){
          this.$message({
            type: 'warning',
            message: '请输入信息'
          });
        }
        else{
          this.loading = true;
          //axios请求
          axios.post('/pythonApi/insert_triples_to_neo4j',{
            data: this.triplesBeforeInsert,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '插入完毕',
                message: h('i', { style: 'color: teal'}, '通过质检的三元组已插入图谱！'),
                offset: 100
              });
              //赋值给表格
              this.resultAfterInsert = response.data.data;
              this.getTableData3();
               //设置文本高亮
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      //读取候选数据集的三元组数目
      get_candidate_datasets(){
        let content = this.datasets_path;
        //如果为空，提示
        if(content==""){
          this.$message({
            type: 'warning',
            message: '请输入信息'
          });
        }
        else{
          this.loading = true;
          //axios请求
          axios.post('/pythonApi/get_candidate_datasets',{})
          .then((response)=>{
            if (response.status == 200) {
              //赋值给表格
              this.gridData= response.data.data;
               //设置文本高亮
              // this.setHeightKeyWord(arr);
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      //读取保存好的模型
      get_saved_models_list(){
        let content = this.saved_model_path;
        //如果为空，提示
        if(content==""){
          this.$message({
            type: 'warning',
            message: '请输入信息'
          });
        }
        else{
          this.loading = true;
          //axios请求
          axios.post('/pythonApi/get_saved_models_list',{})
          .then((response)=>{
            if (response.status == 200) {
              //赋值给表格
              this.modelSelectionTable = response.data.data;
               //设置文本高亮
              this.loading = false;
              this.getTableData4();
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      //请求链接预测服务
      link_prediction(){
        let content = this.TriplesBeforeLinkPrediction;
        //如果为空，提示
        if(content==""){
          this.$message({
            type: 'warning',
            message: '请输入待预测三元组！'
          });
        }
        else{
          this.loading = true;
          //axios请求
          axios.post('/pythonApi/link_prediction',{
            data: this.TriplesBeforeLinkPrediction,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '链接预测完毕',
                message: h('i', { style: 'color: teal'}, '链接预测结果已加载！'),
                offset: 100
              });
              //赋值给表格
              this.LinkPredictionResult = ""
              for (var i = 0; i <response.data.data.res_str.length; i ++){
                this.LinkPredictionResult += response.data.data.res_str[i] + '\n'
              }
              this.extract_table= response.data.data.preds;
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      //请求训练模型服务
      train_model(){
        let content = this.form['name'];
        //如果为空，提示
        if(content==""){
          this.$message({
            type: 'warning',
            message: '请输入训练参数！'
          });
        }
        else{
          this.trainLoading = true;
          this.train_success = false;
          //axios请求
          axios.post('/pythonApi/train_new_model',{
            data: this.form,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '训练完毕',
                message: h('i', { style: 'color: teal'}, '训练成功，模型已保存！'),
                offset: 100
              });
              this.trainLoading = false;
              this.train_success = true;
              this.get_saved_models_list();
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      //轮询请求日志
      get_updating_train_log(){
        var _time; 
        _time = setInterval(() => {
          axios.post('/pythonApi/get_train_log',{
          }).then((response)=>{
            if (response.status == 200) {
              this.resultAfterTrainNewModel = response.data.data;
              }
          });
          if(this.train_success == true){
            clearInterval(_time);
          }
        },1000)
      },
      //重置整个流程中的内容
      reset(){
        this.tableData1 = [],
        this.tableData2 = [],
        this.tableData3 = [],
        this.allTriplesBeforeCheck = [],
        this.triplesBeforeInsert = [],
        this.resultAfterInsert = []
      },
      //重置链接预测输入和结果
      CleanLinkPredictionResult(){
        this.LinkPredictionResult = '',
        this.TriplesBeforeLinkPrediction = []
      },
      //删除模型操作
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      //获取gpu状态:每2秒请求一次
      get_gpu_status(){
        var chartDom = document.getElementById('gpu_status');
        var myChart = echarts.init(chartDom);
        var option;
        //请求cpu占用数据
        function get_status_of_gpu(callback){
          //axios请求
          axios.post('/pythonApi/get_status_of_gpu',{
          })
          .then((response)=>{
            if (response.status == 200) {
              callback(response.data.data);
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        };
        function random_30_data(i) {
          var t=new Date();//你已知的时间
          var t_s=t.getTime();//转化为时间戳毫秒数
          var nt=new Date();//定义一个新时间
          nt.setTime(t_s-1000*(i));//设置新时间比旧时间多一分钟
          return {
            name: nt.toString(),
            value: [nt,0]
          };
        };
        function randomData(cpuData) {
          let now = new Date();
          return {
            name: now.toString(),
            value: [
              now,
              cpuData
            ]
          };
        };
        let data = [];
        for (var i = 60; i > 0; i -= 2) {
          data.push(random_30_data(i));
        };
        option = {
          title: {
            text: 'GPU:0 内存使用率',
            textStyle:{
              lineHeight:50,
              line:50,
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              var date = new Date(params.name);
              return (
                date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear() +
                ' : ' +
                params.value[1]
              );
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            min: 0,
	          max: 100,
            splitLine: {
              show: false
            }
          },
          grid:{
            top:60,
            x:45,
            x2:30,
            y2:30,
          },
          series: [
            {
              name: 'Fake Data',
              type: 'line',
              showSymbol: false,
              data: data
            }
          ]
        };
        
        setInterval(function () {
            get_status_of_gpu(function(arr){
                if(60 < data.length) 
                  data.shift();
                data.push(randomData(arr));
                myChart.setOption({
                series: [
                  {
                    data: data
                  }
                ]
              });
            });
        }, 2000);

        option && myChart.setOption(option);
      },
      //获取cpu状态:每2秒请求一次
      get_cpu_status(){
        var chartDom = document.getElementById('cpu_status');
        var myChart = echarts.init(chartDom);
        var option;
        //请求cpu占用数据
        function get_status_of_cpu(callback){
          //axios请求
          axios.post('/pythonApi/get_status_of_cpu',{
          })
          .then((response)=>{
            if (response.status == 200) {
              callback(response.data.data);
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        };
        function random_30_data(i) {
          var t=new Date();//你已知的时间
          var t_s=t.getTime();//转化为时间戳毫秒数
          var nt=new Date();//定义一个新时间
          nt.setTime(t_s-1000*(i));//设置新时间比旧时间多一分钟
          return {
            name: nt.toString(),
            value: [nt,0]
          };
        };
        function randomData(cpuData) {
          let now = new Date();
          return {
            name: now.toString(),
            value: [
              now,
              cpuData
            ]
          };
        };
        let data = [];
        for (var i = 60; i > 0; i -= 2) {
          data.push(random_30_data(i));
        };
        option = {
          title: {
            text: 'CPU 内存使用率',
            textStyle:{
              lineHeight:50,
              line:50,
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              var date = new Date(params.name);
              return (
                date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear() +
                ' : ' +
                params.value[1]
              );
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            min: 0,
	          max: 100,
            boundaryGap: [0, '100%'],
            splitLine: {
              show: false
            }
          },
          grid:{
            top:60,
            x:45,
            x2:30,
            y2:30,
          },
          series: [
            {
              name: 'Fake Data',
              type: 'line',
              showSymbol: false,
              data: data
            }
          ]
        };
        
        setInterval(function () {
            get_status_of_cpu(function(arr){
                if(60 < data.length) 
                  data.shift();
                data.push(randomData(arr));
                myChart.setOption({
                series: [
                  {
                    data: data
                  }
                ]
              });
            });
        }, 2000);

        option && myChart.setOption(option);
      },
    },
    mounted(){
      this.get_gpu_status()
      this.get_cpu_status()
    },
    created(){
      // this.get_saved_models_list();
    }
  }
</script>