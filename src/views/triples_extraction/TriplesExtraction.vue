<template>
  <div style="margin-top: 20px;">
    <el-card class="box-card" shadow="never">
      <p><b>文件导入</b></p>
      <p style="margin-top: 10px;"><font size="3">格式要求：文本信息，只接受.txt文件</font></p>
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :multiple="true"
        :show-file-list="true"
        accept=".txt"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
        :limit="1"
        :on-exceed="handleExceed"
        :on-change="handleChange"
        :file-list="fileList">
        <el-button size type="primary">选取文件</el-button>
      </el-upload>
      <el-button style="margin-top:10px" type="primary" @click="load_txt()">读取文本信息</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px;">
        <el-table-column
              type="selection"
              width="55">
        </el-table-column>
        <el-table-column
        label="日期"
        width="400">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="待抽取文本"
        width>
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sentence }}</span>
        </template>
        </el-table-column>
        <el-table-column 
        label="操作"
        width="180">
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
      <el-button type="primary" style="margin-top: 10px;" @click="load_entitis()">开始抽取</el-button>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top:10px">
      <p><b>实体抽取</b></p>
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
        width="400">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="待抽取句子"
        width>
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sentence }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组抽取">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.triples }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="所属图谱"
        width="100">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.conflict_typ }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="存储方式"
        width="100">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.storage_mode }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">选择</el-button>
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
      <el-button type="primary" style="margin-top: 10px;" @click="open2()">保存结果</el-button>
      <el-button type="primary" style="margin-top: 10px;" @click="open()">生成候选数据集</el-button>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        fileList: [],
        tableData: [{
            date: new Date(),
            sentence: '尼米兹号航空母舰采用核动力推进，装备4座升降机、4台蒸汽弹射器和4条拦阻索，可以每20秒弹射一架作战飞机。舰载作战联队中的机型配备根据作战任务性质的有所不同，可搭载不同用途的舰载飞机对敌方飞机、舰船、潜艇和陆地目标发动攻击，并保护海上舰队。',
          }],
        tableData2: [{
          date: new Date(),
          sentence: '尼米兹号航空母舰采用核动力推进，装备4座升降机、4台蒸汽弹射器和4条拦阻索，可以每20秒弹射一架作战飞机。',
          triples: '(尼米兹号航空母舰,航空母舰,核动力推进,技术,技术),(尼米兹号航空母舰,航空母舰,升降机,装备,装备),(尼米兹号航空母舰,航空母舰,蒸汽弹射器,装备,装备),(尼米兹号航空母舰,航空母舰,拦阻索,装备,装备),(尼米兹号航空母舰,航空母舰,飞机,作战装备,搭载)',
          conflict_typ: '装备图谱',
          storage_mode: 'neo4j'
        },{
          date: new Date(),
          sentence: '舰载作战联队中的机型配备根据作战任务性质的有所不同，可搭载不同用途的舰载飞机对敌方飞机、舰船、潜艇和陆地目标发动攻击，并保护海上舰队。',
          triples: '(舰载作战联队,舰载机联队,飞机,作战装备,搭载),(舰载作战联队,舰载机联队,飞机,作战装备,作战目标),(舰载作战联队,舰载机联队,舰船,作战装备,作战目标),(舰载作战联队,舰载机联队,潜艇,作战装备,作战目标)',
          conflict_typ: '装备图谱',
          storage_mode: 'neo4j'
        }],
      };
    },

    methods: {
      handleSuccess(){
        this.$refs.upload.clearFiles()
        this.$message({
          message: '上传成功',
          type:'success'
        })
      },
      handleError() {
        this.$message({
          message: '上传失败',
          type:'error'
        })
      },
      handleBeforeUpload(file) {
        const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        const fileTypeList = ['txt']
        if (!fileTypeList.includes(fileType)) {
          this.$message({
            message: '上传文件只能是txt格式',
            type: 'error'
          })
          this.fileList = []
          return false
        }
        return true
      },
      // 上传文件数超过限制
      handleExceed() {
        this.$message({
          message: '最大上传文件个数为1',
          type: 'error'
        })
      },
      // 文件状态改变时
      handleChange(file) {
        console.log(file.status)
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },    
      open() {
        this.$confirm('已选中的数据将生成候选数据集！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '成功生成候选数据集!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
      open2() {
        this.$prompt('请输入保存路径', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '抽取结果已保存至目标路径: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });       
        });
      },
      load_file(){
        fileList.push(
        {
          name: '2022-10-11-10:35:25.txt',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
        )
      }
    }
  }
</script>
<style>
  .comment{
      white-space:pre-wrap;
  }
</style>