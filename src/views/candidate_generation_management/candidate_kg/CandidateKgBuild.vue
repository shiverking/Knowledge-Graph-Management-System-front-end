<template>
  <div style="margin-top: 20px;">
    <el-button type="primary" style="margin-top:10px;margin-bottom: 10px;" @click="synchronizationDisplay=true">同步
    </el-button>
    <el-dialog
        title="更新设置"
        :visible.sync="synchronizationDisplay"
        width="70%"
        @open="openSetting()">
      <el-row>
        <el-col :span="11">
          <h3>自动更新</h3>
          <el-col class="col-class">
            <span>时间间隔:&nbsp;</span>
            <el-select v-model="timeOption" placeholder="请选择更新间隔">
              <el-option
                  v-for="item in timeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="col-class">
            <span>程序运行状态:</span>
            <span v-if="programmeStatus==false">已停止</span>
            <span v-if="programmeStatus==true">正在运行</span>
          </el-col>
          <el-col class="col-class">
            <p>最近五次请求记录</p>
            <el-table
                border
                :data="requestData"
                style="width: 100%">
              <el-table-column
                  label="请求时间">
                <template slot-scope="scope">
                  {{ scope.row.time }}
                </template>
              </el-table-column>
              <el-table-column
                  prop="num"
                  label="获得数量">
              </el-table-column>
              <el-table-column
                  prop="result"
                  label="结果">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col>
            <el-button type="primary" @click="startTask()">启动</el-button>
            <el-button type="danger" @click="stopTask()">停止</el-button>
          </el-col>
        </el-col>
        <el-col :span="1"><span>&nbsp;</span></el-col>
        <el-col :span="12">
          <h3>手动更新</h3>
          <div style="display: block;margin-top: 20px;margin-bottom: 25px;">
            <span>上次更新时间:</span><span>{{ dateFormat(latestUpateTime) }}</span>
          </div>
          <el-button type="success" @click="manualUpdate" :loading="latestUpdateLoading">更新</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabChange">
      <el-tab-pane label="仓库" name="first">
        <el-radio-group v-model="tabSelection" @input="handelInputChange">
          <el-radio-button label="实体库"></el-radio-button>
          <el-radio-button label="关系库"></el-radio-button>
          <el-radio-button label="三元组库"></el-radio-button>
        </el-radio-group>
        <div id="entityWarehouse">
          <el-table
              :data="entityTableData"
              stripe
              style="width: 100%">
            <el-table-column
                prop="id"
                label="实体ID"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="实体名称"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                prop="category"
                label="类别"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                label="操作"
            >
              <template slot-scope="scope">
                <el-button
                    type="danger" icon="el-icon-delete" circle
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              @size-change="entityHandleSizeChange"
              @current-change="entityHandleCurrentChange"
              :current-page="entityCurrentPage"
              :page-sizes="entityPageSizes"
              :page-size="entityPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="entityTotal"
              key="0">
          </el-pagination>
        </div>
        <div id="relationWarehouse">
          <el-table
              :data="relationTableData"
              stripe
              style="width: 100%">
            <el-table-column
                prop="id"
                label="关系ID"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="关系名称"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                label="操作"
            >
              <template slot-scope="scope">
                <el-button
                    type="danger" icon="el-icon-delete" circle
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              @size-change="relationHandleSizeChange"
              @current-change="relationHandleCurrentChange"
              :current-page="relationCurrentPage"
              :page-sizes="relationPageSizes"
              :page-size="relationPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="relationTotal"
              key="0">
          </el-pagination>
        </div>
        <div id="triplesWarehouse">
          <el-table
              :data="allTriplePageList"
              border
              style="width: 100%; margin-top:10px">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column
                label="头实体"
                :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.head }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="关系"
                :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="warning">{{ scope.row.relation }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="尾实体"
                :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.tail }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag size="medium" type="success">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ dateFormat(scope.row.time) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属候选图谱">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.candidateId }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              @size-change="allTripleHandleSizeChange"
              @current-change="allTripleHandleCurrentChange"
              :current-page="allTripleCurrentPage"
              :page-sizes="allTriplePageSizes"
              :page-size="allTriplePageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="allTripleTotal"
              key="1">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="三元组(未归类)" name="second">
        <div class="block">
          <span>到达时间:</span>
          <el-date-picker
              v-model="now"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
          </el-date-picker>
          <div style="display: inline-block;margin: 10px;">
            <span>数据来源:</span>
            <el-radio v-model="source" label="编目系统">编目系统</el-radio>
            <el-radio v-model="source" label="文本抽取">文本抽取</el-radio>
            <el-radio v-model="source" label="">默认</el-radio>
          </div>
          <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
            <el-button icon="el-icon-refresh-left" circle @click="reset()"></el-button>
          </el-tooltip>
          <el-button type="primary" style="margin-top: 10px;" @click="filter()">筛选</el-button>
          <el-tooltip class="item" effect="dark" content="选取符合当前条件的所有三元组" placement="top">
            <el-button type="success" style="margin-top: 10px;">全选</el-button>
          </el-tooltip>
        </div>
        <keep-alive>
          <el-table
              ref="candiateMultipleTable"
              :data="candidateTriplePageList"
              border
              style="width: 100%; margin-top:10px"
              @selection-change="handleSelectionChange"
              :row-key="getRowKeys"
              key="2">
            <el-table-column type="selection" :reserve-selection="true">
            </el-table-column>
            <el-table-column
                label="头实体"
                :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.head }}
                  <el-popover
                      placement="right"
                      width="400"
                      :ref="`popover-${scope.row.id}-0`">
                    <!--用于加载本体选择的树形组件-->
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
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="cancel(`popover-${scope.row.id}-0`)">取消</el-button>
                      <el-button type="primary" size="mini" @click="confirmOntology(`popover-${scope.row.id}-0`,scope.row)">确定</el-button>
                    </div>
                    <el-button plain v-if="scope.row.headCategory!=''" size="small" type="info" slot="reference" @click="treeVisible=!treeVisible">{{
                        scope.row.headCategory
                      }}
                    </el-button>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="关系"
                :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="warning">{{ scope.row.relation }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="尾实体"
                :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.tail }}
                  <el-popover
                      placement="right"
                      width="400"
                      :ref="`popover-${scope.row.id}-1`"
                      @after-leave="popoveLeaveAction"
                  >
                    <!--用于加载本体选择的树形组件-->
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
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="cancel(`popover-${scope.row.id}-1`)">取消</el-button>
                      <el-button type="primary" size="mini" @click="confirmOntologyTail(`popover-${scope.row.id}-1`,scope.row)">确定</el-button>
                    </div>
                    <el-button plain v-if="scope.row.headCategory!=''" size="small" type="info" slot="reference" @click="treeVisible=!treeVisible">{{
                        scope.row.tailCategory
                      }}
                    </el-button>
                  </el-popover>
