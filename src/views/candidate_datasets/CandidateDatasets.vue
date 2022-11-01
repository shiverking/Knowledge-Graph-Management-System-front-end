<template>
  <div class="block" style="margin: 20px;">
    <el-card class="box-card" shadow="never">
      <p><b>候选数据集管理</b></p>
      <el-timeline>
        <el-timeline-item timestamp="2022/10/9" placement="top">
          <el-card>
            <h4>2022_10_9_12_33_45 增量结构化数据</h4>
            <span>提交于 2022/10/9 12:33</span>
            <el-button type="primary" size="mini" style="margin-left:900px" @click="dialogTableVisible = true">编辑</el-button>
            <el-button type="primary" size="mini" style="margin-left">删除</el-button>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2022/10/12" placement="top">
          <el-card>
            <h4>2022_10_12_23_14_33 实体抽取数据</h4>
            <span>提交于 2022/10/12 14:33</span>
            <el-button type="primary" size="mini" style="margin-left:900px">编辑</el-button>
            <el-button type="primary" size="mini" style="margin-left">删除</el-button>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
    <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
    <el-table :data="gridData">
      <el-table-column property="date" label="日期" width="150"></el-table-column>
      <el-table-column property="name" label="姓名" width="200"></el-table-column>
      <el-table-column property="address" label="地址"></el-table-column>
    </el-table>
    </el-dialog>
  </div>
  </template>
<script>
export default {
    data() {
      return {
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
        dialogFormVisible: false,
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
        formLabelWidth: '120px'
      };
    }
  };  
</script>