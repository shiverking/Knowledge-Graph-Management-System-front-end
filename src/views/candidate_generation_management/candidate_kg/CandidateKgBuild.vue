<template>
  <div style="margin-top: 20px;">
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
                >
            </el-table-column>
            <el-table-column
                prop="category"
                label="类别"
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
              style="width: 100%; margin-top:10px"
          >
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column
                label="头实体"
                width>
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.head }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="关系"
                width>
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium" type="warning">{{ scope.row.relation}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                label="尾实体"
                width>
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.tail }}
                  <el-tag size="medium" type="info">{{ scope.row.tail}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag size="medium" type="success">{{ scope.row.status}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ dateFormat(scope.row.time)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属候选图谱">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.candidateId}}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作">
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
            <el-date-picker
                v-model="value1"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>
            <el-button type="primary" style="margin-top: 10px;" @click="load_all()">筛选</el-button>
          </div>
        <keep-alive>
          <el-table
              ref="candiateMultipleTable"
              :data="candidateTriplePageList"
              border
              style="width: 100%; margin-top:10px"
              @select='onTableSelect'
              @selection-change="handleSelectionChange"
              :row-key="getRowKeys"
              key="2">
            <el-table-column type="selection" :reserve-selection="true">
            </el-table-column>
            <el-table-column
                label="头实体"
                width>
              <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    {{ scope.row.head }}
                    <el-tag size="small" type="info">{{ scope.row.headCategory }}</el-tag>
                  </div>
              </template>
            </el-table-column>
            <el-table-column
                label="关系"
                width>
              <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" type="warning">{{ scope.row.relation }}</el-tag>
                  </div>
              </template>
            </el-table-column>
            <el-table-column
                label="尾实体"
                width>
              <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                   {{ scope.row.tail }}
                    <el-tag size="medium" type="info">{{ scope.row.tailCategory }}</el-tag>
                  </div>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag size="medium" type="danger">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="到来时间">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ dateFormat(scope.row.time)}}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作">
              <template slot-scope="scope">
                <el-button
                    size="warning" icon="el-icon-edit" circle
                    @click="handleEdit(scope.$index, scope.row)"></el-button>
                <el-button
                    type="danger" icon="el-icon-delete" circle
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
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
      </el-tab-pane>
      <el-tab-pane label="已选择" name="third">
        <el-dialog
          title="生成信息确认"
          :visible.sync="kgDialogVisible"
          width="30%">
          <div>
            <el-input placeholder="请输入候选图谱名称" v-model="kgName" required="true"></el-input>
            <el-input placeholder="为该候选图谱添加备注(可选)" style="display: grid;margin-top: 10px;" v-model="kgComment" ></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="kgDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="kgDialogVisible = false;generateNewKG()">确 定</el-button>
        </span>
        </el-dialog>
        <el-popover
            placement="top"
            width="250"
            v-model="popoverVisible">
          <p>确定将这{{selectedTripleTotal}}条三元组生成候选图谱吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="checkTriplesNum()">确定</el-button>
          </div>
          <el-button type="primary" slot="reference" >生成候选图谱</el-button>
        </el-popover>
        <el-table
            :data="selectedTriplePageList"
            border
            style="width: 100%; margin-top:10px"
           >
          <el-table-column
              label="头实体"
              width>
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.head }}
                <el-tag size="small" type="info">{{ scope.row.headCategory }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="关系"
              width>
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" type="warning">{{ scope.row.relation }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="尾实体"
              width>
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
<script>
  import $ from '../../../plugins/jquery.min.js';
  import moment from "moment";
  export default {
    data() {
      return {
        multipleSelection: [],
        activeName: 'first',
        tabSelection:'实体库',
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
        value1: [new Date().getTime() - 3600 * 1000 * 24 * 1, new Date()],

        //已选择三元组列表
        allTriplePageList:[],
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
        kgDialogVisible:false,
        popoverVisible:false,
        //确认生成候选图谱对话框
        labelPosition:"left",
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },
        //已选择三元组列表
        selectedTripleList: [],
        selectedTriplePageList:[],
        //已选三元组分页
        selectedTripleCurrentPage: 1,
        selectedTripleTotal: 0,
        selectedTriplePageSize: 10,
        selectedTriplePageSizes: [10, 50, 100, 200],
        //生成候选图谱所需数据
        kgName:'',
        kgComment:'',
        //实体库数据
        entityTableData:[],
        entityCurrentPage:1,
        entityPageSize:10,
        entityPageSizes: [10, 50, 100, 200],
        entityTotal:0,
        //关系库数据
        relationTableData:[],
        relationCurrentPage:1,
        relationPageSize:10,
        relationPageSizes: [10, 50, 100, 200],
        relationTotal:0
      }
    },
    methods: {
      //处理所有三元组分页事件
      allTripleHandleSizeChange(val) {
        //修改当前分页大小
        this.allTriplePageSize = val;
        //重新请求数据
        this.get_triples(this.allTripleCurrentPage,val)
      },
      //翻页动作
      allTripleHandleCurrentChange(val) {
        this.get_triples(val,this.allTriplePageSize)
      },
      //向后端请求所有三元组数据
      get_triples(num, limit) {
        //axios请求
        axios.request({
          method:"POST",
          url:'/api/triples/getAllTriplesByPage',
          params:{page:num,limit:limit}
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
      },
      //处理候选三元组分页事件
      candidateTripleHandleSizeChange(val) {
        //修改当前分页大小
        this.candidateTriplePageSize = val;
        //重新请求数据
        this.get_candidate_triples(this.candidateTripleCurrentPage,val)
      },
      //翻页动作
      candidateTripleHandleCurrentChange(val) {
        this.get_candidate_triples(val,this.candidateTriplePageSize)
      },
      //向后端请求候选三元组数据
      get_candidate_triples(num, limit) {
        //axios请求
        axios.request({
          method:"POST",
          url:'/api/triples/getAllCandidateTriples',
          params:{page:num,limit:limit}
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
      onTableSelect(rows, row) {
        let selected = rows.length && rows.indexOf(row) !== -1
        //如果选中
        if(selected){
          this.selectedTripleList.push(row);
          this.selectedTripleTotal = this.selectedTripleList.length;
          if(this.selectedTripleTotal<this.selectedTriplePageSize){
            this.selectedTriplePageList.push(row);
          }
        }
        else {
          this.selectedTripleList = this.selectedTripleList.filter(function (item) {
                return item != row;
              });
          //重新计算分页
          this.selectedTriplePageList = this.selectedTripleList.slice(
              (this.selectedTripleCurrentPage - 1) * this.selectedTriplePageSize,
              this.selectedTripleCurrentPage * this.selectedTriplePageSize
          );
          this.selectedTripleTotal-=1;
        }
      },
      getRowKeys(row) {
        return row.id
      },
      selectedTripleHandleCurrentChange(val){
        this.selectedTripleCurrentPage = val 
        //allData为全部数据
        this.selectedTriplePageList = this.selectedTripleList.slice(
            (this.selectedTripleCurrentPage - 1) * this.selectedTriplePageSize,
            this.selectedTripleCurrentPage * this.selectedTriplePageSize
        );
      },
      checkTriplesNum(){
        this.popoverVisible = false;
        if(this.selectedTripleTotal==0){
          this.$message({
            showClose: true,
            message: '请至少包含1条三元组',
            type: 'error'
          });
        }
        else{
          this.kgDialogVisible = true;
        }
      },
      //生成新的候选图谱
      generateNewKG(){
        //axios请求
        axios.post('/api/candidateKg/new',{
          name: this.kgName,
          comment: this.kgComment
        })
        .then((response) => {
          if (response.status == 200) {
            if(response.data.msg=="success"){
              this.$message({
                showClose: true,
                message: '新候选图谱添加成功!',
                type: 'success'
              });
              this.insertCandidateTriplesIntoTriples(response.data.count);
              //将该置空的置空
              this.kgName = ''
              this.kgComment= ''
              this.selectedTriplePageList = []
              this.selectedTripleList = []
              this.candidateTriplePageList = []
              //重新请求数据
              this.get_triples(this.allTripleCurrentPage,this.allTriplePageSize)
              this.get_candidate_triples(this.candidateTripleCurrentPage,this.candidateTriplePageSize)
              this.get_entities(this.entityCurrentPage,this.entityPageSize)
              this.get_relations(this.relationCurrentPage,this.relationPageSize)
            }
            else{
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
      insertCandidateTriplesIntoTriples(candidateId){
        //axios请求
        axios.post('/api/triples/insertTriples',{
          id: candidateId,
          triples: this.selectedTripleList
        })
        .then((response) => {
          if (response.status == 200) {
            if(response.data.msg=="success"){
              this.$notify({
                title: '成功',
                message: '三元组移动成功!',
                type: 'success'
              });
            }
            else{
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
      handelInputChange(label){
        if(label == "实体库"){
          $("#entityWarehouse").show();
          $("#relationWarehouse").hide();
          $("#triplesWarehouse").hide();
        }
        else if(label == "关系库"){
          $("#entityWarehouse").hide();
          $("#relationWarehouse").show();
          $("#triplesWarehouse").hide();
        }
        else if(label == "三元组库"){
          $("#entityWarehouse").hide();
          $("#relationWarehouse").hide();
          $("#triplesWarehouse").show();
        }
      },
      //时间格式化
      dateFormat(data) {
        return moment(new Date(data).getTime()).format('YYYY-MM-DD');;

      },
      //请求所有实体数据
      //向后端请求所有实体数据
      get_entities(num, limit) {
        //axios请求
        axios.request({
          method:"POST",
          url:'/api/entity/getAllEntity',
          params:{page:num,limit:limit}
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
      entityHandleSizeChange(val){
        //修改当前分页大小
        this.candidateTriplePageSize = val;
        //重新请求数据
        this.get_entities(this.entityCurrentPage,val)
      },
      //实体数据翻页动作
      entityHandleCurrentChange(val){
        this.get_entities(val,this.entityPageSize)
      },
      //向后端请求所有关系数据
      get_relations(num, limit) {
        //axios请求
        axios.request({
          method:"POST",
          url:'/api/relation/getAllRelation',
          params:{page:num,limit:limit}
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
      relationHandleSizeChange(val){
        //修改当前分页大小
        this.candidateTriplePageSize = val;
        //重新请求数据
        this.get_relations(this.relationCurrentPage,val)
      },
      //关系数据翻页动作
      relationHandleCurrentChange(val){
        this.get_relations(val,this.relationPageSize)
      },
    },
    mounted() {
      this.get_triples(this.allTripleCurrentPage,this.allTriplePageSize)
      this.get_candidate_triples(this.candidateTripleCurrentPage,this.candidateTriplePageSize)
      this.get_entities(this.entityCurrentPage,this.entityPageSize)
      this.get_relations(this.relationCurrentPage,this.relationPageSize)
      $("#entityWarehouse").show();
      $("#relationWarehouse").hide();
      $("#triplesWarehouse").hide();
    }
  }
</script>