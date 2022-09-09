<template>
  <div>
    <h1>实体对齐</h1>
    <el-steps :active="active" finish-status="success"  style="margin: 10px" simple>
      <el-step title="目标预览" ></el-step>
      <el-step title="实体对齐" ></el-step>
      <el-step title="融合确认" ></el-step>
      <el-step title="质量评估"></el-step>
    </el-steps>
    <div v-if="this.active==0">
    <el-table
        :data="tableData"
        height="350"
        style="width: 100%"
        key="table1"
    >
      <el-table-column
          prop="date"
          label="实体"
          width="180">
      </el-table-column>
      <el-table-column
          prop="name"
          label="关系"
          width="180">
      </el-table-column>
      <el-table-column
          prop="address"
          label="实体">
      </el-table-column>
      <el-table-column
          align="right">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
        </template>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
    </el-pagination>
    <div id="neo4jd3" class="neo4jd3"></div>
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
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
      <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          key="table2"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            label="实体"
            width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="关系"
            width="120">
        </el-table-column>
        <el-table-column
            prop="address"
            label="实体"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
        <el-table :data="gridData">
          <el-table-column property="date" label="实体" width="150"></el-table-column>
          <el-table-column property="name" label="属性" width="200"></el-table-column>
          <el-table-column property="address" label="实体"></el-table-column>
        </el-table>
        <el-button style="margin-top: 12px;" @click="dialogTableVisible = false">确认</el-button>
      </el-dialog>
      <el-button style="margin-top: 12px;" @click="dialogTableVisible = true">筛选确认</el-button>
    </div>
    <div v-if="this.active==2">2</div>
    <div v-if="this.active==3">3</div>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
  </div>
</template>
<style>
.neo4jd3 {
  height: 100%;
  overflow: hidden;
}
</style>
<!--<style src="../../../static/neo4jd3.css"></style>-->
<script src="../../plugins/neo4jd3.js"></script>
<script>
import "../../../static/neo4jd3.css";
// import "../../plugins/neo4jd3.js";
// this.neo4j = new Neo4jd3('#neo4jd3', {
//   minCollision: 60,
//   neo4jDataUrl: '/neo/query',
//   neo4jData: '{"hhh":"ggg","jjj":"fff"}',
// });
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
      value: '',
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      dialogTableVisible: false,
    };
  },

  methods: {
    next() {
      // this.active++;
      if (this.active++ > 2) this.active = 0;
    },
    calculate(){
      console.log("开始计算")
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },

}
</script>