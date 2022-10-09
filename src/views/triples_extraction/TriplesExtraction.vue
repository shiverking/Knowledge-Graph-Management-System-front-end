<template>
  <div style="margin-top: 20px;">
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
        <p style="margin-top: 10px;"><font size="3">格式要求：文本信息，只接受.txt文件</font></p>
               <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%; margin-top: 20px;">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150">
            </el-table-column>
            <el-table-column
              fixed
              prop="sentence"
              label="待抽取文本"
              width>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100">
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
            :total="1000">
          </el-pagination>
        </template>
          <el-button type="primary" style="margin-top: 10px;" @click="next">开始抽取</el-button>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top:10px">
      <p><b>三元组抽取</b></p>
      <el-table
          :data="tableData2"
          border
          style="width: 100%; margin-top: 20px;">
          <el-table-column
                type="selection"
                width="55">
          </el-table-column>
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
          label="所属类别"
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
      <el-pagination
            background
            layout="prev, pager, next"
            style="margin-top:10px"
            :total="1000">
      </el-pagination>
      <el-button type="primary" style="margin-top: 10px;" @click="next">生成候选数据集</el-button>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        tableData:[{
          date: '2016-05-03',
          sentence: '近日，至少已拖期三次的美国“福特”号航母，即将正式入役美国海军。众所周知，现役的“尼米兹”级核动力航母装设有A4W核动力装置。',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },],
        tableData2: [{
          date: '2016-05-02',
          head: '“福特号”航母',
          head_typ: '航空母舰',
          tail: '美国海军',
          tail_typ: '机构',
          rel: '入役',
          conflict_typ: '装备图谱',
          storage_mode: 'neo4j'
        }, {
          date: '2016-05-02',
          head: '“尼米兹”级核动力航母',
          head_typ: '航空母舰',
          tail: 'A4W核动力装置',
          tail_typ: '装备',
          rel: '装备',
          conflict_typ: '装备图谱',
          storage_mode: 'neo4j'
        },]
      };
    },

    methods: {
      next() {
        if (this.active++ > 2) this.active = 0;
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      }
    }
  }
</script>