<template>
  <div id="main">
      <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline">

        <el-form-item label="连接类型：">
          <el-input v-model="ruleForm.value" placeholder="请输入类型"></el-input>

        </el-form-item >
        <el-form-item label="创建用户：">
          <el-input v-model="ruleForm.value" placeholder="请输入用户名"></el-input>

        </el-form-item >
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="submitForm('formInline')" >搜索</el-button>
        </el-form-item>

      </el-form>
    <el-button type="primary" icon = "el-icon-circle-plus-outline" size='big'  @click="dialogfileVisible=true">导入文件</el-button>
    <el-button type="primary" icon = "el-icon-circle-plus-outline" size='big'  @click="dialogDBVisible=true">添加数据库</el-button>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 90%" @selection-change="handleSelectionChange">
      <el-table-column
          label="数据源名称"
          prop="name"
          width="200px">
      </el-table-column>
      <el-table-column
          label="类型"
          prop="type"
          width="200px">
      </el-table-column>
      <el-table-column
          label="创建时间"
          prop="create_time"
          width="200px">
      </el-table-column>
      <el-table-column
          label="最近一次更新时间"
          prop="update_time"
          width="200px">
      </el-table-column>
      <el-table-column
          label="创建用户"
          prop="user"
          width="200px">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="100px">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="big" >编辑</el-button>
          <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="文件导入" :visible.sync="dialogfileVisible">
      <el-form :model="fileform">
        <el-form-item label="数据源名称" :label-width="formLabelWidth">
          <el-input v-model="fileform.name"  autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="数据源类型" :label-width="formLabelWidth">
          <el-select v-model="fileform.region" placeholder="请选择类型" >
            <el-option label="txt文件" value="shanghai"></el-option>
            <el-option label="csv文件" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" :label-width="formLabelWidth">
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
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传txt/csv文件</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogfileVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogfileVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加数据库" :visible.sync="dialogDBVisible">

      <el-form :model="DBform">
        <el-form-item label="数据源名称" :label-width="formLabelWidth">
          <el-input v-model="DBform.name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据源类型" :label-width="formLabelWidth">
          <el-select v-model="DBform.region" placeholder="请选择类型">
            <el-option label="mysql" value="shanghai"></el-option>
            <el-option label="neo4j" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库地址" :label-width="formLabelWidth">
          <el-input v-model="DBform.name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" :label-width="formLabelWidth">
          <el-input v-model="DBform.name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口号" :label-width="formLabelWidth">
          <el-input v-model="DBform.name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="DBform.name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="DBform.name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据库说明" :label-width="formLabelWidth">
          <el-input v-model="DBform.name"  autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogfileVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogfileVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StructuredDataToOntology",
  data() {
    return {
      DBform:[
          {

          }],
      formLabelWidth:'120px',
      fileform:[
        {

        }
      ],
      dialogfileVisible:false,
      dialogDBVisible:false,
      ruleForm:[] ,
      tableData: [{
        name: 'test1',
        type: 'mysql',
        create_time: '2022-10-18 16:20',
        update_time:'',
        user:'root',
      },
        {
          name: 'test2',
          type: 'mysql',
          create_time: '2022-10-17 12:30',
          update_time:'',
          user:'root',
        },
        {
          name: 'test3',
          type: 'mysql',
          create_time: '2022-10-17 9:24',
          update_time:'',
          user:'root',
        },
        {
          name: 'test4',
          type: 'mysql',
          create_time: '2022-10-15 12:20',
          update_time:'2022-10-18 16:20',
          user:'admin',
        },
        {
          name: 'test5',
          type: 'mysql',
          create_time: '2022-10-13 10:40',
          update_time:'2022-10-18 16:20',
          user:'admin',
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