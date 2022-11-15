<template>
  <div>
    <div>
      <br>
      <el-upload
          class="upload-demo"
          ref="upload"
          action
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handle"
          :file-list="fileList"
          :show-file-list="false"
          accept=".xls,.xlsx"
          :auto-upload="false">
        <el-button slot="trigger"  type="primary">选取文件</el-button>
<!--        <el-button style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>-->
        <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>
      </el-upload>



    </div>
    <el-table
        :data="tableData"
        border
        style="width: 95%">
      <el-table-column
          fixed
          prop="id"
          label="编号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="head"
          label="头实体"
          width="200">
      </el-table-column>
      <el-table-column
          prop="head_typ"
          label="头实体类型"
          width="200">
      </el-table-column>
      <el-table-column
          prop="tail"
          label="尾实体"
          width="200">
      </el-table-column>
      <el-table-column
          prop="tail_typ"
          label="尾实体类型"
          width="200">
      </el-table-column>
      <el-table-column
          prop="rel"
          label="关系"
          width="150">
      </el-table-column>




    </el-table>

<!--    <el-pagination-->
<!--        background-->
<!--        layout="prev, pager, next"-->
<!--        :page-size="pageSize"-->
<!--        :total="total"-->
<!--        @current-change="page">-->
<!--    </el-pagination>-->
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import {readFile}from '../../plugins/xlsx'
export default {
  data() {
    return {
      fileList: [],
      tableData:[],
    }
  },
  methods: {
    async handle(ev1){
      let file = ev1.raw;
      if(!file) return;
      let data =  await readFile(file);
      let workboot = XLSX.read(data,{type:"binary"});
      let worksheet = workboot.Sheets[workboot.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet);
      this.tableData=data
    },

    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    }
  }
}
</script>