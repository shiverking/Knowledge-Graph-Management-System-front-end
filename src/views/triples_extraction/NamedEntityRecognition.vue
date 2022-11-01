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
        label="待抽取句子"
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
        label="细粒度实体识别">
        <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
            <p>抽取结果: {{ scope.row.head }}</p>
            <div slot="reference" class="name-wrapper">
                <span>最近一段时间以来，</span>
                <el-tag>美国:国家:{装备图谱,人员图谱}</el-tag>
                <span>在</span>
                <el-tag>南海:地区:{地理图谱}</el-tag>
                <span>地区动作不断，不仅越发频繁，并且力度不断加大，除了每天平均出动4到5架</span>
                <el-tag>侦察机:飞机:{装备图谱}</el-tag>
                <span>外，美军还派出</span>
                <el-tag>“里根”号:航空母舰:{装备图谱}</el-tag>
                <span>和</span>
                <el-tag>“尼米兹”号:航空母舰:{装备图谱}</el-tag>
                <span>两艘航母战斗群前往</span>
                <el-tag>南海:地区:{地理图谱}</el-tag>
                <span>举行联合演习，其频率也达到历史之最，光是在今年7月就已经超过两次。同时，美军驱逐舰以及侦察机多次出没在</span>
                <el-tag>南海:地区:{地理图谱}</el-tag>
                <span>海域。8月8日，美海军</span>
                <el-tag>“里根”号航母作战群:航母战斗群:{装备图谱}</el-tag>
                <span>由</span>
                <el-tag >日本海:地区:{地理图谱}</el-tag>
                <span>转移至</span>
                <el-tag >东海:地区:{地理图谱}</el-tag>
                <span>活动。同时，还发现1架</span>
                <el-tag>P-8A反潜巡逻机:巡逻机:{装备图谱}</el-tag>
                <span>前往</span>
                <el-tag>台湾海峡:地区:{地理图谱}</el-tag>
                <span>南部空域侦察。</span>
            </div>
            </el-popover>
        </template>
        </el-table-column>
        <el-table-column
        label="实体所属类别"
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
        <el-table-column
        label="操作"
        width="180">
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
            sentence: '最近一段时间以来，美国在南海地区动作不断，不仅越发频繁，并且力度不断加大，除了每天平均出动4到5架侦察机外，美军还派出“里根”号和“尼米兹”号两艘航母战斗群前往南海举行联合演习，其频率也达到历史之最，光是在今年7月就已经超过两次。同时，美军驱逐舰以及侦察机多次出没在南海海域。8月8日，美海军“里根”号航母作战群由日本海转移至东海活动。同时，还发现1架P-8A反潜巡逻机前往台湾海峡南部空域侦察。',
          }],
        tableData2: [{
          date: new Date(),
          conflict_typ: '装备图谱,地理图谱',
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