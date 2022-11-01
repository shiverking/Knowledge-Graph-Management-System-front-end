<template>
  <div style="margin-top:20px">
    <el-card class="box-card" shadow="never">
      <p><b>文件导入</b></p>
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
      <el-button size type="primary">选取文件</el-button>
      </el-upload>
      <p style="margin-top: 10px;"><font size="3">格式要求：实体1，实体1类型，实体2，实体2类型，关系，只接受.txt/.csv文件</font></p>
      <template>
        <el-table
        :data="tableData"
        style="width: 100%; margin-top:10px"
        border
        max-height="250">
          <el-table-column
            fixed
            prop="date"
            label="时间"
            width>
          </el-table-column>
          <el-table-column
            prop="name"
            label="头实体"
            width>
          </el-table-column>
          <el-table-column
            prop="province"
            label="头实体类型"
            width>
          </el-table-column>
          <el-table-column
            prop="city"
            label="尾实体"
            width>
          </el-table-column>
          <el-table-column
            prop="address"
            label="尾实体类型"
            width>
          </el-table-column>
          <el-table-column
            prop="zip"
            label="关系"
            width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        background
        layout="prev, pager, next"
        style="margin-top:10px"
        :total="1">
        </el-pagination>
      </template>
      <el-button type="primary" style="margin-top: 10px;" @click="next">置信度检测</el-button>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top:10px">
      <p><b>置信度检测</b></p>
      <el-table
        :data="tableData2"
        border
        style="width: 100%; margin-top: 20px;">
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
        width="600">
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
        width>
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
      <el-pagination
      background
      layout="prev, pager, next"
      style="margin-top:10px"
      :total="1">
      </el-pagination>
      <el-button type="primary" style="margin-top: 10px;" @click="next">保存结果</el-button>
      <el-button type="primary" style="margin-top: 10px;" @click="next">插入图谱</el-button>
    </el-card>  
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        tableData: [{
          date: '2016-05-02-12-11-10',
          name: '约翰·保罗·琼斯号导弹驱逐舰',
          province: '驱逐舰',
          city: '巴斯钢铁造船厂',
          address: '制造厂',
          zip: '制造厂'
        }, {
          date: '2016-05-02',
          name: '普林斯顿号导弹巡洋舰',
          province: '巡洋舰',
          city: '英格尔斯造船',
          address: '制造厂',
          zip: '制造厂'
        }, {
          date: '2016-05-04',
          name: '约书亚·温克',
          province: 'Per',
          city: '尼米兹号航空母舰',
          address: '航空母舰',
          zip: '指挥军舰'
        },],
                tableData2: [{
          date: '2016-05-02-12-11-10',
          head: '约翰·保罗·琼斯号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '巴斯钢铁造船厂',
          tail_typ: '制造厂',
          rel: '制造厂',
          conflict_typ: '0.85767',
          result: '补全成功'
        }, {
          date: '2016-05-02',
          head: '普林斯顿号导弹巡洋舰',
          head_typ: '巡洋舰',
          tail: '英格尔斯造船',
          tail_typ: '制造厂',
          rel: '制造厂',
          conflict_typ: '0.84767',
          result: '补全成功'
        }, {
          date: '2016-05-02-12-11-10',
          head: '约书亚·温克',
          head_typ: 'Per',
          tail: '尼米兹号航空母舰',
          tail_typ: '航空母舰',
          rel: '指挥军舰',
          conflict_typ: '0.88767',
          result: '补全成功'
        },]
      };
    },

    methods: {
      next() {
        if (this.active++ > 2) this.active = 0;
      }
    }
  }
</script>