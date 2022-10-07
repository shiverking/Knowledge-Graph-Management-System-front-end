<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" type="card" style="margin-top: 10px;">
  <el-select v-model="value" placeholder="全部" style="margin-top: 0px;;">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-button>搜索</el-button>  
    <template>
    <el-table
        :data="tableData2"
        border
        style="width: 100%; margin-top: 20px;">
        <el-table-column
        label="日期"
        width="180">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组"
        width="500">
        <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
            <p>头实体: {{ scope.row.head }}</p>
            <p>头实体类型: {{ scope.row.head_typ }}</p>
            <p>尾实体: {{ scope.row.tail }}</p>
            <p>尾实体类型: {{ scope.row.tail_typ }}</p>
            <p>关系: {{ scope.row.rel }}</p>
            <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.head }}</el-tag>
                <el-tag size="medium">{{ scope.row.head_typ }}</el-tag>
                <el-tag size="medium">{{ scope.row.tail }}</el-tag>
                <el-tag size="medium">{{ scope.row.tail_typ }}</el-tag>
                <el-tag size="medium">{{ scope.row.rel }}</el-tag>
            </div>
            </el-popover>
        </template>
        </el-table-column>
        <el-table-column
        label="类别"
        width="180">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.conflict_typ }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作">
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
    </template>
  </el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        options: [{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '人员图谱'
        }, {
          value: '选项3',
          label: '装备图谱'
        }],
        activeName: 'first',
        tableData2: [{
          date: '2016-05-02',
          head: '约翰·保罗·琼斯号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '美国',
          tail_typ: '国家',
          rel: '产国',
          conflict_typ: '装备图谱'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods: {
      next() {
        if (this.active++ > 2) this.active = 0;
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
    }
  }
</script>