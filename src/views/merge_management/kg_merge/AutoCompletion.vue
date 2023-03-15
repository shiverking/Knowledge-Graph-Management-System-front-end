<template>
  <div style="margin-top: 20px;">
    <cache></cache>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="基于智能匹配检测" name="first">
    <el-steps :active="active" finish-status="success" simple>
    <el-step title="链接预测"></el-step>
    <el-step title="预测提交"></el-step>
    </el-steps>
    <!--模型管理dialog-->
    <el-button @click="modelVisible=true;stop_read_gpu_cpu=false;startToGetGpuAndCpu();get_lpm_table();" style="margin-top:10px">模型管理</el-button>
    <el-dialog title="模型管理" :visible.sync="modelVisible" fullscreen="true" :before-close="closeModelView">
      <el-button type="primary" @click="open()">新建训练</el-button>
      <el-table
        :data="tableData4"
        border
        style="width: 100%; margin-top:10px">
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="model_name"
          label="模型名称"
          width="180">
        </el-table-column>
          <el-table-column
          label="训练状态">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" v-if="scope.row.train_status == true" :loading="scope.row.train_status">训练中</el-button>
              <el-button type="success" size="mini" v-if="scope.row.train_status != true">已训练</el-button>
            </template>
          </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <el-button type="danger" size="mini" @click="fun()">删除</el-button>
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
      <el-card id="gpu_status" el-card shadow="hover" style="height:360px; width:420px;float: left; margin-top:10px; margin-right: 10px;"></el-card>
      <el-card id="cpu_status" el-card shadow="hover" style="height:360px; width:420px;float: left; margin-top:10px; margin-right: 10px;"></el-card>
      <el-dialog title="新建训练" append-to-body :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="80px">
          <b>训练新模型</b>
          <el-form-item label="选择模型" style="margin-top:15px">
            <el-select disabled v-model="form.model" placeholder="图谱嵌入模型">
              <el-option label="ConvE" value="shanghai"></el-option>
              <el-option label="SE-GNN" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模型名称">
            <el-input v-model="form.name" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="选择数据">
            <el-input disabled v-model="form.path" style="width:400px;"></el-input>
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
        <el-button type="primary" @click="close();add_model_to_lpm_table();">开始训练</el-button>
      </el-dialog>
    </el-dialog>
    <div v-if="this.active==0">
      <div style="margin-top:10px">
        <p><b>选择待预测的实体和关系</b></p>
          <el-row class="demo-autocomplete">
              <el-select v-model="select1" style="margin-top:10px" placeholder="请选择模型">
                <el-option
                  v-for="item in mod_set"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-autocomplete
                class="inline-input"
                v-model="state1"
                clearable
                :fetch-suggestions="querySearch"
                placeholder="请选择实体"
                style="margin-left:10px"
                @select="handleSelect"
              ></el-autocomplete>
              <el-autocomplete
                class="inline-input"
                v-model="state2"
                clearable
                :fetch-suggestions="querySearch2"
                placeholder="请选择关系"
                style="margin-left:10px"
                @select="handleSelect2"
              ></el-autocomplete>
              <el-button 
              plain
              style="margin-left:10px" 
              @click="comm_entRel_pair">确定</el-button>
          </el-row>
      </div>
      <el-table
        :data="tableData1"
        border
        style="width: 100%; margin-top: 20px">
        <!-- <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column> -->
        <el-table-column
          prop="ent"
          label="实体"
          width="180">
        </el-table-column>
        <el-table-column
          prop="rel"
          label="关系">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="tableData1_page"
        :page-size="tableData1_size"
        :page-sizes="pageSizes"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData1_total"
        style="margin-top: 10px;">
      </el-pagination>
      <el-button type="primary" @click="link_prediction" style="margin-top: 20px;">开始识别</el-button>
      <el-tooltip class="item" effect="dark" content="预提交选择好的链接预测结果" placement="top-start">
        <el-button type="success" @click="applyResult" style="margin: 0px;margin-left:10px">应用</el-button>
      </el-tooltip>
      <el-table
          :data="tableData2"
          border
          :key="tableData2Key"
          style="width: 100%; margin-top: 20px">
        <el-table-column
            prop="head"
            label="头实体"
            >
        </el-table-column>
        <el-table-column
            prop="rel"
            label="关系"
            >
        </el-table-column>
        <el-table-column
            label="已选尾实体">
          <template slot-scope="scope">
            <span v-if="scope.row.tail==null">还未选择</span>
            <span v-if="scope.row.tail!=null">{{scope.row.tail}}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="尾实体预测结果">
        <template slot-scope="scope">
          <el-button type="text" @click="displayTailDetailTable(scope.row)">详情</el-button>
        </template>
        </el-table-column>
        <el-table-column
            label="链接状态">
          <template slot-scope="scope">
            <span v-if="scope.row.pred_form=='0'">“实体-关系”链接已存在</span>
            <span v-if="scope.row.pred_form=='1'">“实体-关系”链接不存在</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="time"
            label="时间">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange2"
        @current-change="currentChange2"
        :current-page="tableData2_page"
        :page-size="tableData2_size"
        :page-sizes="pageSizes"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData2_total"
        style="margin-top: 10px;">
      </el-pagination>
      <el-dialog
          title="预测概览"
          :visible.sync="tailDetailVisible">
        <el-table :data="tableData3">
          <el-table-column label="尾实体">
            <template slot-scope="scope">
              {{scope.row.tail}}
            </template>
          </el-table-column>
          <el-table-column label="预测概率">
            <template slot-scope="scope">
              {{scope.row.pred_prob}}
            </template>
          </el-table-column>
          <el-table-column label="选择尾实体">
            <template slot-scope="scope">
              <el-button type="success" icon="el-icon-check" circle @click="chooseTail(scope.row)"></el-button>
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
        <span slot="footer" class="tailDetail-footer">
            <el-button @click="tailDetailVisible = false">取 消</el-button>
            <el-button type="primary" @click="tailDetailVisible = false">确 定</el-button>
          </span>
      </el-dialog>
    </div>
    <div v-if="this.active==1">
      <el-table
          :data="confirmedDataTable"
          border
          v-loading = "comfirmedLoading"
          element-loading-text="正在提交中..."
          style="width: 100%">
        <el-table-column
            prop="head"
            label="头实体"
        >
        </el-table-column>
        <el-table-column
            prop="rel"
            label="关系"
        >
        </el-table-column>
        <el-table-column
            label="尾实体">
          <template slot-scope="scope">
            <span>{{scope.row.tail}}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="预测类型">
          <template slot-scope="scope">
            <span v-if="scope.row.pred_form=='0'">“实体-关系”链接已存在</span>
            <span v-if="scope.row.pred_form=='1'">“实体-关系”链接不存在</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="time"
            label="时间">
        </el-table-column>
      </el-table>
      </div>
    <div style="text-align: right;">
      <el-button style="margin-top: 12px;" v-if="this.active==1" @click="previous" >上一步</el-button>
      <el-popover
          placement="left"
          v-model="nextStepVisible">
        <p>确定将当前结果保存至缓存表,并进行下一步吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="nextStepVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="nextStepVisible = false;submitToCache();">确定</el-button>
        </div>
        <el-button type="primary" style="margin-top: 12px; margin-left:10px"  v-if="this.active==1" slot="reference" @click="nextStepVisible=true;">提交</el-button>
      </el-popover>
      <el-button type="primary" style="margin-top: 12px;" v-if="this.active==0" @click="next">下一步</el-button>
    </div>
  </el-tab-pane>
  <el-tab-pane disabled="handoff" label="基于本体规则检测" name="fourth">

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
  import Cache from "../../../components/merge_kg/Cache";
  import * as echarts from 'echarts';
  import moment from "moment";
  import $ from '../../../plugins/jquery.min.js';
  import dataTool from "echarts/extension/dataTool";
  export default {
    components:{
      Cache,
    },
    data() {
      return {
        tableData2Key: 0,
        activeName: 'first', //基于本体or基于算法选项卡flag
        mod_set: [], //模型集合，存储“选择框1”的内容
        ent_set: [], //实体集合，存储“可搜索查找1”的内容
        rel_set: [], //关系集合，存储“可搜索查找2”的内容
        select1: '', //“选择框1”已选内容
        state1: '', //“可搜索查找1”已选内容
        state2: '', //“可搜索查找2”已选内容
        entRel_pair_selected:[], //已选择的、待预测的“实体-关系对”数组
        tmpTable:[], //一个临时数组，用来存储entRel_pair_selected的值
        dialogFormVisible: false, 
        lpm_table: [],
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
        dialogTableVisible: false,
        multipleSelection: [],
        selectedDatasets:[],
        resultAfterTrainNewModel: '',
        form: {
          name: 'ConvE_2022_11_16',
          model: 'ConvE',
          path:'核心图谱全部三元组',
          batch:'128',
          epoch: '600'
        },
        formLabelWidth: '120px', //表单样式
        node_count: 0,
        edge_count: 0,
        node_label_count: 0,
        node_label_list: [],
        relation_label_count_list: [],
        //概览可视化
        overviewVisible:false,
        //模型可视化
        modelVisible:false,
        //步骤条
        active:0,
        nextStepVisible:false,
        //预测表格
        predTable:[],
        //尾实体详情dialog
        tailDetailVisible:false,
        //临时寄存尾实体结果的表
        temporaryTailDataTable:[],
        //当前选中行
        selectedRow:[],
        //待提交数据
        confirmedDataTable:[],
        comfirmedLoading:false,
        //概览加载
        overviewLoading:false,
        //停止加载gpu和cpu 数据
        stop_read_gpu_cpu:false,
      }
    },
    methods: {
      open(){
        this.dialogFormVisible = true
      },
      close(){
        this.dialogFormVisible = false;
      },
      next() {
        if(this.active==0){
          this.active++;
        }
        else if(this.active==1){
          // this.active++;
        }
      },
      previous() {
        this.active--;
      },
      //跳转到下一页上
      jumpToNext(){
        this.$router.push('/merge/kg/evaluation');
      },
      dateFormat(data) {
        return moment(new Date(data).getTime()).format('YYYY-MM-DD');
      },
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
        this.tableData1 = this.entRel_pair_selected.slice(
          (this.tableData1_page - 1) * this.tableData1_size,
          this.tableData1_page * this.tableData1_size
        );
        this.tableData1_total = this.entRel_pair_selected.length
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
        this.tableData2 = this.predTable.slice(
          (this.tableData2_page - 1) * this.tableData2_size,
          this.tableData2_page * this.tableData2_size
        );
        this.tableData2_total = this.predTable.length
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
        this.tableData3 = this.temporaryTailDataTable.slice(
          (this.tableData3_page - 1) * this.tableData3_size,
          this.tableData3_page * this.tableData3_size
        );
        this.tableData3_total = this.temporaryTailDataTable.length
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
        this.tableData4 = this.lpm_table.slice(
          (this.tableData4_page - 1) * this.tableData4_size,
          this.tableData4_page * this.tableData4_size
        );
        this.tableData4_total = this.lpm_table.length
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
              const h = this.$createElement;
              this.$notify({
                title: '添加完毕',
                message: h('i', { style: 'color: teal'}, '已选数据集中的三元组加载完毕！'),
                offset: 100
              });
              //赋值给表格
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
      },  
      //请求链接预测服务
      link_prediction(){
        let content = this.entRel_pair_selected;
        //如果为空，提示
        if(content==""){
          this.$message({
            type: 'warning',
            message: '请选择待预测三元组！'
          });
        }
        else{
          this.loading = true;
          //axios请求
          axios.post('/pythonApi/link_prediction',{
            data: this.entRel_pair_selected,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '链接预测完毕',
                message: h('i', { style: 'color: teal'}, '链接预测结果已加载！'),
                offset: 100
              });
              this.tmpTable = this.entRel_pair_selected
              this.entRel_pair_selected = [];
              this.getTableData();
              this.loading = false;
              //解析数据到表格显示
              this.decode_data(this.tmpTable,response.data.data.preds, response.data.data.linked_status);
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      //解析返回的结果,用于表格显示
      //输入第一个为预测字符串(先用这种形式)，第二个列表为预测结果preds[]
      decode_data(data,preds,linked_status){
          var res =[];
          var decodedData = [];
          for(var i = 0; i < data.length; i++){
            decodedData.push([data[i]['ent'],data[i]['rel']]);
            console.log(data[i]['ent'],data[i]['rel'])
          }
          for(var i =0;i<preds.length;i++){
            var origin = decodedData[i];
            var pred_res = [];
            preds[i].forEach(function(element) {
              pred_res.push({"tail":element[0],"pred_prob":element[2]});
            })
            res.push({"head":origin[0],"rel":origin[1],"time":this.dateFormat(new Date()),"pred_form":linked_status,"pred_res":pred_res});
          }
          this.predTable = res;
          this.getTableData2();
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
          //axios请求
          axios.post('/pythonApi/train_new_model',{
            data: this.form,
          })
          .then((response)=>{
            if (response.status == 200) {
              this.learning_finish(this.form['name'])
              const h = this.$createElement;
              this.$notify({
                title: '训练完毕',
                message: h('i', { style: 'color: teal'}, '训练成功，模型已保存！'),
                offset: 100
              });
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      add_model_to_lpm_table(){
        let content = this.form['name'];
        //如果为空，提示
        if(content==""){
          this.$message({
            type: 'warning',
            message: '请输入训练参数！'
          });
        }else{
        //axios请求
         axios.post('/pythonApi/add_model_to_lpm_table',{
          data: this.form,
        })
        .then((response)=>{
          if (response.status == 200) {
            //设置文本高亮
            this.get_lpm_table();
            this.train_model(this.form['name'])
          }
        })
        .catch(function (error) {
          console.log(error)
        })
        }
      },
      learning_finish(name){
        //axios请求
         axios.post('/pythonApi/learning_finish',{
          data: name,
        })
        .then((response)=>{
          if (response.status == 200) {
            //设置文本高亮
            this.get_lpm_table();
            this.load_modSet(); //加载模型集合
            }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //轮询请求日志
      get_lpm_table(){
         //axios请求
         axios.post('/pythonApi/get_lpm_table',{})
        .then((response)=>{
          if (response.status == 200) {
            //赋值给表格
            this.lpm_table = response.data.data;
            this.getTableData4();
            //设置文本高亮
            }
        })
        .catch(function (error) {
          console.log(error)
        })
        // var _time; 
        // _time = setInterval(() => {
        //   axios.post('/pythonApi/get_lpm_table',{
        //   }).then((response)=>{
        //     if (response.status == 200) {
        //       this.lpm_table = response.data.data;
        //       }
        //   });
        //   if(this.train_success == true){
        //     clearInterval(_time);
        //   }
        // },1000)
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
        var _this = this;
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
        var _time =setInterval(function () {
            get_status_of_gpu((arr)=>{
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
                //如果关闭窗口，则停止请求
              if(_this.stop_read_gpu_cpu == true) {
                clearInterval(_time);
              }
            });
        }, 2000);
        option && myChart.setOption(option);
      },
      //获取cpu状态:每2秒请求一次
      get_cpu_status(){
        var chartDom = document.getElementById('cpu_status');
        var myChart = echarts.init(chartDom);
        var option;
        var _this = this;
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
        var _time =setInterval(function () {
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
              if(_this.stop_read_gpu_cpu == true) {
                clearInterval(_time);
              }
            });
        }, 2000);
        option && myChart.setOption(option);
      },
      //处理模型管理界面打开事件
      startToGetGpuAndCpu() {
        setTimeout(()=>{
          this.get_gpu_status()
        },100)
        setTimeout(()=>{
          this.get_cpu_status()
        },100)
      },
      //关闭模型管理界面回调
      closeModelView(done){
          this.stop_read_gpu_cpu = true;
          done();
      },
      getRelationBar(){
        var chartDom = document.getElementById('relation_bar');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          title: {
            text: '关系排行'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          // grid: {
          //   left: '3%',
          //   right: '4%',
          //   bottom: '3%',
          //   containLabel: true
          // },
          grid:{
            top:60,
            x:80,
            x2:50,
            y2:30,
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.relation_label_count_list[0]
          },
          series: [
            {
              name: '关系数量',
              type: 'bar',
              color: 'orange',
              data: this.relation_label_count_list[1]
            },
          ]
        };
        option && myChart.setOption(option);
      },
      getEntityTypeBar(){
        var chartDom = document.getElementById('entity_type_bar');
        var myChart = echarts.init(chartDom);
        var option;
        // axios.post('/pythonApi/get_overview_of_completion',{
        //   })
        //   .then((response)=>{
        //     if (response.status == 200) {
        //       console.log(response.data)
        //       this.node_label_list = response.data['node_label_list']
        //       }
        //     console.log('我在这呢')
        //     console.log(this.node_label_list[0])
        //   })
        //   .catch(function (error) {
        //     console.log(error)
        //   })
        option = {
          title: {
            text: '实体类型对应的实例排行'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          // grid: {
          //   left: '3%',
          //   right: '4%',
          //   bottom: '3%',
          //   containLabel: true
          // },
          grid:{
            top:60,
            x:80,
            x2:50,
            y2:30,
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.node_label_list[0]
          },
          series: [
 
            {
              name: '实例数量',
              type: 'bar',
              color: 'black',
              data: this.node_label_list[1]
            }
          ]
        };
        option && myChart.setOption(option);
      },
      getBoxPlot(){
        var chartDom = document.getElementById('evaluation_lines');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          title: {
            text: '图谱嵌入指标'
          },
          legend: {
            top: "7%",
            data: ['MRR', 'Hits@1', 'Hits@10']
          },
          grid:{
            top:60,
            x:45,
            x2:50,
            y2:30,
          },
          xAxis: {
            type: 'category',
            data: ['11-4', '11-15', '11-16', '11-18', '11-20']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'MRR',
              type: 'line',
              data: [0.44, 0.47, 0.46, 0.39, 0.43]
            },
            {
              name: 'Hits@1',
              type: 'line',
              data: [0.23, 0.24, 0.25, 0.24, 0.26]
            },
            {
              name: 'Hits@10',
              type: 'line',
              data: [0.5, 0.57, 0.51, 0.52, 0.55]
            }
          ]
        };
        option && myChart.setOption(option);
      },
      get_overview_of_completion(){
          this.overviewLoading=true;
          //axios请求
          axios.post('/pythonApi/get_overview_of_completion',{
          })
          .then((response)=>{
            if (response.status == 200) {
              this.node_count = response.data['node_count']
              this.edge_count = response.data['edge_count']
              this.node_label_count = response.data['node_label_count']
              this.relation_label_count_list = response.data['relation_label_count_list']
              this.node_label_list = response.data['node_label_list']
              this.getRelationBar()
              this.getEntityTypeBar()
              this.getBoxPlot()
              this.overviewLoading=false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      //点击详情后将数据赋值给临时表，在dialog上显示
      displayTailDetailTable(row){
        this.temporaryTailDataTable = row.pred_res;
        this.getTableData3();
        this.tailDetailVisible = true;
        this.selectedRow = row;
      },
      chooseTail(row){
        this.selectedRow.tail = row.tail;
        this.selectedRow.pred_prob= row.pred_prob;
        // this.getTableData2();
        this.tableData2Key += 1;
      },
      //应用链接预测结果
      applyResult(){
        var newConfirmedDataTable=[];
        this.predTable.forEach(function (element){
            if(element.tail!=null){
              //深拷贝
              var newElement  =$.extend(true,{},element);
              delete newElement.pred_res;
              newConfirmedDataTable.push(newElement)
            }
          }
        )
        this.confirmedDataTable = newConfirmedDataTable;
        this.$message({
          message: '应用链接预测结果成功!',
          type: 'success'
        });
        this.predTable = [];
        this.entRel_pair_selected = [];
        this.getTableData2();
        this.select1 = '';
      },
      //将结果提交至缓存表
      submitToCache(){
        this.comfirmedLoading = true;
        axios.post('/api/triples/completionCoreKg',{
          res:this.confirmedDataTable,
        })
        .then((response) => {
          if (response.status == 200) {
            if(response.data.msg=="success"){
              this.comfirmedLoading = false;
              this.$message({
                showClose: true,
                message: '提交成功!',
                type: 'success'
              });
              this.jumpToNext();
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      querySearch(queryString, cb) {
        var ent_set = this.ent_set;
        var results = queryString ? ent_set.filter(this.createFilter(queryString)) : ent_set;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (ent_set) => {
          return (ent_set.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      querySearch2(queryString, cb) {
        var rel_sets = this.rel_sets;
        var results = queryString ? rel_sets.filter(this.createFilter2(queryString)) : rel_sets;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter2(queryString) {
        return (rel_set) => {
          return (rel_set.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      load_entSet() {
        //axios请求
        axios.post('/pythonApi/get_entSet',{})
        .then((response)=>{
          if (response.status == 200) {
            //赋值给表格
            this.ent_set = response.data.data;
            //设置文本高亮
            }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      load_relSet() {
        //axios请求
        axios.post('/pythonApi/get_relSet',{})
        .then((response)=>{
          if (response.status == 200) {
            //赋值给表格
            this.rel_sets = response.data.data;
            //设置文本高亮
            }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      load_modSet() {
        //axios请求
        axios.post('/pythonApi/get_modSet',{})
        .then((response)=>{
          if (response.status == 200) {
            //赋值给表格
            this.mod_set = response.data.data;
            //设置文本高亮
            }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      handleSelect(item) {
        console.log(item);
      },
      handleSelect2(item) {
        console.log(item);
      },  
      open_when_input_isIncomplete() {
        this.$message({
          showClose: true,
          message: '警告哦，这是一条警告消息',
          type: 'warning'
        });
      },
      open_when_input_isRepeat() {
        this.$message({
          showClose: true,
          message: '这是一条消息提示'
        });
      },
      comm_entRel_pair(){
        if (this.state1 != '' && this.state2 != ''){
          var entRel_pair = {'ent': this.state1, 'rel': this.state2 }
          this.entRel_pair_selected.push(entRel_pair)
          this.getTableData()
          // }
        }else{
          this.open_when_input_isIncomplete();
        }
        this.state1 = '';
        this.state2 = '';
      }    
    },
    mounted(){
      this.load_entSet(); //加载实体集合
      this.load_relSet(); //加载关系集合
      this.load_modSet(); //加载模型集合
    },
  }
</script>