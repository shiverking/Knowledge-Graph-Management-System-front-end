<template>
  <div>
    <el-steps :active="active" finish-status="success"  style="margin: 10px" simple>
      <el-step title="生成候选" ></el-step>
      <el-step title="实体对齐" ></el-step>
      <el-step title="图谱融合" ></el-step>
      <el-step title="质量评估"></el-step>
    </el-steps>
    <div v-if="this.active==0">
    <el-button style="margin-top: 12px;" @click="dialogAllKGVisible = true">查看所有图谱</el-button>
      <span>当前选择图谱名称:militarykg</span>
      <el-dialog :visible.sync="dialogAllKGVisible">
      <el-form :model="form">
        <el-form-item label="图谱名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAllKGVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogAllKGVisible = false;displayKgItems">确 定</el-button>
      </div>
    </el-dialog>
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
        :page-sizes=pageSizes
        :page-size=pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
    </el-pagination>
      <el-button style="margin-top: 12px;" @click="dialogTwoDViewVisible=true">预览</el-button>
      <el-dialog :visible.sync="dialogTwoDViewVisible" custom-class="previewDialog"
                 fullscreen
                 close-on-press-escape
      >
        <TwoDView></TwoDView>
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
<!--        <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>-->
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
      <el-select v-model="value" placeholder="选择融合策略">
        <el-option
            v-for="item in strategy"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-top: 12px;" >开始融合</el-button>
<!--      <el-button style="margin-top: 12px;" >查看结果</el-button>-->
      <el-progress :text-inside="false" :stroke-width="15" :percentage="70" style="margin-top: 10px;margin-bottom: 10px"></el-progress>
      <el-result icon="success" title="融合成功">
        <template slot="extra">
          <el-button type="primary" size="medium">查看结果</el-button>
        </template>
      </el-result>
    </div>
    <div v-if="this.active==3">
      <el-button style="margin-top: 12px;" >融合评分计算</el-button>
      <el-progress :text-inside="false" :stroke-width="15" :percentage="70" style="margin-top: 10px;margin-bottom: 10px"></el-progress>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>最终评分 86</span>
<!--          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
        </div>
        <div v-for="o in 4" :key="o" class="text item">
          {{'问题列表' + o }}
        </div>
      </el-card>
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

</style>
<script>
import TwoDView from "../visualization/2dView";
import store from "../../store";
export default {
  components: {TwoDView},
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
      value: '',
      tableData: [],
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
      dialogTwoDViewVisible:false,
      dialogAllKGVisible:false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      //分页设置
      pageSize:"50",
      pageSizes:"[50, 100, 150, 200]",
      total:"400"
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
    },
    handleCurrentChange(val){
        axios.post('/api/kg/getAllTriples', this.$qs.stringify({
          page:`${val}`,
          limit: this.pageSize
        }),{headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then((response) => {
          console.log(response)
          //获取信息成功
          // if (response.status==200) {
          //   this.total = response
          // }
      })
      // ${val}
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