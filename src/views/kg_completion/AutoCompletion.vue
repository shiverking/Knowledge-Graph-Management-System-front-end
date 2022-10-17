<template>
  <div style="margin-top: 10px;">
    <el-card class="box-card" shadow="never">
      <p><b>设置补全模型</b></p>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
      <span style="margin-top; margin-right:10px"><font size="3">当前补全模型版本为<b>{{message}}</b></font></span>
      <el-button size type="primary">选择模型</el-button>
      </el-upload>
    </el-card>
    <el-card class="box-card" style="margin-top:10px" shadow="never">
      <p><b>选择候选数据集</b></p>
      <el-button size type="primary">选择候选数据集</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top:10px;">
        <el-table-column
          fixed
          prop="date"
          label="创建时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="候选数据集名称"
          width>
        </el-table-column>
        <el-table-column
          prop="province"
          label="三元组数目"
          width="120">
        </el-table-column>
        <el-table-column
          prop="city"
          label="插入状态"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="mini">查看</el-button>
            <el-button type="text" size="mini">编辑</el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        style="margin-top:10px"
        :total="1000">
      </el-pagination>
      <el-button size type="primary" style="margin-top:10px">置信度检测</el-button>
    </el-card>
    <el-card class="box-card" style="margin-top:10px" shadow="never">
      <p><b>插入图谱</b></p>
      <el-table
          :data="tableData2"
          border
          style="width: 100%; margin-top;">
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
          label="三元组置信度"
          width="180">
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.conflict_typ }}</span>
          </template>
          </el-table-column>
          <el-table-column
          label="补全结果"
          width="180">
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.result }}</span>
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
      <el-pagination
        background
        layout="prev, pager, next"
        style="margin-top:10px"
        :total="1000">
      </el-pagination>
      <el-button size type="primary" style="margin-top:10px">插入图谱</el-button>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        message: ' model2_TransE_2022_10_7_21_45.h5',
        options: [{
          value: '选项1',
          label: '2022-10-8'
        }, {
          value: '选项2',
          label: '2022-10-9'
        }, {
          value: '选项3',
          label: '2022-10-10'
        }],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333
        }, {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        }],
        tableData2: [{
          date: '2016-05-02',
          head: '约翰·保罗·琼斯号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '台湾',
          tail_typ: '国家',
          rel: '产国',
          conflict_typ: '0.38767',
          result: '补全失败'
        }, {
          date: '2016-05-04',
          head: '普林斯顿号导弹巡洋舰',
          head_typ: '巡洋舰',
          tail: '英格尔斯造船',
          tail_typ: '制造厂',
          rel: '制造厂',
          conflict_typ: '0.88767',
          result: '补全成功'
        }, {
          date: '2016-05-01',
          head: '约书亚·温克',
          head_typ: '人物',
          tail: '尼米兹号航空母舰',
          tail_typ: '航空母舰',
          rel: '指挥军舰',
          conflict_typ: '0.83767',
          result: '补全成功'
        },]
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
      handleClick(row) {
        console.log(row);
      }
    }
  }
</script>