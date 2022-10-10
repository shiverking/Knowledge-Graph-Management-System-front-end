<template>
  <div id="main">
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="数据库url"
        prop="url"
        width="300px">
      </el-table-column>
      <el-table-column
        label="数据库"
        prop="database"
        width="300px">
      </el-table-column>
      <el-table-column
        label="选择数据表"
        prop="table"
        width="600px">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="startCreateCandidateOntology()">开始构建候选本体</el-button>
      <el-button type="primary" @click="toggleSelection()">取消选择</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StructuredDataToOntology",
  data() {
    return {
      tableData: [{
        url: '2016-05-03',
        database: '王小虎',
        table: '上海市普陀区金沙江路 1518 弄'
      }, {
        url: '2016-05-02',
        database: '王小虎',
        table: '上海市普陀区金沙江路 1518 弄'
      }, {
        url: '2016-05-04',
        database: '王小虎',
        table: '上海市普陀区金沙江路 1518 弄'
      }, {
        url: '2016-05-01',
        database: '王小虎',
        table: '上海市普陀区金沙江路 1518 弄'
      }, {
        url: '2016-05-08',
        database: '王小虎',
        table: '上海市普陀区金沙江路 1518 弄'
      }, {
        url: '2016-05-06',
        database: '王小虎',
        table: '上海市普陀区金沙江路 1518 弄'
      }, {
        url: '2016-05-07',
        database: '王小虎',
        table: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },
  methods: {
    startCreateCandidateOntology(){
      this.$alert('是否确认开始构建', '确认构建', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '构建成功'
          });
        }
      });
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
  }
}
</script>

<style scoped>

</style>