<template>
  <div style="margin-top: 20px;">
    <el-tabs type="border-card" v-loading="loading">
      <el-tab-pane label="读取数据">
        <el-button type="primary"  @click="dialogTableVisible = true; get_candidate_datasets()">读取数据集</el-button>
        <el-dialog title="选择候选数据集" :visible.sync="dialogTableVisible">
          <el-table
            ref="multipleTable"
            :data="gridData"
            tooltip-effect="dark"
            border
            style="width; margin-top: 10px;"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width>
            </el-table-column>
            <el-table-column
              label="创建时间"
              width>
              <template slot-scope="scope">{{ scope.row.time }}</template>
            </el-table-column>
            <el-table-column
              prop="stem"
              label="数据集名称"
              width>
            </el-table-column>
            <el-table-column
              prop="num_of_triples"
              label="三元组数目"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :total="50">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogTableVisible = false; readTriplesFromSelectedDataset()">确定</el-button>
          </div>
        </el-dialog>
        <el-button type="info" style="margin: 0px;">手动输入</el-button>
        <!-- <el-button type="primary" style="margin: 0px;">读取文件</el-button>
        <el-button type="primary" style="margin: 0px;">读取数据库</el-button> -->
        <el-button type="danger" @click="reset" style="margin: 0px;">重置</el-button>
        <el-table
          :data="tableData1"
          border
          style="width: 100%; margin-top:10px">
          <el-table-column
          label="创建时间"
          width="250">
          <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.time }}</span>
          </template>
          </el-table-column>
          <el-table-column
          label="三元组 (头实体,头实体类型,尾实体,尾实体类型,关系)"
          width>
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
          label="三元组来源"
          width="180">
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.from_where }}</span>
          </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
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
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="tableData1_page"
          :page-size="tableData1_size"
          key="page1"
          :page-sizes="pageSizes"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData1_total"
          style="margin-top: 10px;">
        </el-pagination>
        <el-button type="primary" @click="dialogOfModelSelection = true" style="margin-top:10px;">开始检测</el-button>
        <el-dialog title="选择补全模型" :visible.sync="dialogOfModelSelection">
          <span style="margin-top; margin-right:10px"><font size="3">当前补全模型为<b>{{model_name}}</b></font></span>
          <el-table
            border
            ref="singleTable"
            :data="modelSelectionTable"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%; margin-top: 10px;">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="time"
              label="创建时间"
              width>
            </el-table-column>
            <el-table-column
              property="model_name"
              label="模型名称"
              width>
            </el-table-column>
            <el-table-column
              property="train_set"
              label="训练集">
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
            layout="prev, pager, next"
            :total="50">
          </el-pagination>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogOfModelSelection = false;">取消</el-button>
            <el-button type="primary" @click="dialogOfModelSelection = false; send_for_quality_inspection();">确定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="置信检测">
        <el-button type="primary"  @click="next">读取数据集</el-button>
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
                  <el-tag size="medium">{{ scope.row.h }}</el-tag>
                  <el-tag size="medium">{{ scope.row.h_typ }}</el-tag>
                  <el-tag size="medium">{{ scope.row.t }}</el-tag>
                  <el-tag size="medium">{{ scope.row.t_typ }}</el-tag>
                  <el-tag size="medium">{{ scope.row.r }}</el-tag>
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
        <el-button type="primary"  @click="next">读取数据集</el-button>
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
          :data="modelSelectionTable"
          style="width: 100%; margin-top:;"
          border
          max-height="250">
          <el-table-column
            prop="time"
            label="创建时间"
            width="200">
          </el-table-column>
          <el-table-column
            prop="model_name"
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
          background
          layout="prev, pager, next"
          style="margin-top:10px"
          :total="1000">
        </el-pagination>
        <el-card id="gpu_status" el-card shadow="never" style="height:360px; width:420px;float: left; margin-top: 10px; margin-right: 10px;"></el-card>
        <el-card id="cpu_status" el-card shadow="never" style="height:360px; width:420px;float: left; margin-top: 10px; margin-right: 10px;"></el-card>
        <el-card shadow="never" style="margin-top:10px; width:auto; height:360px;">
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
          <el-button type="primary" @click="trainingVisible = true; start();">开始训练</el-button>
          <el-dialog title="训练中..." :visible.sync="trainingVisible">
            <div slot="footer" class="dialog-footer">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" style="margin-bottom:10px" status="success"></el-progress>
              <el-button @click="trainingVisible = false">取消</el-button>
              <el-button type="primary" @click="trainingVisible = false;">确定</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-tab-pane>
    </el-tabs> 
  </div>
