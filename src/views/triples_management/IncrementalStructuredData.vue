<template>
  <div style="margin-top: 20px;">
    <el-card class="box-card" shadow="never">
      <p><b>结构化增量数据</b></p>
      <el-table
        :data="tableData2"
        border
        style="width: 100%; margin-top: 10px;">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
        label="日期"
        width>
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
        <el-table-column
        label="存储方式"
        width="180">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.storage_mode }}</span>
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
      <el-button type="primary" style="margin-top: 10px;" @click="next">生成候选数据集</el-button>
    </el-card>
  </div>
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
          conflict_typ: '装备图谱',
          storage_mode: 'neo4j'
        }, {
          date: '2016-05-02',
        head: '普林斯顿号导弹巡洋舰',
        head_typ: '巡洋舰',
        tail: '英格尔斯造船',
        tail_typ: '制造厂',
        rel: '制造厂',
        conflict_typ: '装备图谱',
        storage_mode: 'neo4j'
        }, {
          date: '2016-05-02-12-11-10',
        head: '约书亚·温克',
        head_typ: 'Per',
        tail: '尼米兹号航空母舰',
        tail_typ: '航空母舰',
        rel: '指挥军舰',
        conflict_typ: '人员图谱',
        storage_mode: 'neo4j'
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