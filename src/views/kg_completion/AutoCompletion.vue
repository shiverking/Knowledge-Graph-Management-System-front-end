<template>
  <div style="margin-top: 20px;">
    <el-button type="primary"  @click="dialogTableVisible = true; get_candidate_datasets()">读取数据集</el-button>
    <el-dialog title="选择候选数据集" :visible.sync="dialogTableVisible">
      <el-table
        ref="multipleTable"
        :data="gridData"
        tooltip-effect="dark"
        border
        style="width; margin-top: 10px;"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width>
        </el-table-column>
        <el-table-column
          label="创建时间"
          width>
          <template slot-scope="scope">{{ scope.row.time }}</template>
        </el-table-column>
        <el-table-column
          prop="stem"
          label="数据集名称"
          width>
        </el-table-column>
        <el-table-column
          prop="num_of_triples"
          label="三元组数目"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="50">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false; readTriplesFromSelectedDataset()">确定</el-button>
      </div>
    </el-dialog>
    <el-button type="primary" style="margin: 0px;">手动输入</el-button>
    <el-button type="primary" style="margin: 0px;">读取文件</el-button>
    <el-button type="primary" style="margin: 0px;">读取数据库</el-button>
    <el-button type="primary" @click="dialogOfModelSelection = true" style="margin:0px;">开始补全</el-button>
    <el-dialog title="选择补全模型" :visible.sync="dialogOfModelSelection">
      <span style="margin-top; margin-right:10px"><font size="3">当前补全模型为<b>{{model_name}}</b></font></span>
      <el-table
        border
        ref="singleTable"
        :data="modelSelectionTable"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%; margin-top: 10px;">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          property="time"
          label="创建时间"
          width="120">
        </el-table-column>
        <el-table-column
          property="model_name"
          label="模型名称"
          width="120">
        </el-table-column>
        <el-table-column
          property="train_set"
          label="训练集">
        </el-table-column>
        <el-table-column
          property="train_set"
          label="Hits@1">
        </el-table-column>
        <el-table-column
          property="train_set"
          label="Hits@10">
        </el-table-column>
        <el-table-column
          property="train_set"
          label="MRR">
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="50">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOfModelSelection = false;">取消</el-button>
        <el-button type="primary" @click="dialogOfModelSelection = false; send_for_quality_inspection();">确定</el-button>
      </div>
    </el-dialog>
    <el-button type="danger" @click="reset" style="margin: 0px;">重置</el-button>
    <el-table
      :data="allTriplesBeforeCheck"
      border
      style="width: 100%; margin-top:10px"
      @selection-change="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
      label="创建时间"
      width="250">
      <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.time }}</span>
      </template>
      </el-table-column>
      <el-table-column
      label="三元组 (头实体,头实体类型,尾实体,尾实体类型,关系)"
      width>
      <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.h }}</el-tag>
              <el-tag size="medium">{{ scope.row.h_typ }}</el-tag>
              <el-tag size="medium">{{ scope.row.t }}</el-tag>
              <el-tag size="medium">{{ scope.row.t_typ }}</el-tag>
              <el-tag size="medium">{{ scope.row.r }}</el-tag>
          </div>
      </template>
      </el-table-column>
      <el-table-column
      label="三元组来源"
      width="180">
      <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.from_where }}</span>
      </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
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
      :total="1000"
      style="margin-top: 10px;">
    </el-pagination>
    <!-- <el-input
    style="display: block;margin-top:10px;"
    type="textarea"
    :autosize="{ minRows: 2, maxRows: 20}"
    placeholder="请输入内容"
    v-model="extract_data"
    >
    </el-input> -->
    <el-card shadow="always"  class="ner_card" v-loading="loading">
      <h4 class="ner_label">三元组分类</h4>
      <el-collapse v-model="activeNames" @change="handleChange" style="margin-top:10px" >
        <el-collapse-item title="三元组分类日志"  name="1">
          <span class="ner_result" id="ner_result"><b>{{printRes_tc}}</b></span>
        </el-collapse-item>
      </el-collapse>
      <el-table
        :data="extract_table"
        border
        style="width: 100%; margin-top:10px"
        @selection-change="handleSelectionChange">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
        label="插入时间"
        width="220">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.time }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组 (头实体,头实体类型,尾实体,尾实体类型,关系)"
        width>
        <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.h }}</el-tag>
                <el-tag size="medium">{{ scope.row.h_typ }}</el-tag>
                <el-tag size="medium">{{ scope.row.t }}</el-tag>
                <el-tag size="medium">{{ scope.row.t_typ }}</el-tag>
                <el-tag size="medium">{{ scope.row.r }}</el-tag>
            </div>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组来源"
        width="120">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.from_where }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="置信度检测结果"
        width="150">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.tc_res }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="插入结果"
        width="150">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.isSucceed }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
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
        :total="1000"
        style="margin-top: 10px;">
      </el-pagination>
    </el-card>
    <el-card shadow="always"  class="ner_card" v-loading="loading">
      <h4 class="ner_label">三元组插入图数据库</h4>
      <el-collapse v-model="activeNames" @change="handleChange" style="margin-top:10px">
        <el-collapse-item title="三元组插入日志" name="2">
          <span class="ner_result" id="ner_result"><b>{{printRes}}</b></span>
        </el-collapse-item>
      </el-collapse>
      <el-table
        :data="extract_table"
        border
        style="width: 100%; margin-top:10px"
        @selection-change="handleSelectionChange">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
        label="插入时间"
        width="220">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.time }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组 (头实体,头实体类型,尾实体,尾实体类型,关系)"
        width>
        <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.h }}</el-tag>
                <el-tag size="medium">{{ scope.row.h_typ }}</el-tag>
                <el-tag size="medium">{{ scope.row.t }}</el-tag>
                <el-tag size="medium">{{ scope.row.t_typ }}</el-tag>
                <el-tag size="medium">{{ scope.row.r }}</el-tag>
            </div>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组来源"
        width="120">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.from_where }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="置信度检测结果"
        width="150">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.tc_res }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="插入结果"
        width="150">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.isSucceed }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
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
        :total="1000"
        style="margin-top: 10px;">
      </el-pagination>
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
        // 选中补全模型的表格，放置在dialog中
        modelSelectionTable: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        dialogOfModelSelection: false, // 设置补全模型dialog显示的boolean变量
        currentRow: null, //补全模型的选中行
        loading :false,
        printRes_tc : '没有接收到置信度检测日志！',
        printRes : '没有接收到插入日志！',
        extract_data:"第十一航母打击群,航母打击群,尼米兹号航空母舰,航空母舰,航空母舰\n第十一航母打击群,航母打击群,第17舰载机联队,舰载机联队,舰载机联队\n第十一航母打击群,航母打击群,第9驱逐舰中队,驱逐舰中队,驱逐舰中队\n第十一航母打击群,航母打击群,埃弗里特海军基地,海军基地,母港\n埃弗里特海军基地,海军基地,华盛顿,城市,位置\n第17舰载机联队,舰载机联队,第22突击战斗机中队,作战中队,作战中队\n第17舰载机联队,舰载机联队,第94突击战斗机中队,作战中队,作战中队\n第17舰载机联队,舰载机联队,第137突击战斗机中队,作战中队,作战中队\n第17舰载机联队,舰载机联队,第323海军陆战队攻击中队,作战中队,作战中队\n第17舰载机联队,舰载机联队,第139电子攻击中队,作战中队,作战中队",
        extract_data_tc:'本杰明·华盛顿,邦克山号导弹巡洋舰,指挥军舰\n攻击战斗机中队137,凯利“马古”多森巴克,指挥官\n约瑟夫·福斯特,海军部门,部门\n柯蒂斯·威尔伯号导弹驱逐舰,约瑟夫·福斯特,执行官\n安东尼·梅西,道尔顿·特劳斯,同事\n丹·科尔贝克,中校,军衔\n罗纳德·费尔班克斯,美国,国家\n空中指挥与控制中队116,约瑟夫·詹姆斯,指挥军士长\n道尔顿·特劳斯,军士长,军衔\n海上战斗直升机中队6,内森·希基,指挥军士长',
        extract_table:[{
            time: '0000-00-00-00-00-00',
            h: '头实体',
            h_typ: '头实体类型',
            t: '尾实体',
            t_typ: '尾实体类型',
            r:'关系',
            from_where: '数据集x',
            tc_res: '检测通过/未通过',
            isSucceed: '插入成功/失败',
          },],
        allTriplesBeforeCheck:[{
            time: '0000-00-00-00-00-00',
            h: '头实体',
            h_typ: '头实体类型',
            t: '尾实体',
            t_typ: '尾实体类型',
            r:'关系',
            from_where: '数据集x',
          }],
        extract_table_tc:[],
        gridData:[],
        // extract_table_tc,
        datasets_path: 'E:/KG_system_service/candidate_datasets',
        dialogTableVisible: false,
        model_name:'ConvE_2022_10_7_9_45.h5',
        options: [{
          value: 'ConvE_2022_10_7_9_45',
          label: 'ConvE_2022_10_7_9_45.h5'
        }, {
          value: 'ConvE_2022_10_10_22_51',
          label: 'ConvE_2022_10_10_22_51.h5'
        }, {
          value: 'ConvE_2022_11_11_10_42',
          label: 'ConvE_2022_11_11_10_42.h5'
        }],  
        multipleSelection: [],
        selectedDatasets:[],
      }
    },
    methods: {
      //补全模型的单选表格
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },

      // 候选数据集的多项选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }, 
      readTriplesFromSelectedDataset(){
        for (var j = 0; j < this.multipleSelection.length; j ++){
          this.selectedDatasets.push(this.multipleSelection[j]['stem'])
        }
        let content = this.selectedDatasets;
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
          axios.post('/pythonApi/load_triples_from_candidate_datasets',{
            data: this.selectedDatasets,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '添加完毕',
                message: h('i', { style: 'color: teal'}, '已选数据集中的三元组加载完毕！'),
                offset: 100
              });
              let arr = response.data.data;
              //赋值给表格
              this.allTriplesBeforeCheck = response.data.data;
              console.log(this.allTriplesBeforeCheck)
               //设置文本高亮
              // this.setHeightKeyWord(arr);
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
        this.selectedDatasets = []
      },  
      send_for_quality_inspection(){
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
          axios.post('/pythonApi/triple_classification_1',{
            data: this.extract_data_tc,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '置信度检测完毕',
                message: h('i', { style: 'color: teal'}, '已选三元组置信度检测完毕！'),
                offset: 100
              });
              //赋值给表格
              this.printRes_tc = response.data.data
              this.extract_table_tc = response.data.data.res_list;
              //设置文本高亮
              // this.setHeightKeyWord(arr);
              
              this.loading = false;
              }
          })
          .catch(function (error) {
            console.log(error)
          })
        }

        content = this.extract_data;
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
          axios.post('/pythonApi/insert_triples_to_neo4j',{
            data: this.extract_data,
          })
          .then((response)=>{
            if (response.status == 200) {
              const h = this.$createElement;
              this.$notify({
                title: '插入完毕',
                message: h('i', { style: 'color: teal'}, '通过质检的三元组已插入图谱！'),
                offset: 100
              });
              let arr = response.data.data;
              //赋值给表格
              this.printRes = response.data.data.res_str
              this.extract_table= response.data.data.res_list;
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
      // named_entity_extraction(){
      //   let content = this.extract_data;
      //   //如果为空，提示
      //   if(content==""){
      //     this.$message({
      //       type: 'warning',
      //       message: '请输入信息'
      //     });
      //   }
      //   else{
      //     this.loading = true;
      //     //axios请求
      //     axios.post('/pythonApi/insert_triples_to_neo4j',{
      //       data: this.extract_data,
      //     })
      //     .then((response)=>{
      //       if (response.status == 200) {
      //         const h = this.$createElement;
      //         this.$notify({
      //           title: '插入完毕',
      //           message: h('i', { style: 'color: teal'}, '通过质检的三元组已插入图谱！'),
      //           offset: 100
      //         });
      //         let arr = response.data.data;
      //         //赋值给表格
      //         this.printRes = response.data.data.res_str
      //         this.extract_table= response.data.data.res_list;
      //          //设置文本高亮
      //         // this.setHeightKeyWord(arr);
      //         this.loading = false;
      //         }
      //     })
      //     .catch(function (error) {
      //       console.log(error)
      //     })
      //   }
      // },
      get_candidate_datasets(){
        let content = this.datasets_path;
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
          axios.post('/pythonApi/get_candidate_datasets',{})
          .then((response)=>{
            if (response.status == 200) {
              // const h = this.$createElement;
              // this.$notify({
              //   title: '标题名称',
              //   message: h('i', { style: 'color: teal'}, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
              // });
              //赋值给表格
              this.gridData= response.data.data;
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
        this.extract_table = [{
            time: '0000-00-00-00-00-00',
            h: '头实体',
            h_typ: '头实体类型',
            t: '尾实体',
            t_typ: '尾实体类型',
            r:'关系',
            from_where: '数据集x',
            tc_res: '检测通过/未通过',
            isSucceed: '插入成功/失败',
          },],
        this.allTriplesBeforeCheck = [{
            time: '0000-00-00-00-00-00',
            h: '头实体',
            h_typ: '头实体类型',
            t: '尾实体',
            t_typ: '尾实体类型',
            r:'关系',
            from_where: '数据集x',
          }],
          this.printRes_tc = '没有接收到置信度检测日志！',
          this.printRes = '没有接收到插入日志！',
        this.
        $("#ner_result").html("");
      },
    }
  }
</script>