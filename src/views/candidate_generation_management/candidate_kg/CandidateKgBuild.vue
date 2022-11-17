<template>
  <div style="margin-top: 20px;">
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabChange">
      <el-tab-pane label="三元组" name="first">
        <el-table
            :data="candidateTriplePageList"
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
              <span style="margin-left: 10px">{{ scope.row.time}}</span>
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
            @size-change="candidateTripleHandleSizeChange"
            @current-change="candidateTripleHandleCurrentChange"
            :current-page="candidateTripleCurrentPage"
            :page-sizes="candidateTriplePageSizes"
            :page-size="candidateTriplePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="candidateTripleTotal"
            key="1">
        </el-pagination>
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
                <span style="margin-left: 10px">{{ scope.row.time}}</span>
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
          title="确认"
          :visible.sync="kgDialogVisible"
          width="30%">
          <el-input placeholder="请输入候选图谱名称"></el-input>
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
          <el-table-column type="selection">
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
  export default {
    data() {
      return {
        multipleSelection: [],
        activeName: 'first',
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
        tableListData: [], // 列表数据
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
      }
    },
    methods: {
      //处理tab页点击事件
      handleTabChange(tab, event) {
        // if(tab.name=="second"){
        //   this.get_candidate_triples(this.candidateTripleCurrentPage,this.candidateTriplePageSize)
        // }
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
        this.$message({
          showClose: true,
          message: '新候选图谱添加成功!',
          type: 'success'
        });
      }
      // del_all() {
      //   for (var i = 0; i < this.multipleSelection.length; i++) {
      //     for (var j = 0; j < this.tableData.length; j++) {
      //       if (this.tableData[j] == this.multipleSelection[i])
      //         this.tableData.splice(j, 1)
      //     }
      //   }
      // },
      // getNowTime() {
      //   var date = new Date();
      //   //年 getFullYear()：四位数字返回年份
      //   var year = date.getFullYear(); //getFullYear()代替getYear()
      //   //月 getMonth()：0 ~ 11
      //   var month = date.getMonth() + 1;
      //   //日 getDate()：(1 ~ 31)
      //   var day = date.getDate();
      //   //时 getHours()：(0 ~ 23)
      //   var hour = date.getHours();
      //   //分 getMinutes()： (0 ~ 59)
      //   var minute = date.getMinutes();
      //   //秒 getSeconds()：(0 ~ 59)
      //   var second = date.getSeconds();
      //   var time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + '-' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
      //   console.log(time)
      //   return time;
      // },
      // //小于10的拼接上0字符串
      // addZero(s) {
      //   return s < 10 ? ('0' + s) : s;
      // },
      //
      // handleEdit(index, row) {
      //   console.log(index, row);
      // },
      // handleDelete(index, row) {
      //   console.log(index, row);
      //   row.splice(index, 1);
      // },
    },
    mounted() {
      this.get_candidate_triples(this.candidateTripleCurrentPage,this.candidateTriplePageSize)
    }
  }
</script>