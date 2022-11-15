<!-- <template>
  <div style="margin-top:20px">
    <el-card class="box-card" shadow="never">
      <p><b>文件导入</b></p>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger"  type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">格式要求：实体1，实体1类型，实体2，实体2类型，关系，只接受.txt/.csv文件</div>
      </el-upload>
      <el-button style="margin-top:10px" type="primary" @click="open4">读取文本信息</el-button>
      <template>
        <el-table
        :data="pageList"
        border
        style="width: 100%; margin-top: 20px;">
        <el-table-column
        label="日期"
        width="200">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组"
        width>
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
        label="操作"
        width="300">
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
        @current-change="current_change"
        :current-page="currentPage1"
        :page-size="pageSize"
        layout="prev, pager, next"
        style="margin-top:10px"
        :total="total">
      </el-pagination>
      </template>
      <el-button type="primary" style="margin-top: 10px;" @click="open1">置信度检测</el-button>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top:10px">
      <p><b>置信度检测</b></p>
      <el-table
        :data="pageList2"
        border
        style="width: 100%; margin-top: 20px;">
        <el-table-column
        label="日期"
        width="200">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组"
        width>
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
        width="350">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.conflict_typ }}</span>
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
        @current-change="current_change2"
        :current-page="currentPage2"
        :page-size="pageSize"
        layout="prev, pager, next"
        style="margin-top:10px"
        :total="total">
      </el-pagination>
      <el-button type="primary" style="margin-top: 10px;" @click="open2">保存结果</el-button>
      <el-button type="primary" style="margin-top: 10px;" @click="open3">插入图谱</el-button>
    </el-card>  
  </div>
</template> -->
<template>
  <div style="margin-top: 20px;">
    <el-button type="primary"  @click="open1">文件导入</el-button>
    <el-button type="primary" @click="named_entity_extraction" style="margin: 0px;">开始识别</el-button>
    <el-button type="danger" @click="reset" style="margin: 0px;">重置</el-button>
    <el-select v-model="algorithm_value" placeholder="请选择算法">
      <el-option
          v-for="item in algoritm_options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-input
    style="display: block;margin-top:10px;"
    type="textarea"
    :autosize="{ minRows: 2, maxRows: 20}"
    placeholder="请输入内容"
    v-model="extract_data"
    >
    </el-input>
    <el-card shadow="always"  class="ner_card" v-loading="loading">
      <h4 class="ner_label">三元组分类结果</h4>
        <span class="ner_result" id="ner_result">{{printRes}}</span>
    </el-card>
    <el-card shadow="always"  class="ner_card" v-loading="loading">
      <h4 class="ner_label">抽取结果</h4>
      <el-table
          :data="extract_table"
          style="width: 100%">
        <el-table-column
            prop="content"
            label="实体"
            >
        </el-table-column>
        <el-table-column
            prop="label"
            label="类别"
            >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<style>
.ner_card{
  margin-top: 10px;
  margin-bottom: 10px;
}
.ner_label{
  margin: 0px;
}
p {
  word-break: break-all;
  word-wrap: break-word;
  text-indent: 2em;
}
.ner_result{
  word-break: normal;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
</style>
<script>
  export default {
    data() {
      return {
        loading:false,
        extract_data:"本杰明·华盛顿,邦克山号导弹巡洋舰,指挥军舰\n攻击战斗机中队137,凯利“马古”多森巴克,指挥官\n约瑟夫·福斯特,海军部门,部门\n柯蒂斯·威尔伯号导弹驱逐舰,约瑟夫·福斯特,执行官\n安东尼·梅西,道尔顿·特劳斯,同事\n丹·科尔贝克,中校,军衔\n罗纳德·费尔班克斯,美国,国家\n空中指挥与控制中队116,约瑟夫·詹姆斯,指挥军士长\n道尔顿·特劳斯,军士长,军衔\n海上战斗直升机中队6,内森·希基,指挥军士长",
        extract_table:[],
        printRes: [],
      };
    },
    methods: {
      named_entity_extraction(){
        let content = this.extract_data;
        //如果为空，提示
        if(content==""){
          this.$message({
            type: 'warning',
            message: '请输入信息'
          });
        }
        else{
          this.loading = true;
          //axios请求
          axios.post('/pythonApi/triple_classification',{
            data: this.extract_data,
          })
          .then((response)=>{
            if (response.status == 200) {
              this.$message({
                type: 'success',
                message: '抽取成功!'
              });
              let arr = response.data.data;
              //赋值给表格
              this.printRes = response.data.data
              // this.extract_table= response.data.data.preds;
               //设置文本高亮
              // this.setHeightKeyWord(arr);
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      //重置内容
      reset(){
        this.extract_data='';
        this.extract_table = [];
        this.printRes = [];
        $("#ner_result").html("");
      },
      open1() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '置信度检测完成！'),
          type: 'success'
        })
      },
      open2() {
        this.$prompt('请输入保存路径', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '检测结果已保存至目标路径: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });       
        });
      }, 
      open3() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '插入图谱完成！'),
          type: 'success'
        })
      }, 
      open4() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '读取完成！'),
          type: 'success'
        })
      }, 
      current_change (currentPage) { // 当前是第几页
        this.currentPage1 = currentPage
        // this.currentChangePage(this.tableData, currentPage)
        let from = (currentPage - 1) * this.pageSize
        let to = currentPage * this.pageSize
        this.pageList = []
        for (; from < to; from++) {
          if (this.tableData[from]) {
            this.pageList.push(this.tableData[from])
          }
        }
      },
      current_change2 (currentPage) { // 当前是第几页
        this.currentPage2 = currentPage
        // this.currentChangePage(this.tableData, currentPage)
        let from = (currentPage - 1) * this.pageSize
        let to = currentPage * this.pageSize
        this.pageList2 = []
        for (; from < to; from++) {
          if (this.tableData[from]) {
            this.pageList2.push(this.tableData[from])
          }
        }
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    }
  }
</script>