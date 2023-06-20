<template>
  <div>
    <el-steps :active="active" finish-status="success"  simple>
      <el-step title="选择图谱" ></el-step>
      <el-step title="实体对齐" ></el-step>
      <el-step title="置信检测" ></el-step>
      <el-step title="图谱融合" ></el-step>
    </el-steps>
    <cache></cache>
    <div v-if="this.active==0">
      <div>
        <!-- 加载所有候选图谱-->
        <el-button @click="dialogAllKGVisible = true;loadMultipleSelectCandidateData(multipleCandidateKgCurrentPage,multipleCandidateKgPageSize)" class="operation_button" type="primary" icon="el-icon-circle-plus-outline" plain>选择图谱</el-button>
        <el-button class="operation_button" type="danger" @click="allClear" icon="el-icon-delete" plain>清空</el-button>
        <el-button class="operation_button" type="info" v-show="description" @click="displayPreview()" icon="el-icon-zoom-in" plain>预览</el-button>
        <span>
          已选择的候选图谱:
          <span v-for="(item,i) in multipleSelectionName"><el-tag>{{item}}</el-tag>&nbsp;</span>
        </span>
      </div>
      <el-descriptions title="图谱信息" v-show="description">
        <el-descriptions-item label="三元组数量">{{tripleCount}}</el-descriptions-item>
        <el-descriptions-item label="实体数量">{{entityCount}}</el-descriptions-item>
        <el-descriptions-item label="关系种类数量">{{relationTypeCount}}</el-descriptions-item>
        <el-descriptions-item label="关系数量">{{relationCount}}</el-descriptions-item>
      </el-descriptions>
      <!--显示要融合的图谱-->
      <el-table
          :data="fromKgTablePageData"
          border
          style="width: 100%"
          v-loading="fromKgLoading">
        <el-table-column
            prop="head"
            label="头实体"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="relation"
            label="关系"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="tail"
            label="尾实体"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="candidateName"
            width="200"
            show-overflow-tooltip
            label="所属图谱">
        </el-table-column>
      </el-table>
      <el-pagination
          @current-change="fromKgHandleCurrentChange"
          @size-change="fromKgHandleSizeChange"
          :current-page.sync="fromKgCurrentPage"
          :page-size="fromKgPageSize"
          :page-sizes="fromKgPageSizes"
          layout="total,sizes, prev, pager, next,jumper"
          :total="fromKgTotal">
      </el-pagination>
      <el-dialog
          title="预览"
          :visible.sync="previewVisible"
          width="70%"
          destroy-on-close>
        <!--展示预览-->
        <component :is="confirmPreview" :previewDATA="JSON.stringify(previewData)"></component>
      </el-dialog>

      <!--选择图谱对话框-->
      <el-dialog title="选择候选图谱" :visible.sync="dialogAllKGVisible"  :show-close='false'>
        <!--选择目标图谱-->
        <div style="text-align: center;">
        <el-table
            ref="multipleCandidateKgTable"
            :data="multipleMergeKgTable"
            tooltip-effect="dark"
            border
            style="width: 100%"
            @selection-change="multipleCandidateKgHandleSelectionChange"
            :row-key="getRowKeys"
            key="2"
            >
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column label="名称" :show-overflow-tooltip="true">
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
              label="备注" :show-overflow-tooltip="true">
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
              class="choose_targetKg_pagination"
              background
              layout="total ,prev, pager, next"
              @current-change="multipleCandidateKgHandleCurrentChange"
              :current-page="multipleCandidateKgCurrentPage"
              :page-size="multipleCandidateKgPageSize"
              :total="multipleCandidateKgTotal">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="operation_button" type="danger" @click="handleSelectKgClose" plain>取消</el-button>
          <el-button  class="operation_button" type="success" @click="importData();dialogAllKGVisible = false" icon="el-icon-download" plain>导入</el-button>
        </div>
    </el-dialog>
    </div>
    <div v-if="this.active==1">
      <el-select v-model="algorithm" placeholder="请选择算法">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input-number v-model="threshold" :step="0.01" :min=0.1 :max="1" style="margin-left:8px;"></el-input-number>
      <el-popover
          placement="top-start"
          title="请调节阈值"
          trigger="hover"
         >
        <div>范围为0-1,越接近1表示两个实体越相同,反之亦然，算法计算结果仅供参考(点击以选择要保留的实体，不选择默认同时保留)</div>
        <i class="el-icon-warning-outline" slot="reference"></i>
      </el-popover>
      <el-button style="margin-top: 12px; margin-left: 8px;" @click="calculate">开始计算</el-button>
      <el-tooltip class="item" effect="dark" content="取消所有对齐选择" placement="top-start">
        <el-button plain type="danger" style="margin-top: 20px;margin-bottom: 10px;" @click="clearAllAlignSelection()">全部取消</el-button>
      </el-tooltip>
      <el-button style="margin-top: 12px;" @click="mergeConfirmTableVisible = true;getMergeConfirmTableData()">筛选确认</el-button>
      <el-card shadow="never" v-loading="simLoading" element-loading-text="正在计算相似度,请稍后...">
        <el-table
            :data="simKgTablePageData"
            tooltip-effect="dark"
            style="width: 100%"
            border
            :key="tableKey"
            @cell-click="handleCellClick">
          <el-table-column
              label="实体(核心图谱)" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div>{{ scope.row.to}}
              <el-image
                v-if="scope.row.direction=='left'"
                style="top:3px;width: 20px;height:20px"
                :src="rightImg"
                ></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="实体(候选图谱)" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div>{{ scope.row.from}}
                <el-image
                    v-if="scope.row.direction=='right'"
                    style="top:3px;width: 20px;height:20px"
                    :src="rightImg"
                    ></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="sim"
              label="相似度">
          </el-table-column>
        </el-table>
        <el-pagination
            @current-change="simKgHandleCurrentChange"
            @size-change="simKgHandleSizeChange"
            :current-page.sync="simKgCurrentPage"
            :page-size="simKgPageSize"
            :page-sizes="simKgPageSizes"
            layout="total,sizes, prev, pager, next,jumper"
            :total="simKgTotal">
        </el-pagination>
      </el-card>
      <el-dialog title="融合确认列表" :visible.sync="mergeConfirmTableVisible">
        <el-table :data="mergeTablePageData">
          <el-table-column property="to" label="实体(目标图谱)" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column property="direction" width="50px">
            <template slot-scope="scope">
            <el-image
                style="top:3px;width: 20px;height:20px"
                :src="rightArrow"
                v-if="scope.row.direction=='right'"
            ></el-image>
            <el-image
                style="top:3px;width: 20px;height:20px"
                :src="leftArrow"
                v-if="scope.row.direction=='left'"
            ></el-image>
            </template>
          </el-table-column>
          <el-table-column property="from" label="实体(候选图谱)" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
        <el-pagination
            small
            layout="total,prev, pager, next"
            @current-change="mergeConfirmHandleCurrentChange"
            :current-page="mergeConfirmCurrentPage"
            :page-size="mergeConfirmPageSize"
            :total="mergeConfirmTotal">
        </el-pagination>
      </el-dialog>
    </div>
    <div v-if="this.active==2">
      <el-button  class="operation_button" @click="confidenceDectection">开始检测</el-button>
      <el-button class="operation_button" type="success" slot="reference" @click="confirmConfidenceDectection();confidenceDectectionConfirm=true" v-if="confidenceDectectionConfirm==false"plain>应用</el-button>
      <el-button class="operation_button" type="danger" @click="cancelConfidenceDectection();confidenceDectectionConfirm=false" v-if="confidenceDectectionConfirm==true" plain>取消应用</el-button>
      <el-table
          v-loading = "confidenceLoading"
          :data="confidenceDectectionTablePageData"
          border
          style="width: 100%; margin-top:10px">
        <el-table-column label="头实体">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              {{ scope.row.head}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="关系">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              {{ scope.row.relation}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="尾实体">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              {{ scope.row.tail }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
            :filters="[{ text: '通过', value: '检测通过' }, { text: '不通过', value: '检测不通过' }]"
            :filter-method="filterRes"
            filter-placement="bottom-end"
            label="检测结果">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-tag type="success" v-if="scope.row.res=='检测通过'">{{ scope.row.res}}</el-tag>
              <el-tag type="danger" v-if="scope.row.res=='检测不通过'">{{ scope.row.res}}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
            label="检测得分">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.score}}</span>
            <span style="margin-left: 10px" v-if="scope.row.score==null">manual_judgment_required</span>
          </template>
        </el-table-column>
        <el-table-column
            label="检测时间">
          <template slot-scope="scope">{{ scope.row.detect_time}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" >
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand">
            <span>
              标记为<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="composeValue(scope.$index, scope.row,1)" >通过</el-dropdown-item>
              <el-dropdown-item :command="composeValue(scope.$index, scope.row,0)">不通过</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="confidenceDectectionHandleSizeChange"
          @current-change="confidenceDectectionHandleCurrentChange"
          :current-page="confidenceDectectionCurrentPage"
          :page-size="confidenceDectectionPageSize"
          :page-sizes="confidenceDectectionPageSizes"
          key="page2"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="confidenceDectectionTotal"
          style="margin-top: 10px;">
      </el-pagination>
    </div>
    <div v-if="this.active==3">
      <el-descriptions title="融合信息确认" border>
        <el-descriptions-item label="目标图谱名称">核心图谱</el-descriptions-item>
        <el-descriptions-item label="待融合图谱个数">{{ this.multipleSelectionName.length }}</el-descriptions-item>
        <el-descriptions-item label="对齐数量"><a>{{ this.mergeTable.length }}</a></el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ dateFormat(new Date()) }}</el-descriptions-item>
        <el-descriptions-item label="操作人员">admin</el-descriptions-item>
      </el-descriptions>
      <el-select v-model="selectedMergeStrategy" placeholder="请选择融合策略">
        <el-option
          v-for="item in mergeStrategyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
          </el-option>
          </el-select>
          <el-popover
              :key="2"
              placement="top"
              v-model="comfirmMergeVisible"
              trigger="manual">
        <p>融合开始之后不可撤销,且融合后结果被提交至缓存,是否继续？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text"  class="operation_button" @click="comfirmMergeVisible = false">取消</el-button>
          <el-button type="primary" size="mini" class="operation_button" @click="comfirmMergeVisible = false;startMerge()">确定</el-button>
        </div>
        <el-button type="primary" style="margin-left: 8px;margin-top: 12px;" slot="reference" @click="checkNecessaryInfo">融合并提交</el-button>
      </el-popover>
      <el-progress :text-inside="false" :stroke-width="15" :percentage="processPercentage" style="margin-top: 10px;margin-bottom: 10px"></el-progress>
      <transition name="el-fade-in-linear">
        <el-result icon="success" title="融合成功" v-show="successShow" class="transition-box">
          <template slot="extra">
          </template>
        </el-result>
      </transition>
    </div>
    <div style="text-align: right;">
      <el-button style="margin-top: 12px;" v-if="this.active>=1" @click="previous" plain>上一步</el-button>
      <el-button type="primary" style="margin-top: 12px;" v-if="this.active<=2"@click="next" plain>下一步</el-button>
      <el-button type="primary" style="margin-top: 12px;" v-if="this.active==3"@click="jumpToNext" plain>下一步</el-button>
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
  padding: 7px;
}
.el-dialog__body {
  /*display: none;*/
  padding: 8px 8px;
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
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  margin-right: 8px !important;
}
.choose_targetKg_pagination{
  margin-top: 10px;
}
</style>
<script>
import KgPreview from "../../../components/merge_kg/KgPreview";
import moment from 'moment';
import $ from "../../../plugins/jquery.min"
import Cache from "../../../components/merge_kg/Cache";
import rightImg from "@/assets/icon/right.png"
import rightArrow from "@/assets/icon/right-arrow.png"
import leftArrow from "@/assets/icon/left-arrow2.png"
export default {
  components:{
    KgPreview,
    Cache,
    rightImg,
    rightArrow,
    leftArrow,
  },
  data() {
    return {
      rightImg:rightImg,
      rightArrow:rightArrow,
      leftArrow:leftArrow,
      tableKey:0,
      active:0,
      //融合时主图谱和候选图谱切换
      kgType:"",
      options: [{
          value: 'Jaccard相似系数',
          label: 'Jaccard相似系数'
        }],
      algorithm:"",
      threshold:0.5,
      simLoading:false,
      //融合策略选择
      mergeStrategyOptions: [
      {
        value: '1',
        label: '保留候选图谱'
      }],
      selectedMergeStrategy:'',
      newKgComment:'',
      //选择图谱可视化
      dialogAllKGVisible:false,
      //目标图谱分页数据
      candidateKgPageSize:10,
      candidateKgTotal:0,
      candidateKgCurrentPage:1,
      //目标图谱数据表
      mergeKgTable:[],
      //多选候选图谱表格
      multipleMergeKgTable:[],
      multipleCandidateKgPageSize:10,
      multipleCandidateKgTotal:0,
      multipleCandidateKgCurrentPage:1,
      multipleSelection: [],
      multipleSelectionName: [],
      //待融合融合的图谱分页信息
      fromKgTableData:[],
      fromKgTablePageData:[],
      fromKgCurrentPage:1,
      fromKgPageSize:10,
      fromKgPageSizes:[10,20,50,80,100],
      fromKgTotal:0,
      fromKgLoading:false,
      //选择图谱切换步骤条
      select_kg_active:0,
      //相似度信息
      simTableData:[],
      simKgTablePageData:[],
      simKgCurrentPage:1,
      simKgPageSize:10,
      simKgPageSizes:[10,20,50,80,100],
      simKgTotal:0,
      simKgLoading:false,
      //融合图谱部分
      mergeTable:[],
      mergeTablePageData:[],
      mergeConfirmTableVisible:false,
      //融合确认的分页信息
      mergeConfirmCurrentPage:1,
      mergeConfirmPageSize:10,
      mergeConfirmTotal:0,
      //开始融合确认
      comfirmMergeVisible:false,
      processPercentage:0,
      successShow:false,
      //展开详细信息
      description:false,
      closeDescription:false,
      confirmPreview:"",
      previewData:[],
      nextStepVisible:false,
      //置信检测部分
      confidenceDetectionData:[],
      confidenceDectectionTablePageData:[],
      confidenceDectectionCurrentPage:1,
      confidenceDectectionPageSize:10,
      confidenceDectectionPageSizes:[10,20,50,80,100],
      confidenceDectectionTotal:0,
      confidenceDectectionLoading:false,
      confidenceLoading:false,
      //置信检测的结果应用
      confidenceDectectionConfirm:false,
      //是否应用置信度检测结果
      ifApplyConfidence:false,
      //融合第一步，预览
      previewVisible:false,
      //图谱信息
      tripleCount:0,
      entityCount:0,
      relationTypeCount:0,
      relationCount:0,
      //
      toKgTotal:0
    };
  },
  methods: {
    //总体的下一步
    next() {
      if(this.active == 0){
        if(this.multipleSelectionName.length==0){
          this.$message({
            message: '请选择必要数据!',
            type: 'warning'
          });
        }
        else if(this.fromKgTableData.length==0){
          this.$message({
            message: '请先导入数据!',
            type: 'warning'
          });
        }
        else{
          this.active++;
        }
      }
      else if(this.active==1||this.active==2){
        this.active++;
      }
      else if (this.active==3) {
        this.active = 0;
      }
    },
    previous() {
      this.active--;
    },
    //关闭前动作
    handleSelectKgClose(){
      this.dialogAllKGVisible = false;
      this.multipleSelectionName = [];
    },
    calculate(){
      if(this.algorithm==""){
        this.$message({
          showClose: true,
          message: '请选择一个相似度算法!',
          type: 'warning'
        });
      }
      else{
        this.simLoading=true
        axios.post('/pythonApi/calculateEntitySimilarityFromCoreKg',{
          secondEntity : this.fromKgTableData,
          threshold :this.threshold,
          algorithm:this.algorithm
        })
        .then((response) => {
          //先置空
          this.simTableData=[]
          if (response.status == 200) {
            this.simLoading=false
            if(response.data.msg=="success"){
              this.simTableData= response.data.data
              this.simKgTotal = response.data.count
              this.getSimKgTableData()
              this.$message({
                showClose: true,
                message: '相似度计算完成!',
                type: 'success'
              });
            }
            else{
              this.$message({
                showClose: true,
                message: '无相似度信息,可以直接融合!',
                type: 'success'
              });
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      }
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
    multipleCandidateKgHandleCurrentChange(val){
      this.loadMultipleSelectCandidateData(val,this.multipleCandidateKgPageSize)
    },
    //选择候选图谱时的多选框动作
    multipleCandidateKgHandleSelectionChange(val){
      this.multipleSelection = val;
      if(val.length>2){
        this.$message({
          message: '最多选择两个融合图谱,若超出只有前两个图谱有效',
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
    async importData() {
      this.tripleCount=0;
      this.entityCount=0;
      this.relationTypeCount=0;
      this.relationCount=0;
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择候选图谱!',
          type: 'warning'
        });
      }
      //去请求数据
      else {
        this.fromKgLoading = true;
        this.fromKgTableData = [];
        this.fromKgTablePageData = [];
        this.fromKgCurrentPage = 1;
        for (const item of this.multipleSelection) {
          //请求Info数据
          await axios.post('/api/candidateKg/info',{
            id: item.id
          })
          .then((response) => {
            if (response.status == 200&&response.data.msg=="success") {
                this.tripleCount+=response.data.data.tripleCount;
                this.entityCount+=response.data.data.entityCount;
                this.relationTypeCount+=response.data.data.relationTypeCount;
                this.relationCount+=response.data.data.relationCount;
            }
          })
          .catch(function (error) {
            console.log(error)
          })
          //请求三元组数据
          await axios.request({
            method: "POST",
            url: '/api/triples/getTriplesFromSameKgNotByPage',
            params: {id: item.id}
          })
          .then((response) => {
            if (response.status == 200) {
              var list = response.data.data;
              for (var triple of list) {
                //向表中加载数据
                this.fromKgTableData.push(triple);
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
          this.fromKgLoading = false;
        }
        await Promise.all(this.fromKgTableData);
        //分页
        this.getFromKgTableData();
        this.fromKgLoading = false;
        this.description = true;
        this.$notify({
          title: '成功',
          message: '导入信息成功!',
          type: 'success',
        })
      }
      //将预览图置空
      this.confirmPreview = "";
      this.previewData = [];
      this.closeDescription =false;
    },
    //获取toKgTableData
    get_toKg(page,limit,currentRowId){
      axios.request({
        method:"POST",
        url:'/api/triples/getTriplesFromSameKg',
        params:{page:page,limit:limit,id:currentRowId}
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
    //toKgTable的PageSzie改变动作
    toKgHandleSizeChange(val){
      //修改当前分页大小
      this.toKgPageSize = val;
      //重新请求数据
      this.get_toKg(this.toKgCurrentPage,val,this.currentRowId)
    },
    //toKgTable分页改变动作
    toKgHandleCurrentChange(val){
      this.get_toKg(this.toKgCurrentPage,this.toKgPageSize,this.currentRowId)
    },
    //fromKgTable的前端分页
    getFromKgTableData(){
      this.fromKgTotal = this.fromKgTableData.length;
      this.fromKgTablePageData = this.fromKgTableData.slice(
          (this.fromKgCurrentPage - 1) * this.fromKgPageSize,
          this.fromKgCurrentPage * this.fromKgPageSize
      );
    },
    // fromKgTable的前端分页改变动作
    fromKgHandleCurrentChange(val){
      this.fromKgCurrentPage = val
      this.getFromKgTableData()
    },
    // fromKgTable的前端Size页改变动作
    fromKgHandleSizeChange(val){
      this.fromKgPageSize = val
      this.getFromKgTableData()
    },
    //清空
    allClear(){
      this. toKgTableData=[];
      this.fromKgTableData = [];
      this.fromKgTablePageData=[];
      this.multipleSelection=[];
      this.multipleSelectionName=[];
      this.description = false;
    },
    getRowKeys(row) {
      return row.id;   //指定row-key的一个标识
    },
    //处理cell点击事件
    handleCellClick(row, column, cell, event){
      //无显示隔壁也无显示
      if(row.direction==null){
        //新增
        if(column.label=="实体(核心图谱)"){
          row['direction']="left"
        }
        else if(column.label=="实体(候选图谱)"){
          row['direction']="right"
        }
        //新增
        this.mergeTable.push(row)
      }
      //无显示但隔壁有显示
      else if(row.direction!=null&&((column.label=="实体(候选图谱)"&&row.direction=='left')||(column.label=="实体(核心图谱)"&&row.direction=='right'))){
        //箭头转向
        if(column.label=="实体(核心图谱)"){
          this.mergeTable.forEach(function(element) {
            if(element['to']==row.to&&element['from']==row.from){
              element['direction']="left";
            }
          });
        }
        else if(column.label=="实体(候选图谱)"){
          this.mergeTable.forEach(function(element) {
            if(element['to']==row.to&&element['from']==row.from){
              element['direction']="right";
            }
          });
        }
      }
      //有显示
      else if(row.direction!=null&&((column.label=="实体(候选图谱)"&&row.direction=='right')||(column.label=="实体(核心图谱)"&&row.direction=='left'))){
        row.direction = null;
        //删除该条记录
        this.mergeTable = this.mergeTable.filter(item=>{
          if(item['fromId']!=row.fromId){
            return item
          }
          // if(item['to']!=row.to&&item['from']!=row.from){
          //   return item
          // }
        })
      }
      this.tableKey +=1;
    },
    //
    clearAllAlignSelection(){
      //置空表
      this.mergeTable = [];
      //取消所有箭头显示
      $('table').find(".el-image").hide();
      //去掉所有direction
      this.simTableData.forEach((ele,index)=>{
        ele.direction = null;
      })
      this.getSimKgTableData();
    },
    //simKgTable的前端分页
    getSimKgTableData(){
      this.simKgTotal = this.simTableData.length;
      this.simKgTablePageData = this.simTableData.slice(
          (this.simKgCurrentPage - 1) * this.simKgPageSize,
          this.simKgCurrentPage * this.simKgPageSize
      );
    },
    // simKgTable的前端分页改变动作
    simKgHandleCurrentChange(val){
      this.simKgCurrentPage = val
      this.getSimKgTableData()
    },
    // simKgTable的前端Size页改变动作
    simKgHandleSizeChange(val){
      this.simKgPageSize = val
      this.getSimKgTableData()
    },

    checkNecessaryInfo(){
      this.comfirmMergeVisible = true;
    },
    //开始融合
    startMerge(){
        this.processPercentage =0;
        this.successShow= false;
        var flag = false;
        var selectedIds = [];
        this.multipleSelection.forEach((ele,index)=>{
          selectedIds.push(ele.id);
        })
      //如果进行了置信度检测,则发送请求1
      if(this.ifApplyConfidence==true){
        //axios请求
        axios.post('/api/triples/mergeCoreKg',{
          strategy:this.selectedMergeStrategy,
          oldKgId:selectedIds,
          kg:this.confidenceDetectionData,
          mergeTable:this.mergeTable,
        })
            .then((response) => {
              if (response.status == 200) {
                if(response.data.msg=="success"){
                  flag = true;
                }
              }
            })
            .catch(function (error) {
              console.log(error)
            })
      }
      //如果没有进行了置信度检测,则发送请求2
      else{
        //axios请求
        axios.post('/api/triples/mergeCoreKg',{
          strategy:this.selectedMergeStrategy,
          oldKgId:selectedIds,
          kg:this.fromKgTableData,
          mergeTable:this.mergeTable,
        })
        .then((response) => {
          if (response.status == 200) {
            if(response.data.msg=="success"){
              flag = true;
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      }
      var timerId = setInterval(() => {
        this.processPercentage++;
        //发现返回直接退出
        if(flag==true){
          this.processPercentage= 100;
          this.successShow= true;
          clearInterval(timerId);
          return;
        }
        if(this.processPercentage>=99 && flag==false){
            this.processPercentage = 99;
        }
        else if(this.processPercentage<99 && flag==false){
          this.processPercentage++;
        }
      },200)
      },
    //展示导入数据的预览
    displayPreview(){
      this.confirmPreview = KgPreview;
      this.previewData = this.fromKgTableData;
      this.closeDescription = true;
      this.previewVisible = true;
    },
    //关闭预览
    closeDisplayPreview(){
      //将预览图置空
      this.confirmPreview = "";
      this.closeDescription = false;
    },
    //跳转到下一页上
    jumpToNext(){
      this.$router.push('/merge/kg/completion');
    },
    //置信度检测
    confidenceDectection(){
      this.confidenceLoading=true;
      axios.post('/pythonApi/triple_classification',{
        data:this.fromKgTableData
      })
      .then((response) => {
        if(response.status==200){
          this.confidenceLoading=false;
          this.confidenceDetectionData = response.data.data;
          //分页
          this.getConfidenceDectectionTableData();
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    //fromKgTable的前端分页
    getConfidenceDectectionTableData(){
      this.confidenceDectectionTotal = this.confidenceDetectionData.length;
      this.confidenceDectectionTablePageData = this.confidenceDetectionData.slice(
          (this.confidenceDectectionCurrentPage - 1) * this.confidenceDectectionPageSize,
          this.confidenceDectectionCurrentPage * this.confidenceDectectionPageSize
      );
    },
    // confidenceDectectionTable的前端分页改变动作
    confidenceDectectionHandleCurrentChange(val){
      this.confidenceDectectionCurrentPage = val
      this.getConfidenceDectectionTableData()
    },
    // confidenceDectectionTable的前端Size页改变动作
    confidenceDectectionHandleSizeChange(val){
      this.confidenceDectectionPageSize = val
      this.getConfidenceDectectionTableData()
    },
    //检测结果过滤器
    filterRes(value, row){
      return row.res === value;
    },
    //自定义要返回的字段
    composeValue(index, row,pass) {
      return {
        index: index, //key 是你自己想要的字段，值自己定义
        row: row,
        pass:pass
      };
    },
    //处理下拉框改变的动作
    handleCommand(command) {
      if(command.pass==1){
        command.row.res = "检测通过"
      }
      else if(command.pass==0){
        command.row.res = "检测不通过"
      }
    },
    //确认置信检测
    confirmConfidenceDectection(){
      this.ifApplyConfidence = true;
      this.$notify({
        title: '成功',
        message: '应用检测结果成功!',
        type: 'success'
      });
    },
    //取消置信检测
    cancelConfidenceDectection(){
      this.ifApplyConfidence = false;
      this.$notify({
        title: '取消',
        message: '已取消该应用结果!',
        type: 'warning'
      });
    },
    //fromKgTable的前端分页
    getMergeConfirmTableData(){
      this.mergeConfirmTotal = this.mergeTable.length;
      this.mergeTablePageData = this.mergeTable.slice(
          (this.mergeConfirmCurrentPage - 1) * this.mergeConfirmPageSize,
          this.mergeConfirmCurrentPage * this.mergeConfirmPageSize
      );
    },
    // fromKgTable的前端分页改变动作
    mergeConfirmHandleCurrentChange(val){
      this.mergeConfirmCurrentPage = val
      this.getMergeConfirmTableData()
    },

  },
  created() {
    this.selectedMergeStrategy = this.mergeStrategyOptions[0].value
    this.algorithm = this.options[0].value
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