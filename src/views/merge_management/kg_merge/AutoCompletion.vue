<template>
  <div style="margin-top: 20px;">
    <cache></cache>
    <el-tabs v-model="activeName" type="card" style="margin-top:10px;" @tab-click="handleClick">
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="完整性检测"></el-step>
        <el-step title="链接预测"></el-step>
        <el-step title="链接补全"></el-step>
        <el-step title="预测提交"></el-step>
      </el-steps>
      <div v-if="this.active==0">
        <el-card shadow="never" style="float:left; margin-right:10px; width:30%; height:100%; margin-top">
          <el-tree
              :props="props"
              :data = "ontologyTreeData"
              node-key="id"
              ref="tree"
              :check-strictly="true"
              :highlight-current="true"
              :accordion="true"
              @node-click="handleCheckChange"
              >
          </el-tree>
        </el-card>
        <el-card shadow="never" style="margin-right:;margin-top:10px;width:;height:100%;">
          <el-input-number @change="changeNumber()" v-model="num" :precision="1" :step="0.1" :max="1" :min="0" style="margin-bottom: 10px;"></el-input-number>
          <span style="margin-left: 10px;">完整性检测阈值</span>
          <el-table
            border
            :data="tableData7"
            style="width: 100%">
            <el-table-column
              prop="label"
              label="类别"
              width>
            </el-table-column>
            <el-table-column
              prop="ent"
              label="实体"
              width>
            </el-table-column>
            <el-table-column
              prop="missing_count"
              label="缺失关系数"
              width>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                type="info" plain
                  size="mini"
                  @click="dailog_receive_relation_error(scope.row);integrity_details(scope.row);">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChange7"
            @current-change="currentChange7"
            :current-page="tableData7_page"
            :page-size="tableData7_size"
            :page-sizes="pageSizes"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData7_total"
            style="margin-top: 10px;">
          </el-pagination>
          <el-dialog title="完整性检测" :visible.sync="dialogRelationErrorFormVisible" customClass="customWidth" fullscreen>
            <el-card shadow="never" style="float: left;margin-right:10px;" class="graphWidth">
              <el-card shadow="never">
                <h4>类别的完整性子图</h4>
                <div id="label_integrity" style="height: 300px; width: 750px" ><el-empty description="暂无预览"></el-empty></div>
              </el-card>
              <el-card shadow="never" style="margin-top: 10px;">
                <h4>结点的完整性子图</h4>
                <div id="tuple_integrity" style="height: 300px; width: 750px" ><el-empty description="暂无预览"></el-empty></div>
              </el-card>
            </el-card>
            <el-card shadow="never" style="">
              <h4>缺失元组列表</h4>
              <el-table
                :data="missing_tuple"
                border
                style="width: 100%;margin-top: 10px;">
                <el-table-column label="头实体">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.head }}</span>
                    <el-tag size="small" type="sucess">{{ scope.row.head_typ }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="关系">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.rel }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="尾实体">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.tail }}</span>
                    <el-tag size="small" type="info">{{ scope.row.tail_typ }}</el-tag>
                  </template>
                </el-table-column> 
                <el-table-column label="操作" width="100px">
                  <el-button type="text" @click="func">链接预测</el-button>
                </el-table-column> 
              </el-table>
            </el-card>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogRelationErrorFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogRelationErrorFormVisible = false;">确 定</el-button>
            </div>
          </el-dialog>
        </el-card>
      </div>
      <div v-if="this.active==1">
        <el-button @click="modelVisible=true;stop_read_gpu_cpu=false;startToGetGpuAndCpu();get_lpm_table();" style="margin-top:10px">模型管理</el-button>
        <el-dialog title="模型管理" :visible.sync="modelVisible" fullscreen="true" :before-close="closeModelView">
          <el-button type="primary" @click="open()">新建训练</el-button>
          <el-table :data="tableData4" border style="width: 100%; margin-top:10px">
            <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
            <el-table-column prop="model_name" label="模型名称" width="180"></el-table-column>
            <el-table-column label="训练状态">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" v-if="scope.row.train_status == true" :loading="scope.row.train_status">训练中</el-button>
                <el-button type="success" size="mini" v-if="scope.row.train_status != true">已训练</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.train_status==1" type="danger" size="mini" @click="remove_lpm(scope.row.model_name)">删除</el-button>
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
        <div style="margin-top:10px">
          <p><b>选择待预测的实体和关系</b></p>
          <el-row class="demo-autocomplete">
            <el-select v-model="select1" style="margin-top:10px;" placeholder="请选择模型">
              <el-option
                v-for="item in mod_set"
                :key="item.value"
                :label="item.label"
                :value="{ value: item.value, label: item.label}">
              </el-option>
            </el-select>
            <el-select v-model="state1" filterable placeholder="请选择实体" style="margin-left:10px">
              <el-option
                v-for="item in ent_set"
                :key="item.value"
                :label="item.value"
                :value="{ value: item.value, label: item.ent_typ}">
              </el-option>
            </el-select>
            <!-- <el-autocomplete
              class="inline-input"
              v-model="state1"
              clearable
              :fetch-suggestions="querySearch"
              placeholder="请选择实体"
              style="margin-left:10px"
              @select="handleSelect"
            ></el-autocomplete> -->
            <el-select v-model="state2" filterable placeholder="请选择关系" style="margin-left:10px">
              <el-option
                v-for="item in rel_sets"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-autocomplete
              class="inline-input"
              v-model="state2"
              clearable
              :fetch-suggestions="querySearch2"
              placeholder="请选择关系"
              style="margin-left:10px"
              @select="handleSelect2"
            ></el-autocomplete> -->
            <el-button 
              plain
              style="margin-left:10px" 
              @click="comm_entRel_pair">确定</el-button>
          </el-row>
        </div>
        <el-table :data="tableData1" border style="width: 100%; margin-top: 20px">
          <!-- <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column> -->
          <el-table-column label="实体">
            <template slot-scope="scope">
              {{scope.row.ent}}
              <el-tag size="small" type="info">{{ scope.row.ent_typ }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="rel" label="关系"></el-table-column>
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
          <el-button type="success" @click="applyResult()" style="margin: 0px;margin-left:10px">应用</el-button>
        </el-tooltip>
        <el-table :data="tableData2" border :key="tableData2Key" style="width: 100%; margin-top: 20px">
          <el-table-column label="头实体">
            <template slot-scope="scope">
              {{scope.row.head}}
              <el-tag size="small" type="info">{{ scope.row.head_typ }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="rel" label="关系"></el-table-column>
          <el-table-column label="已选尾实体">
            <template slot-scope="scope">
              <span v-if="scope.row.tail==null">还未选择</span>
              <span v-if="scope.row.tail!=null">{{scope.row.tail}}</span>
              <el-tag size="small" type="info" v-if="scope.row.tail!=null">{{ scope.row.tail_typ }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="尾实体预测结果">
            <template slot-scope="scope">
              <el-button type="text" @click="displayTailDetailTable(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column label="链接状态">
            <template slot-scope="scope">
              <span v-if="scope.row.pred_form=='0'">“实体-关系”链接已存在</span>
              <span v-if="scope.row.pred_form=='1'">“实体-关系”链接不存在</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="time" label="时间"></el-table-column>
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
        <el-dialog title="预测概览" :visible.sync="tailDetailVisible">
          <el-table :data="tableData3">
            <el-table-column label="尾实体">
              <template slot-scope="scope">
                {{scope.row.tail}}
                <el-tag size="small" type="info">{{ scope.row.tail_typ }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="预测概率">
              <template slot-scope="scope">{{scope.row.pred_prob}}</template>
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
      <div v-if="this.active==2">
        <el-button type="primary" @click="linked_completion()">开始检测</el-button>
        <el-popover placement="top" v-model="isJoin">
          <p>是否应用链接补全的结果？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="isJoin = false">取消</el-button>
            <el-button type="primary" size="mini" @click="isJoin = false; apply_linkCompletion_res();">确定</el-button>
          </div>
          <el-button type="success" slot="reference" style="margin-top: 10px; margin-left: 10px;">应用</el-button>
        </el-popover>
        <keep-alive>
          <el-table :data="tableData5" :row-class-name="tableRowClassName" border style="width: 100%; margin-top: 10px;">
            <!-- <el-table-column
              label="检测时间"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.time }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="头实体" width="400">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.head }}</span>
                <el-tag size="small" type="sucess">{{ scope.row.head_typ }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="关系">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.rel }}</span>
              </template>
            </el-table-column>     
            <el-table-column label="尾实体" width="400">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.tail }}</span>
                <el-tag size="small" type="info">{{ scope.row.tail_typ }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间"></el-table-column> 
          </el-table>
        </keep-alive>
        <el-pagination
          @size-change="sizeChange5"
          @current-change="currentChange5"
          :current-page="tableData5_page"
          :page-size="tableData5_size"
          :page-sizes="pageSizes"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData5_total"
          style="margin-top: 10px;">
        </el-pagination>
      </div>
      <div v-if="this.active==3">
        <el-table
          :data="tableData6"
          border
          v-loading = "comfirmedLoading"
          element-loading-text="正在提交中..."
          style="width: 100%; margin-top:10px">
          <el-table-column label="头实体" width="400">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.head }}</span>
              <el-tag size="small" type="sucess">{{ scope.row.head_typ }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="关系">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.rel }}</span>
            </template>
          </el-table-column>     
          <el-table-column label="尾实体" width="400">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.tail }}</span>
              <el-tag size="small" type="info">{{ scope.row.tail_typ }}</el-tag>
            </template>
          </el-table-column>   
          <!-- <el-table-column label="预测类型">
            <template slot-scope="scope">
              <span v-if="scope.row.pred_form=='0'">“实体-关系”链接已存在</span>
              <span v-if="scope.row.pred_form=='1'">“实体-关系”链接不存在</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="time" label="时间"></el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChange6"
            @current-change="currentChange6"
            :current-page="tableData6_page"
            :page-size="tableData6_size"
            :page-sizes="pageSizes"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData6_total"
            style="margin-top: 10px;">
        </el-pagination>
      </div>
      <div style="text-align: right;">
        <el-button style="margin-top: 12px;margin-right:10px;" v-if="this.active>0" @click="previous">上一步</el-button>
        <el-popover
            placement="left"
            v-model="nextStepVisible">
          <p>确定将当前结果保存至缓存表,并进行下一步吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="nextStepVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="nextStepVisible = false;submitToCache();">确定</el-button>
          </div>
          <el-button type="primary" style="margin-top: 12px;"  v-if="this.active==3" slot="reference" @click="nextStepVisible=true;">提交</el-button>
        </el-popover>
        <el-button type="primary" style="margin-top: 12px;" v-if="this.active<3" @click="next">下一步</el-button>
      </div>
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
  export default {
    components:{
      Cache,
    },
    data() {
      return {
        missing_tuple: [],
        complete_label_graph: [],
        tuple_integrity_table:[],
        num: 0.7,
        currentLabel : '',
        dialogRelationErrorFormVisible: false, //关系异常修改的dialog
        missing_situations_table: [],
        props: {
            label: 'name',
            children: 'children',
          },
        ontologyTreeData: [],
        isJoin: false,
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
        tableData6_page: 1,
        tableData7_page: 1,
        tableData1_size: 10,
        tableData2_size: 10,
        tableData3_size: 10,
        tableData4_size: 5,
        tableData5_size: 20,
        tableData6_size: 20,
        tableData7_size: 10,
        tableData1_total: 0,
        tableData2_total: 0,
        tableData3_total: 0,
        tableData4_total: 0,
        tableData5_total: 0,
        tableData6_total: 0,
        tableData7_total: 0,
        tableData1 : [],
        tableData2 : [],
        tableData3 : [],
        tableData4 : [],
        tableData5 : [],
        tableData6 : [],
        tableData7 : [],
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
        link_completion_data: [],
      }
    },
    methods: {
      dailog_receive_relation_error(row){
        this.dialogRelationErrorFormVisible = true;
        this.selectedRowOfRelError = row;
      },
      //树形组件单选
      handleCheckChange(data,node,component){
        this.currentLabel = data.name;
        this.integrity_results_and_missing_res(data.name, this.num);
      },
      getOntologyTreeData(){
        //axios请求
        axios.request({
          method: "GET",
          url: '/api/coreOntology/getOntologyData',
        })
        .then((response) => {
          if (response.status === 200) {
            //获取本体树数据
            this.ontologyTreeData = response.data.data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      open(){
        this.dialogFormVisible = true
      },
      close(){
        this.dialogFormVisible = false;
      },
      next() {
          this.active++;
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
      //tableData4获取表格数据，自行分页
      getTableData5(){
        //allData为全部数据
        this.tableData5 = this.link_completion_data.slice(
          (this.tableData5_page - 1) * this.tableData5_size,
          this.tableData5_page * this.tableData5_size
        );
        this.tableData5_total = this.link_completion_data.length
      },
      currentChange5(val){
        this.tableData5_page = val
        this.getTableData5()
      },
      sizeChange5(val){
        this.tableData5_size = val
        this.tableData5_page = 1
        this.getTableData5()
      },
      getTableData6(){
        //allData为全部数据
        this.tableData6 = this.confirmedDataTable.slice(
          (this.tableData6_page - 1) * this.tableData6_size,
          this.tableData6_page * this.tableData6_size
        );
        this.tableData6_total = this.confirmedDataTable.length
      },
      currentChange6(val){
        this.tableData6_page = val
        this.getTableData6()
      },
      sizeChange6(val){
        this.tableData6_size = val
        this.tableData6_page = 1
        this.getTableData6()
      },
      getTableData7(){
        //allData为全部数据
        this.tableData7 = this.missing_situations_table.slice(
          (this.tableData7_page - 1) * this.tableData7_size,
          this.tableData7_page * this.tableData7_size
        );
        this.tableData7_total = this.missing_situations_table.length
      },
      currentChange7(val){
        this.tableData7_page = val
        this.getTableData7()
      },
      sizeChange7(val){
        this.tableData7_size = val
        this.tableData7_page = 1
        this.getTableData7()
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
          console.log({'ent_and_rel': this.entRel_pair_selected, 'model_name': this.select1.label})
          //axios请求
          axios.post('/pythonApi/link_prediction',{
            data: {'ent_and_rel': this.entRel_pair_selected, 'model_name': this.select1.label}
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
            decodedData.push([data[i]['ent'],data[i]['ent_typ'],data[i]['rel']]);
            console.log(data[i]['ent'],data[i]['rel'])
          }
          for(var i =0;i<preds.length;i++){
            var origin = decodedData[i];
            var pred_res = [];
            preds[i].forEach(function(element) {
              pred_res.push({"tail":element[0], "tail_typ":element[3], "pred_prob":element[2]});
            })
            res.push({"head":origin[0],"rel":origin[2],"head_typ":origin[1],"time":this.dateFormat(new Date()),"pred_form":linked_status,"pred_res":pred_res});
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
      //新模型名称加入到链接预测模型list
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
      //训练结束
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
      //删除链接预测模型
      remove_lpm(name){
        //axios请求
         axios.post('/pythonApi/remove_lpm',{
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
      //获取链接预测模型list
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
      //点击详情后将数据赋值给临时表，在dialog上显示
      displayTailDetailTable(row){
        this.temporaryTailDataTable = row.pred_res;
        this.getTableData3();
        this.tailDetailVisible = true;
        this.selectedRow = row;
      },
      //选择行
      chooseTail(row){
        this.selectedRow.tail = row.tail;
        this.selectedRow.tail_typ = row.tail_typ;
        this.selectedRow.pred_prob= row.pred_prob;
        // this.getTableData2();
        this.tableData2Key += 1;
      },
      //应用链接补全结果
      apply_linkCompletion_res(){
        for(var i=0; i<this.link_completion_data.length;i++){
          this.confirmedDataTable.push(this.link_completion_data[i])
        }
        this.getTableData6();
        this.$message({
            message: '应用链接补全结果成功!',
            type: 'success'
          });
      },
      //应用链接预测结果
      applyResult(){
        var tmpTable = [];
        this.predTable.forEach(function (element){
          if(element.tail!=null){
            //深拷贝
            var newElement  =$.extend(true,{},element);
            delete newElement.pred_res;
            tmpTable.push(newElement)
          }
        })
        for(var i=0; i<tmpTable.length;i++){
          this.confirmedDataTable.push(tmpTable[i]);
        }
        this.getTableData6();
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
              this.confirmedDataTable = [];
              this.jumpToNext();
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //搜索实体集合
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
      //搜索关系集合
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
      //加载实体集合
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
      //加载关系集合
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
      //加载模型集合
      load_modSet() {
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
      //实体和关系选择不全
      open_when_input_isIncomplete() {
        this.$message({
          showClose: true,
          message: '请选择模型以及要预测的实体和关系',
          type: 'warning'
        });
      },
      //确定选择的关系和实体
      comm_entRel_pair(){
        if (this.state1 != '' && this.state2 != '' && this.select1 != ''){
          var entRel_pair = {'ent': this.state1['value'], 'ent_typ': this.state1['label'], 'rel': this.state2 }
          this.entRel_pair_selected.push(entRel_pair)
          this.getTableData()
          // }
        }else{
          this.open_when_input_isIncomplete();
        }
        this.state1 = '';
        this.state2 = '';
      },
      //获取链接补全列表
      linked_completion(){
        //axios请求
        axios.post('/pythonApi/linked_completion',{})
        .then((response)=>{
          if (response.status == 200) {
            //赋值给表格
            this.link_completion_data = response.data.data;
            for(var i=0; i<this.link_completion_data.length;i++){
              this.link_completion_data[i]['time'] = this.dateFormat(new Date())
            }
            this.getTableData5();
            console.log(this.tableData5)
            //设置文本高亮
            }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获得完整性子图以及缺失表格
      integrity_results_and_missing_res(label_name, num){
        //axios请求
        axios.post('/pythonApi/return_integrity_results',{
          data: label_name, rate: num
        })
        .then((response)=>{
          if (response.status == 200) {
            //赋值给表格
            this.missing_situations_table = response.data.missing_situations_table;
            this.complete_label_graph = response.data.complete_label_graph;
            this.getTableData7();
            //设置文本高亮
            }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获得完整性子图以及缺失表格
      return_tuple_integrity_graph(ent, ent_typ, missing_tuple){
        //axios请求
        axios.post('/pythonApi/return_tuple_integrity_graph',{
          ent: ent, ent_typ: ent_typ, missing_tuple: missing_tuple
        })
        .then((response)=>{
          if (response.status == 200) {
            //赋值给表格
            this.tuple_integrity_table = response.data.tuple_integrity_graph;
            this.tuple_integrity_graph(this.tuple_integrity_table);
            //设置文本高亮
            }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      changeNumber(currentValue, oldValue){
        this.integrity_results_and_missing_res(this.currentLabel, this.num)
      },
      label_integrity_graph(arr){
        var chartDom = document.getElementById('label_integrity');
        var myChart = echarts.init(chartDom);
        myChart.hideLoading();
        var webkitDep = this.genrateData(arr);
        var option = {
          legend: {
            x: 'left',//图例位置
            //图例的名称
            //此处的数据必须和关系网类别中name相对应
            data: webkitDep.categories.map(function (a) {
              return a.name;
            })
          },
          series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 20,
            // animation: false,
            label: {
              normal: {
                show:true,
                position: 'right'
              }
            },
            //展示边数据
            edgeLabel: {
              normal: {
                show: true,
                formatter: function (x) {
                  return x.data.name;
                }
              }
            },
            edgeSymbol: ["circle", "arrow"], //边两边的类型
            draggable: true,
            force: {
              layoutAnimation:true,
              // xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
              // yAxisIndex : 0, //y轴坐标
              // gravity:0.03,  //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
              // edgeLength: 55,  //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
              // repulsion: 150  //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
              edgeLength: 120,
              repulsion: 50,
              gravity: 0.03
            },
            data: webkitDep.nodes.map(function (node, idx) {  //node数据
              node.id = idx;
              return node;
            }),
            categories: webkitDep.categories,  //关系网类别，可以写多组
            edges: webkitDep.links  //link数据
          }]
        };
        myChart.setOption(option);
      },
      tuple_integrity_graph(arr){
        var chartDom = document.getElementById('tuple_integrity');
        var myChart = echarts.init(chartDom);
        myChart.hideLoading();
        var webkitDep = this.genrateData(arr);
        var option = {
          legend: {
            x: 'left',//图例位置
            //图例的名称
            //此处的数据必须和关系网类别中name相对应
            data: webkitDep.categories.map(function (a) {
              return a.name;
            })
          },
          series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 20,
            // animation: false,
            label: {
              normal: {
                show:true,
                position: 'right'
              }
            },
            //展示边数据
            edgeLabel: {
              normal: {
                show: true,
                formatter: function (x) {
                  return x.data.name;
                }
              }
            },
            edgeSymbol: ["circle", "arrow"], //边两边的类型
            draggable: true,
            force: {
              layoutAnimation:true,
              // xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
              // yAxisIndex : 0, //y轴坐标
              // gravity:0.03,  //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
              // edgeLength: 55,  //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
              // repulsion: 150  //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
              edgeLength: 120,
              repulsion: 50,
              gravity: 0.03
            },
            data: webkitDep.nodes.map(function (node, idx) {  //node数据
              node.id = idx;
              return node;
            }),
            categories: webkitDep.categories,  //关系网类别，可以写多组
            edges: webkitDep.links  //link数据
          }]
        };
        myChart.setOption(option);
      },
      genrateData(arr){
        var data = {};
        var map=new Map;
        data['categories'] = [];
        var nodes = [];
        var links= [];
        var counter = 0;
        var dic = {};
        var cate_counter = 0;
        for(var i=0;i<arr.length;i++){
          if(!(arr[i].head_typ in dic)){
            dic[arr[i].head_typ] = cate_counter
            var new_cate = {};
            new_cate.name = arr[i].head_typ;
            cate_counter+=1;
            data['categories'].push(new_cate);
          }
          if(!(arr[i].tail_typ in dic)){
            dic[arr[i].tail_typ] = cate_counter
            var new_cate = {};
            new_cate.name = arr[i].tail_typ;
            cate_counter+=1;
            data['categories'].push(new_cate);
          }
        }
        for(var i=0;i<arr.length;i++){
            //已有该实体
            if(!map.has(arr[i].head)){
              map.set(arr[i].head,counter);
              var new_node1 = {};
              new_node1.name = arr[i].head;
              new_node1.category = dic[arr[i].head_typ];
              new_node1.id = counter;
              counter+=1;
              nodes.push(new_node1);
            }
            //已有该实体,不需增加新的节点
            if(!map.has(arr[i].tail)) {
              map.set(arr[i].tail, counter);
              var new_node2 = {};
              new_node2.name = arr[i].tail;
              new_node2.category = dic[arr[i].tail_typ];
              new_node2.id = counter;
              counter += 1;
              nodes.push(new_node2);
            }
        }
        var curve = 0;
        for(var i=0;i<arr.length;i++){
            var link = {};
            link.source = map.get(arr[i].head);
            link.lineStyle= {
              curveness: curve // 设置连接处的弧度
            },
            link.name = arr[i].rel;
            link.target = map.get(arr[i].tail);
            links.push(link)
            
        }
        data['nodes'] = nodes;
        data['links'] = links;
        console.log(data)
        return data;
      },
      draw_graph(){
        setTimeout(()=>{
          this.label_integrity_graph(this.complete_label_graph);
        },100)
      },
      integrity_details(row){
        this.return_tuple_integrity_graph(row.ent, row.label, row.missing_tuple);
        this.draw_graph();
        this.missing_tuple = row.missing_tuple;
      }
    },
    mounted(){
      this.load_entSet(); //加载实体集合
      this.load_relSet(); //加载关系集合
      this.load_modSet(); //加载模型集合
      this.getOntologyTreeData();
    },
  }
</script>