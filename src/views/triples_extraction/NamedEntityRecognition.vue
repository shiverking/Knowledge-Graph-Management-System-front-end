<template>
  <div style="margin-top: 20px;">
<!--    <el-dialog>-->
<!--      <el-card class="box-card" shadow="never">-->
<!--        <p><b>文件导入</b></p>-->
<!--        <el-upload-->
<!--            class="upload-demo"-->
<!--            ref="upload"-->
<!--            action="https://jsonplaceholder.typicode.com/posts/"-->
<!--            :on-preview="handlePreview"-->
<!--            :on-remove="handleRemove"-->
<!--            :file-list="fileList"-->
<!--            :auto-upload="false">-->
<!--          <el-button slot="trigger"  type="primary">选取文件</el-button>-->
<!--          <el-button style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>-->
<!--          <div slot="tip" class="el-upload__tip">格式要求：文本信息，只接受.txt文件</div>-->
<!--        </el-upload>-->
<!--        <el-button style="margin-top:10px" type="primary" @click="open3">读取文本信息</el-button>-->
<!--        <el-table-->
<!--            :data="tableData"-->
<!--            border-->
<!--            style="width: 100%; margin-top: 20px;">-->
<!--          <el-table-column-->
<!--              type="selection"-->
<!--              width="55">-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--              label="日期"-->
<!--              width="200">-->
<!--            <template slot-scope="scope">-->
<!--              <i class="el-icon-time"></i>-->
<!--              <span style="margin-left: 10px">{{ scope.row.date }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--              label="待抽取句子"-->
<!--              width>-->
<!--            <template slot-scope="scope">-->
<!--              <span style="margin-left: 10px">{{ scope.row.sentence }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--              label="操作"-->
<!--              width="180">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button-->
<!--                  size="mini"-->
<!--                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--              <el-button-->
<!--                  size="mini"-->
<!--                  type="danger"-->
<!--                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--        <el-pagination-->
<!--            background-->
<!--            layout="prev, pager, next"-->
<!--            style="margin-top:10px"-->
<!--            :total="1">-->
<!--        </el-pagination>-->
<!--      </el-card>-->
<!--    </el-dialog>-->
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
    :autosize="{ minRows: 2, maxRows: 4}"
    placeholder="请输入内容"
    v-model="extract_data"
    >
    </el-input>
    <el-card shadow="always"  class="ner_card" v-loading="loading">
      <h4 class="ner_label">结果标注</h4>
        <span class="ner_result" id="ner_result">{{extract_data}}</span>
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
  import $ from '../../plugins/jquery.min.js'
  export default {
    data() {
      return {
        //加载
        loading :false,
        activeName: 'first',
        fileList: [],
        //选择算法
        algorithm_value:'',
        algoritm_options: [{
          value: '选项1',
          label: 'BiLSTM_CRF'
        }, {
          value: '选项2',
          label: 'Bert_BiLSTM_CRF'
        }],
        //抽取数据
        extract_data:"约瑟夫·拜登,毕业于特拉华大学和雪城大学，当过一段时间律师，1970年踏入政界，1972年11月当选联邦参议员并六次连任至2009年。1988年和2007年两度竞选美国总统，都没有成功。期间担任参议院司法委员会主席及高级成员16年、对外关系委员会主席及高级成员12年。2008、2013年两度成为奥巴马的竞选搭档。2009—2017年任副总统。2019年4月25日宣布参选美国总统。2021年1月7日确认当选。1月20日宣誓就任。",
        extract_table:[],
        tableData: [{
            date: '2022-11-1-14:26:23',
            sentence: '最近一段时间以来，美国在南海地区动作不断，不仅越发频繁，并且力度不断加大，除了每天平均出动4到5架侦察机外，美军还派出“里根”号和“尼米兹”号两艘航母战斗群前往南海举行联合演习，其频率也达到历史之最，光是在今年7月就已经超过两次。同时，美军驱逐舰以及侦察机多次出没在南海海域。8月8日，美海军“里根”号航母作战群由日本海转移至东海活动。同时，还发现1架P-8A反潜巡逻机前往台湾海峡南部空域侦察。',
          }],
        tableData2: [{
          date: '2022-11-1-14:26:23',
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
      open1() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '抽取完成！'),
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
            message: '抽取结果已保存至目标路径: ' + value
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
          message: h('i', { style: 'color: teal'}, '读取完成！'),
          type: 'success'
        })
      },
      //实体识别
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
          axios.post('/pythonApi/named_entity_extraction',{
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
               this.extract_table= arr;
               //设置文本高亮
              this.setHeightKeyWord(arr);
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
        $("#ner_result").html("");
      },
      //文本高亮
      setHeightKeyWord(keywords) {
        var tempHTML = $("#ner_result").html();
        /* 关键字替换文本 该文本设置有高亮颜色 */
        var replaceText = "<font style='color:red;'>$1</font>";
        for(var i = 0; i < keywords.length; i++) {
          var keyword = keywords[i]["content"];
          /* 关键字正则匹配规则 */
          var r = new RegExp("(" + keyword + ")", "ig");
          /* 将匹配到的关键字替换成我们预设的文本 */
          tempHTML = tempHTML.replace(r, replaceText);
        }
        console.log(tempHTML)
          /* 将文本显示到浏览器上 */
        $("#ner_result").html(tempHTML);
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