<!--                  <el-popover-->
<!--                      placement="right"-->
<!--                      width="400"-->
<!--                      trigger="click">-->
<!--                    &lt;!&ndash;用于加载本体选择的树形组件&ndash;&gt;-->
<!--                    <el-tree-->
<!--                        :props="props"-->
<!--                        :data = "ontologyTreeData"-->
<!--                        show-checkbox-->
<!--                        @check-change="handleCheckChange">-->
<!--                    </el-tree>-->
<!--                    <el-button plain v-if="scope.row.tailCategory!=''" size="small" type="info" slot="reference">{{-->
<!--                        scope.row.tailCategory-->
<!--                      }}-->
<!--                    </el-button>-->
<!--                  </el-popover>-->
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag size="medium" type="danger">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="到达时间">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ dateFormat(scope.row.time) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="来源">
              <template slot-scope="scope">
                <span>{{ scope.row.source }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作">
              <template slot-scope="scope">
                <el-button
                    size="warning" icon="el-icon-edit" circle
                    @click="handleCandidateTripleEdit(scope.$index, scope.row)"></el-button>
                <el-popconfirm
                    confirm-button-text='好的'
                    cancel-button-text='不用了'
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除该三元组吗？"
                    @confirm="handleDeleteCandidateTriple(scope.$index, scope.row)"
                >
                  <el-button
                      type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </keep-alive>
        <el-pagination
            @size-change="candidateTripleHandleSizeChange"
            @current-change="candidateTripleHandleCurrentChange"
            :current-page="candidateTripleCurrentPage"
            :page-sizes="candidateTriplePageSizes"
            :page-size="candidateTriplePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="candidateTripleTotal"
            key="2">
        </el-pagination>
        <el-dialog title="修改三元组信息" :visible.sync="dialogModification">
          <el-row>
            <span>头实体:</span>
            <el-input v-model="tripleInfo.head" class="input_modify"></el-input>
          </el-row>
          <el-row>
            <span>头实体类型:</span>
            <el-input v-model="tripleInfo.head_type" class="input_modify"></el-input>
          </el-row>
          <el-row>
            <span>关系:</span>
            <el-input v-model="tripleInfo.rel" class="input_modify"></el-input>
          </el-row>
          <el-row>
            <span>尾实体:</span>
            <el-input v-model="tripleInfo.tail" class="input_modify"></el-input>
          </el-row>
          <el-row>
            <span>尾实体类型:</span>
            <el-input v-model="tripleInfo.tail_type" class="input_modify"></el-input>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogModification = false">取 消</el-button>
            <el-button type="primary" @click="dialogModification = false;confirmUpdate()">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="已选择" name="third">
        <el-dialog
            title="生成信息确认"
            :visible.sync="kgDialogVisible"
            width="30%">
          <div>
            <el-input placeholder="请输入候选图谱名称" v-model="kgName" required="true"></el-input>
            <el-input placeholder="为该候选图谱添加备注(可选)" style="display: grid;margin-top: 10px;"
                      v-model="kgComment"></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="kgDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="kgDialogVisible = false;generateNewKG()">确 定</el-button>
        </span>
        </el-dialog>
        <el-popover
            placement="top"
            v-model="popoverVisible">
          <div style="margin-top: 10px;margin-bottom: 10px;">确定将这{{ selectedTripleTotal }}条三元组生成候选图谱吗？
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="checkTriplesNum()">确定</el-button>
          </div>
          <el-button type="primary" slot="reference">生成候选图谱</el-button>
        </el-popover>
        <el-table
            :data="selectedTriplePageList"
            border
            style="width: 100%; margin-top:10px"
        >
          <el-table-column
              label="头实体"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.head }}
                <el-tag size="small" type="info">{{ scope.row.headCategory }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="关系"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" type="warning">{{ scope.row.relation }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="尾实体"
              :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.tail }}
                <el-tag size="medium" type="info">{{ scope.row.tailCategory }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="操作">
            <template slot-scope="scope">
              <el-button
                  size="warning" icon="el-icon-edit" circle
                  @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-tooltip class="item" effect="dark" content="撤销该三元组" placement="top-start">
                <el-button
                    type="danger" icon="el-icon-refresh-left" circle
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            @size-change="selectedTripleHandleSizeChange"
            @current-change="selectedTripleHandleCurrentChange"
            :current-page="selectedTripleCurrentPage"
            :page-sizes="selectedTriplePageSizes"
            :page-size="selectedTriplePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="selectedTripleTotal">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
.el-dialog__body {
  padding-top: 0px;
}

.col-class {
  margin-top: 8px;
  margin-bottom: 8px;
}

.input_modify {
  margin: 10px;
  width: 70% !important;
}
.el-popover{
  max-height: 500px;
  overflow-y:auto;
}
</style>
<script>
import $ from '../../../plugins/jquery.min.js';
import moment from "moment";

export default {
  comments() {
    synchronization
  },
  data() {
    return {
      multipleSelection: [],
      activeName: 'second',
      tabSelection: '实体库',
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // now: [new Date().getTime() - 3600 * 1000 * 24 * 1, new Date()],
      now: [],
      //已选择三元组列表
      allTriplePageList: [],
      //已选三元组分页
      allTripleCurrentPage: 1,
      allTripleTotal: 0,
      allTriplePageSize: 10,
      allTriplePageSizes: [10, 50, 100, 200],

      // 分页列表数据
      candidateTriplePageList: [],
      //候选三元组分页
      candidateTripleCurrentPage: 1,
      candidateTripleTotal: 1,
      candidateTriplePageSize: 10,
      candidateTriplePageSizes: [10, 50, 100, 200],
      //确认是否生成候选图谱
      kgDialogVisible: false,
      popoverVisible: false,
      //确认生成候选图谱对话框
      labelPosition: "left",
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      //已选择三元组列表
      selectedTripleList: [],
      selectedTriplePageList: [],
      //已选三元组分页
      selectedTripleCurrentPage: 1,
      selectedTripleTotal: 0,
      selectedTriplePageSize: 10,
      selectedTriplePageSizes: [10, 50, 100, 200],
      //生成候选图谱所需数据
      kgName: '',
      kgComment: '',
      //实体库数据
      entityTableData: [],
      entityCurrentPage: 1,
      entityPageSize: 10,
      entityPageSizes: [10, 50, 100, 200],
      entityTotal: 0,
      //关系库数据
      relationTableData: [],
      relationCurrentPage: 1,
      relationPageSize: 10,
      relationPageSizes: [10, 50, 100, 200],
      relationTotal: 0,
      //同步的展示界面
      synchronizationDisplay: false,
      //时间间隔
      timeOptions: [
        {
          value: 1,
          label: '1min',
        },
        {
          value: 5,
          label: '5min',
        }, {
          value: 10,
          label: '10min',
        }, {
          value: 15,
          label: '15min',
        }, {
          value: 20,
          label: '20min',
        }, {
          value: 25,
          label: '25min',
        }],
      latestUpateTime: "",
      latestUpdateLoading: false,
      // 程序运行状态
      programmeStatus: "",
      timeOption:"",
      requestData: [],
      //来源
      source: "null",
      //是否条件搜搜
      isConditionalSearch: false,
      //修改表格
      dialogModification: false,
      //信息表格
      tripleInfo: {
        id: "",
        head: "",
        head_type: "暂无",
        rel: "",
        tail: "",
        tail_type: "暂无",
      },
      //树形组件
      treeVisible:false,
      props: {
        label: 'name',
        children: 'children',
      },
      count: 1,
      ontologyTreeData: [],
      confirmHeadCategory:'',
      confirmTailCategory:'',
    }
  },
  methods: {
    //处理所有三元组分页事件
    allTripleHandleSizeChange(val) {
      //修改当前分页大小
      this.allTriplePageSize = val;
      //重新请求数据
      this.get_triples(this.allTripleCurrentPage, val)
    },
    //翻页动作
    allTripleHandleCurrentChange(val) {
      this.get_triples(val, this.allTriplePageSize)
    },
    //向后端请求所有三元组数据
    get_triples(num, limit) {
      //axios请求
      axios.request({
        method: "POST",
        url: '/api/triples/getAllTriplesByPage',
        params: {page: num, limit: limit}
      })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.allTriplePageList = response.data.data
              this.allTripleTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //处理tab页点击事件
    handleTabChange(tab, event) {
      if (tab.name == "仓库") {
        this.get_triples(this.allTripleCurrentPage, this.allTriplePageSize)
        this.get_entities(this.entityCurrentPage, this.entityPageSize)
        this.get_relations(this.relationCurrentPage, this.relationPageSize)
      } else {
        this.get_candidate_triples(this.candidateTripleCurrentPage, this.candidateTriplePageSize)
      }
    },
    //处理候选三元组分页事件
    candidateTripleHandleSizeChange(val) {
      //修改当前分页大小
      this.candidateTriplePageSize = val;
      if (this.isConditionalSearch == false) {
        //重新请求数据
        this.get_candidate_triples(this.candidateTripleCurrentPage, val)
      } else {
        this.get_candidate_triples_conditional(this.candidateTripleCurrentPage, val);
      }
    },
    //翻页动作
    candidateTripleHandleCurrentChange(val) {
      if (this.isConditionalSearch == false) {
        this.get_candidate_triples(val, this.candidateTriplePageSize)
      } else {
        this.get_candidate_triples_conditional(val, this.candidateTriplePageSize);
      }
    },
    //向后端请求候选三元组数据
    get_candidate_triples(num, limit) {
      //axios请求
      axios.request({
        method: "POST",
        url: '/api/triples/getAllCandidateTriples',
        params: {page: num, limit: limit}
      })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.candidateTriplePageList = response.data.data
              this.candidateTripleTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //向后端有条件请求候选三元组数据
    get_candidate_triples_conditional(num, limit) {
      if (this.now.length == 0) {
        //axios请求
        axios.request({
          method: "POST",
          url: '/api/triples/getAllCandidateTriplesConditionally',
          params: {page: num, limit: limit, source: this.source}
        })
            .then((response) => {
              if (response.status == 200) {
                //修改数据
                this.candidateTriplePageList = response.data.data
                this.candidateTripleTotal = response.data.count
              }
            })
            .catch(function (error) {
              console.log(error)
            })
      } else {
        //axios请求
        axios.request({
          method: "POST",
          url: '/api/triples/getAllCandidateTriplesConditionally',
          params: {
            page: num,
            limit: limit,
            startTime: moment(this.now[0]).startOf('day').format('x'),
            endTime: moment(this.now[1]).startOf('day').format('x'),
            source: this.source
          }
        })
            .then((response) => {
              if (response.status == 200) {
                //修改数据
                this.candidateTriplePageList = response.data.data
                this.candidateTripleTotal = response.data.count
              }
            })
            .catch(function (error) {
              console.log(error)
            })
      }
    },
    //该函数已弃用，目前使用handleSelectionChange进行多选控制
    onTableSelect(rows, row) {
      let selected = rows.length && rows.indexOf(row) !== -1
      //如果选中
      if (selected) {
        this.selectedTripleList.push(row);
        this.selectedTripleTotal = this.selectedTripleList.length;
        if (this.selectedTripleTotal < this.selectedTriplePageSize) {
          this.selectedTriplePageList.push(row);
        }
      }
      //取消选中
      else {
        this.selectedTripleList = this.selectedTripleList.filter(function (item) {
          return item != row;
        });
        //重新计算分页
        this.selectedTriplePageList = this.selectedTripleList.slice(
            (this.selectedTripleCurrentPage - 1) * this.selectedTriplePageSize,
            this.selectedTripleCurrentPage * this.selectedTriplePageSize
        );
        this.selectedTripleTotal -= 1;
      }
    },
    // 多选值的变化
    handleSelectionChange(val) {
      // console.log(val);
      //清空数组
      this.selectedTripleList.splice(0, this.selectedTripleList.length);
      val.forEach((item, index) => {
        this.selectedTripleList.push(item);
      })
      //重新计算分页
      this.selectedTriplePageList = this.selectedTripleList.slice(
          (this.selectedTripleCurrentPage - 1) * this.selectedTriplePageSize,
          this.selectedTripleCurrentPage * this.selectedTriplePageSize
      );

      this.selectedTripleTotal = this.selectedTripleList.length;
    },
    getRowKeys(row) {
      return row.id
    },
    selectedTripleHandleCurrentChange(val) {
      this.selectedTripleCurrentPage = val
      //allData为全部数据
      this.selectedTriplePageList = this.selectedTripleList.slice(
          (this.selectedTripleCurrentPage - 1) * this.selectedTriplePageSize,
          this.selectedTripleCurrentPage * this.selectedTriplePageSize
      );
    },
    selectedTripleHandleSizeChange(val) {
      this.selectedTriplePageSize = val;
      this.selectedTriplePageList = this.selectedTripleList.slice(
          (this.selectedTripleCurrentPage - 1) * this.selectedTriplePageSize,
          this.selectedTripleCurrentPage * this.selectedTriplePageSize
      );
    },
    checkTriplesNum() {
      this.popoverVisible = false;
      if (this.selectedTripleTotal == 0) {
        this.$message({
          showClose: true,
          message: '请至少包含1条三元组',
          type: 'error'
        });
      } else {
        this.kgDialogVisible = true;
      }
    },
    //生成新的候选图谱
    generateNewKG() {
      //axios请求
      axios.post('/api/candidateKg/new', {
        name: this.kgName,
        comment: this.kgComment
      })
          .then((response) => {
            if (response.status == 200) {
              if (response.data.msg == "success") {
                this.$message({
                  showClose: true,
                  message: '新候选图谱添加成功!',
                  type: 'success'
                });
                this.insertCandidateTriplesIntoTriples(response.data.count);
                //将该置空的置空
                this.kgName = ''
                this.kgComment = ''
                this.selectedTriplePageList = []
                this.selectedTripleList = []
                this.candidateTriplePageList = []
                //恢复到第二页并重新请求当页数据
                // this.allTriplePageList=[]
                // this.get_triples(this.allTripleCurrentPage,this.allTriplePageSize)
                //重新请求数据
                // this.get_candidate_triples(this.candidateTripleCurrentPage,this.candidateTriplePageSize)
                // this.get_entities(this.entityCurrentPage,this.entityPageSize)
                // this.get_relations(this.relationCurrentPage,this.relationPageSize)
              } else {
                this.$message({
                  showClose: true,
                  message: '新候选图谱添加失败!',
                  type: 'error'
                });
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //将候选三元组加入所有三元组中
    insertCandidateTriplesIntoTriples(candidateId) {
      //axios请求
      axios.post('/api/triples/insertTriples', {
        id: candidateId,
        triples: this.selectedTripleList
      })
          .then((response) => {
            if (response.status == 200) {
              if (response.data.msg == "success") {
                this.$notify({
                  title: '成功',
                  message: '三元组移动成功!',
                  type: 'success'
                });
              } else {
                this.$notify({
                  title: '失败',
                  message: '三元组移动失败!',
                  type: 'error'
                });
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //radio输入改变动作
    handelInputChange(label) {
      if (label == "实体库") {
        this.get_entities(this.entityCurrentPage, this.entityPageSize)
        $("#entityWarehouse").show();
        $("#relationWarehouse").hide();
        $("#triplesWarehouse").hide();
      } else if (label == "关系库") {
        this.get_relations(this.relationCurrentPage, this.relationPageSize)
        $("#entityWarehouse").hide();
        $("#relationWarehouse").show();
        $("#triplesWarehouse").hide();
      } else if (label == "三元组库") {
        this.get_triples(this.allTripleCurrentPage, this.allTriplePageSize)
        $("#entityWarehouse").hide();
        $("#relationWarehouse").hide();
        $("#triplesWarehouse").show();
      }
    },
    //时间格式化
    dateFormat(data) {
      return moment(new Date(data).getTime()).format('YYYY-MM-DD HH:mm');
    },
    //请求所有实体数据
    //向后端请求所有实体数据
    get_entities(num, limit) {
      //axios请求
      axios.request({
        method: "POST",
        url: '/api/entity/getAllEntity',
        params: {page: num, limit: limit}
      })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.entityTableData = response.data.data
              this.entityTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //实体数据size改变动作
    entityHandleSizeChange(val) {
      //修改当前分页大小
      this.candidateTriplePageSize = val;
      //重新请求数据
      this.get_entities(this.entityCurrentPage, val)
    },
    //实体数据翻页动作
    entityHandleCurrentChange(val) {
      this.get_entities(val, this.entityPageSize)
    },
    //向后端请求所有关系数据
    get_relations(num, limit) {
      //axios请求
      axios.request({
        method: "POST",
        url: '/api/relation/getAllRelation',
        params: {page: num, limit: limit}
      })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.relationTableData = response.data.data
              this.relationTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //关系数据size改变动作
    relationHandleSizeChange(val) {
      //修改当前分页大小
      this.candidateTriplePageSize = val;
      //重新请求数据
      this.get_relations(this.relationCurrentPage, val)
    },
    //关系数据翻页动作
    relationHandleCurrentChange(val) {
      this.get_relations(val, this.relationPageSize)
    },
    //根据所选关系过滤
    filter() {
      if (this.now == null && this.source == "") {
        this.$message({
          message: '请选择有效的筛选条件',
          type: 'warning'
        });
      } else {
        this.isConditionalSearch = true;
        //把当前页数置1,然后用附加条件重新请求
        this.get_candidate_triples_conditional(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
      }
    },
    //重置筛选条件
    reset() {
      this.now = [];
      this.source = "null";
      //设置为false,设置分页第一页,然后重新请求,
      this.isConditionalSearch = false;
      this.candidateTripleCurrentPage = 1;
      this.get_candidate_triples(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
    },
    handleDeleteCandidateTriple(index, row) {
      axios.post('/api/candidateKg/delete', {
        id: row.id,
      })
          .then((response) => {
            if (response.status == 200 && response.data.msg == "success") {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              //删除成功后刷新该页面，判断是否正在条件查找
              if (this.isConditionalSearch == false) {
                this.get_candidate_triples(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
              } else {
                this.get_candidate_triples_conditional(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
              }
            } else {
              this.$message({
                message: '删除失败',
                type: 'danger'
              });
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //修改三元组信息
    handleCandidateTripleEdit(index, row) {
      this.dialogModification = true;
      this.tripleInfo.head = row.head;
      if (row.headCategory != null) {
        this.tripleInfo.head_type = row.headCategory;
      }
      if (row.tailCategory != null) {
        this.tripleInfo.tail_type = row.tailCategory;
      }
      this.tripleInfo.rel = row.relation;
      this.tripleInfo.tail = row.tail;
      this.tripleInfo.id = row.id;
    },
    confirmUpdate() {
      axios.post('/api/candidateKg/update', {
        newTriple: this.tripleInfo,
      })
          .then((response) => {
            if (response.status == 200 && response.data.msg == "success") {
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              //删除成功后刷新该页面，判断是否正在条件查找
              if (this.isConditionalSearch == false) {
                this.get_candidate_triples(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
              } else {
                this.get_candidate_triples_conditional(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
              }
            } else {
              this.$message({
                message: '更新失败',
                type: 'danger'
              });
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    manualUpdate() {
      this.latestUpdateLoading = true;
      axios.post('/api/manualUpdate', {})
          .then((response) => {
            if (response.status == 200 && response.data.msg == "success") {
              this.latestUpateTime = response.data.data;
              this.latestUpdateLoading = false;
              this.$message({
                message: '更新成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: '更新失败',
                type: 'danger'
              });
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    getLatestUpdateTime() {
      axios.post('/api/getLatestUpdateTime', {})
          .then((response) => {
            if (response.status == 200 && response.data.msg == "success") {
              this.latestUpateTime = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //开始任务
    startTask() {
      if (this.timeOption == "") {
        this.$message({
          message: '请选择更新间隔',
          type: 'warning'
        });
      } else if (this.programmeStatus == true) {
        this.$message({
          message: '程序正在运行中,请先结束当前任务',
          type: 'warning'
        });
      } else {
        //向后端发送启动任务命令
        axios.request({
          method: "POST",
          url: '/api/startTask',
          params: {interval: this.timeOption}
        })
            .then((response) => {
              if (response.status == 200&&response.data.msg=="success") {
                this.$message({
                  message: '启动成功',
                  type: 'success'
                });
                //重新获取运行状态
                this.getLatestUpdateTime();
                this.getLatestUpdateInfo();
                this.getProgrammeStatus();
              }
            })
            .catch(function (error) {
              console.log(error)
            })
      }
    },
    //结束任务
    stopTask() {
      if (this.programmeStatus == false) {
        this.$message({
          message: '当前程序未运行',
          type: 'warning'
        });
      }
      else{
        axios.request({
          method: "POST",
          url: '/api/stopTask',
        })
            .then((response) => {
              if (response.status == 200&&response.data.msg=="success") {
                this.$message({
                  message: '结束成功',
                  type: 'success'
                });
                //重新获取运行状态
                this.getLatestUpdateTime();
                this.getLatestUpdateInfo();
                this.getProgrammeStatus();
              }
            })
            .catch(function (error) {
              console.log(error)
            })
      }
    },
    getLatestUpdateInfo() {
      axios.post('/api/getLatestUpdateRecords', {})
          .then((response) => {
            if (response.status == 200 && response.data.msg == "success") {
              this.requestData = response.data.data;
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    getProgrammeStatus(){
      axios.post('/api/getLatestProgrammeStatus', {})
          .then((response) => {
            if (response.status == 200 && response.data.msg == "success") {
              this.programmeStatus = response.data.data;
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //窗口打开前回调
    openSetting(){
      //更新信息
      this.getLatestUpdateTime();
      this.getLatestUpdateInfo();
      this.getProgrammeStatus();
    },
    //树形组件单选
    handleCheckChange(data,node,component){
      this.confirmHeadCategory= data.name;
      this.confirmTailCategory = data.name;
    },
    //关闭popover
    cancel(e) {
      this.$refs[e].doClose();
      this.confirmHeadCategory='';
      this.confirmTailCategory='';
    },
    //修改头实体的类别
    confirmOntology(e,row){
      this.$refs[e].doClose();
      if(this.confirmHeadCategory!=''){
        row.headCategory = this.confirmHeadCategory;
        axios.post('/api/candidateKg/updateCategory', {
          name: row.head,
          category: this.confirmHeadCategory
        })
        .then((response) => {
          if (response.status == 200&&response.data.msg=='success') {
            this.$message({
              message: 'category更新成功',
              type: 'success'
            });
          }
          //刷新该页面，判断是否正在条件查找
          if (this.isConditionalSearch == false) {
            this.get_candidate_triples(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
          } else {
            this.get_candidate_triples_conditional(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      }
      this.confirmHeadCategory='';
    },
    //修改尾实体的类被
    confirmOntologyTail(e,row){
      this.$refs[e].doClose();
      if(this.confirmTailCategory!=''){
        row.tailCategory = this.confirmTailCategory;
        axios.post('/api/candidateKg/updateCategory', {
          name: row.tail,
          category: this.confirmTailCategory
        })
            .then((response) => {
              if (response.status == 200&&response.data.msg=='success') {
                this.$message({
                  message: 'category更新成功',
                  type: 'success'
                });
              }
              //刷新该页面，判断是否正在条件查找
              if (this.isConditionalSearch == false) {
                this.get_candidate_triples(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
              } else {
                this.get_candidate_triples_conditional(this.candidateTripleCurrentPage, this.candidateTriplePageSize);
              }
            })
            .catch(function (error) {
              console.log(error)
            })
      }
      this.confirmTailCategory='';
    },
    //popover关闭动作
    popoveLeaveAction(){
      this.confirmHeadCategory='';
      this.confirmTailCategory='';
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
    }
  },
  mounted() {
    // this.get_triples(this.allTripleCurrentPage,this.allTriplePageSize)
    this.get_candidate_triples(this.candidateTripleCurrentPage, this.candidateTriplePageSize)
    this.get_entities(this.entityCurrentPage, this.entityPageSize)
    // this.get_relations(this.relationCurrentPage,this.relationPageSize)
    $("#entityWarehouse").show();
    $("#relationWarehouse").hide();
    $("#triplesWarehouse").hide();
    //获取最近一次请求时间
    this.getLatestUpdateTime();
    this.getLatestUpdateInfo();
    this.getProgrammeStatus();
    //获取本体树数据
    this.getOntologyTreeData();
  }
}
</script>