</template>
<style>
.ner_card{
  margin-top: 10px;
  margin-bottom: 10px;
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
        // 选中补全模型的表格，放置在dialog中
        modelSelectionTable: [{
          time: '2022-11-7-9-45',
          model_name: 'ConvE_2022_11_7_9_45',
          train_set: '十一航母打击群demo',
          Hits1: '0.0',
          Hits10: '0.0',
          MRR: '0.0',
        },{
          time: '2022-11-15-9-49',
          model_name: 'ConvE_2022_11-15_9_49',
          train_set: '十一航母打击群demo',
          Hits1: '0.0',
          Hits10: '0.0',
          MRR: '0.0',
        },],
        dialogOfModelSelection: false, // 设置补全模型dialog显示的boolean变量
        currentRow: null, //补全模型的选中行
        loading :false,
        triplesBeforeInsert:[],
        resultAfterInsert:[],
        //读取候选数据集后的分页
        tableData1_page: 1,
        tableData2_page: 1,
        tableData3_page: 1,
        tableData1_size: 10,
        tableData2_size: 10,
        tableData3_size: 10,
        tableData1_total: 0,
        tableData2_total: 0,
        tableData3_total: 0,
        tableData1 : [],
        tableData2 : [],
        tableData3 : [],
        pageSizes:[10,20,30,40,50,60],
        allTriplesBeforeCheck:[],
        gridData:[],
        datasets_path: 'E:/KG_system_service/candidate_datasets',
        dialogTableVisible: false,
        model_name:'ConvE_2022_10_7_9_45.h5',
        multipleSelection: [],
        selectedDatasets:[],
        TriplesBeforeLinkPrediction:"育空号补给舰,制造厂\n尼米兹号航空母舰,执行官\n马修·托德,同事\n大卫·凯悦,同事\n以赛亚·因凡特,家庭信息\n邦克山号导弹巡洋舰,指挥军士长\n第9驱逐舰中队,巡洋舰\n约书亚 B.乔纳,家庭信息\n亚伦·温伯利,国籍\n普林斯顿号导弹巡洋舰,指挥官",
        LinkPredictionResult: '',
        trainingVisible: false,
        form: {
          name: 'ConvE_2022_11_16',
          model: 'ConvE',
          path:'E:/KG_system_service/candidate_datasets/',
          batch:'128',
          epoch: '600'
        },
        formLabelWidth: '120px',
        percentage : 0
      }
    },
    methods: {
      //tableData1获取表格数据，自行分页
      getTableData(){
        //allData为全部数据
        this.tableData1 = this.allTriplesBeforeCheck.slice(
          (this.tableData1_page - 1) * this.tableData1_size,
          this.tableData1_page * this.tableData1_size
        );
        this.tableData1_total = this.allTriplesBeforeCheck.length
      },
      //page改变时的回调函数，参数为当前页码
      currentChange(val){
        this.tableData1_page = val
        this.getTableData()
      },
      //size改变时回调的函数，参数为当前的size
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
      //page改变时的回调函数，参数为当前页码
      currentChange2(val){
        this.tableData2_page = val
        this.getTableData2()
      },
      //size改变时回调的函数，参数为当前的size
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
      //page改变时的回调函数，参数为当前页码
      currentChange3(val){
        this.tableData3_page = val
        this.getTableData3()
      },
      //size改变时回调的函数，参数为当前的size
      sizeChange3(val){
        this.tableData3_size = val
        this.tableData3_page = 1
        this.getTableData3()
      },

      // 候选数据集的多项选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }, 
      readTriplesFromSelectedDataset(){
        for (var j = 0; j < this.multipleSelection.length; j ++){
          this.selectedDatasets.push(this.multipleSelection[j]['stem'])
        }
        let content = this.selectedDatasets;
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
          axios.post('/pythonApi/load_triples_from_candidate_datasets',{
            data: this.selectedDatasets,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '添加完毕',
                message: h('i', { style: 'color: teal'}, '已选数据集中的三元组加载完毕！'),
                offset: 100
              });
              //赋值给表格
              this.allTriplesBeforeCheck = response.data.data;
              this.getTableData();
              console.log(this.allTriplesBeforeCheck)
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
        this.selectedDatasets = []
      },  
      send_for_quality_inspection(){
        //如果为空，提示
        if(this.allTriplesBeforeCheck.length == 0){
          this.$message({
            type: 'warning',
            message: '请输入信息'
          });
        }
        else{
          this.loading = true;
          //axios请求
          axios.post('/pythonApi/triple_classification',{
            data: this.allTriplesBeforeCheck,
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
              // const h = this.$createElement;
              // this.$notify({
              //   title: '标题名称',
              //   message: h('i', { style: 'color: teal'}, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
              // });
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
      link_prediction(){
        let content = this.TriplesBeforeLinkPrediction;
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
          axios.post('/pythonApi/link_prediction',{
            data: this.TriplesBeforeLinkPrediction,
          })
          .then((response)=>{
            if (response.status == 200) {
              this.$message({
                type: 'success',
                message: '抽取成功!'
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
      //重置内容
      reset(){
        this.tableData1 = [],
        this.tableData2 = [],
        this.tableData3 = [],
        this.allTriplesBeforeCheck = [],
        this.triplesBeforeInsert = [],
        this.resultAfterInsert = []
      },
      CleanLinkPredictionResult(){
        this.LinkPredictionResult = '',
        this.TriplesBeforeLinkPrediction = []
      },
      start() {
        while(this.percentage <= 100){
          this.percentage += 10
        }
      },
      end() {
          this.percentage = 0
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      get_gpu_status(){
        var chartDom = document.getElementById('gpu_status');
        var myChart = echarts.init(chartDom);
        var option;

        function randomData() {
          now = new Date(+now + oneDay);
          value = value + Math.random() * 21 - 10;
          return {
            name: now.toString(),
            value: [
              [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
              Math.round(value)
            ]
          };
        }
        let data = [];
        let now = new Date(1997, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        let value = Math.random() * 1000;
        for (var i = 0; i < 1000; i++) {
          data.push(randomData());
        }
        option = {
          title: {
            text: 'GPU:0内存使用率',
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
          for (var i = 0; i < 5; i++) {
            data.shift();
            data.push(randomData());
          }
          myChart.setOption({
            series: [
              {
                data: data
              }
            ]
          });
        }, 1000);

        option && myChart.setOption(option);
      },

      get_cpu_status(){
        var chartDom = document.getElementById('cpu_status');
        var myChart = echarts.init(chartDom);
        var option;

        function randomData() {
          now = new Date(+now + oneDay);
          value = value + Math.random() * 21 - 10;
          return {
            name: now.toString(),
            value: [
              [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
              Math.round(value)
            ]
          };
        }
        let data = [];
        let now = new Date(1997, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        let value = Math.random() * 1000;
        for (var i = 0; i < 1000; i++) {
          data.push(randomData());
        }
        option = {
          title: {
            text: 'CPU内存使用率',
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
          for (var i = 0; i < 5; i++) {
            data.shift();
            data.push(randomData());
          }
          myChart.setOption({
            series: [
              {
                data: data
              }
            ]
          });
        }, 1000);

        option && myChart.setOption(option);
      },
    },
    mounted(){
      this.get_gpu_status()
      this.get_cpu_status()
    }
  }
</script>