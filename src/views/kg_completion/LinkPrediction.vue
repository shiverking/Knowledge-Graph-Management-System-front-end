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
      <h4 class="ner_label">链接预测结果</h4>
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
        <div slot="tip" class="el-upload__tip">格式要求：实体1，实体1类型，实体2，实体2类型，关系，预测项设为UNKNOWN，只接受.txt/.csv文件</div>
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
          label="三元组-预测"
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
          width="200">
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
      <el-button type="primary" style="margin-top: 10px;" @click="open1">开始预测</el-button>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top:10px">
      <p><b>链接预测</b></p>
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
        label="三元组-预测"
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
          label="预测结果"
          width>
          <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.result }}</span>
          </template>
          </el-table-column>
        <el-table-column 
        label="操作"
        width="200">
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
    </el-card>  
  </div>
</template> -->
<script>
  export default {
    data() {
      return {
        loading :false,
        // pageSize: 10, // 每页多少条
        // currentPage1: 1, // 当前页
        // currentPage2: 1, // 当前页
        // total: 20, // 总数据条数
        // pageList:[{
        //   date: '2022-11-1-14:26:23',
        //   head: '约翰·保罗·琼斯号导弹驱逐舰',
        //   head_typ: '驱逐舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '产国',
        //   result: "韦恩·迈耶号导弹驱逐舰 产国 top 100 prediction over threshold 0.5 [('美国', 12, 0.9684031009674072)], expected tail is ['美国'], hits at [1]"
        // }, {
        //   date: '2022-11-1-14:26:23',
        //   head: '罗纳德·费尔班克斯',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '国家',
        //   result: "罗纳德·费尔班克斯 国家 top 100 prediction over threshold 0.5 [('美国', 12, 0.9741235971450806)], expected tail is ['美国'], hits at [1]"
        // }, {
        //   date: '2022-11-1-14:26:23',
        //   head: '韦恩·迈耶号导弹驱逐舰',
        //   head_typ: '驱逐舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥长官',
        //   result: "韦恩·迈耶号导弹驱逐舰 指挥长官 top 100 prediction over threshold 0.5 [('指挥军士长DDG108', 70, 0.9267532229423523)], expected tail is ['指挥军士长DDG108'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '邦克山号导弹巡洋舰',
        //   head_typ: '巡洋舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '执行官',
        //   result: "邦克山号导弹巡洋舰 执行官 top 100 prediction over threshold 0.5 [('丹·科尔贝克', 9, 0.9167358875274658)], expected tail is ['丹·科尔贝克'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '攻击战斗机中队22',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥官',
        //   result: "击战斗机中队22 指挥官 top 100 prediction over threshold 0.5 [('布莱恩·哈塞', 78, 0.8479126691818237)], expected tail is ['布莱恩·哈塞'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '杰森·爱德华·罗杰斯',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '国家',
        //   result: "杰森·爱德华·罗杰斯 国家 top 100 prediction over threshold 0.5 [('美国', 12, 0.979784369468689)], expected tail is ['美国'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '攻击战斗机中队94',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥官',          
        //   result: "攻击战斗机中队94 指挥官 top 100 prediction over threshold 0.5 [('迈克·坎贝尔', 56, 0.8979921340942383)], expected tail is ['迈克·坎贝尔'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '加里·拜鲁姆',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '任职单位',        
        //   result: "加里·拜鲁姆 任职单位 top 100 prediction over threshold 0.5 [('美国海军韦恩·迈耶号导弹驱逐舰', 36, 0.9042770862579346)], expected tail is ['美国海军韦恩·迈耶号导弹驱逐舰'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '克里斯托弗·斯威尼',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '同事',        
        //   result: "克里斯托弗·斯威尼 同事 top 100 prediction over threshold 0.5 [('约翰·沃克', 37, 0.8689561486244202), ('杰森威尔斯', 26, 0.8336781859397888)], expected tail is ['杰森威尔斯', '约翰·沃克'], hits at [2, 1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '海上打击直升机中队73',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '执行官',         
        //   result: "海上打击直升机中队73 执行官 top 100 prediction over threshold 0.5 [('斯科特·利平科特', 65, 0.8769981861114502)], expected tail is ['斯科特·利平科特'], hits at [1]"
        // },],
        // pageList2:[{
        //   date: '2022-11-1-14:26:23',
        //   head: '约翰·保罗·琼斯号导弹驱逐舰',
        //   head_typ: '驱逐舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '产国',
        //   result: "韦恩·迈耶号导弹驱逐舰 产国 top 100 prediction over threshold 0.5 [('美国', 12, 0.9684031009674072)], expected tail is ['美国'], hits at [1]"
        // }, {
        //   date: '2022-11-1-14:26:23',
        //   head: '罗纳德·费尔班克斯',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '国家',
        //   result: "罗纳德·费尔班克斯 国家 top 100 prediction over threshold 0.5 [('美国', 12, 0.9741235971450806)], expected tail is ['美国'], hits at [1]"
        // }, {
        //   date: '2022-11-1-14:26:23',
        //   head: '韦恩·迈耶号导弹驱逐舰',
        //   head_typ: '驱逐舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥长官',
        //   result: "韦恩·迈耶号导弹驱逐舰 指挥长官 top 100 prediction over threshold 0.5 [('指挥军士长DDG108', 70, 0.9267532229423523)], expected tail is ['指挥军士长DDG108'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '邦克山号导弹巡洋舰',
        //   head_typ: '巡洋舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '执行官',
        //   result: "邦克山号导弹巡洋舰 执行官 top 100 prediction over threshold 0.5 [('丹·科尔贝克', 9, 0.9167358875274658)], expected tail is ['丹·科尔贝克'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '攻击战斗机中队22',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥官',
        //   result: "击战斗机中队22 指挥官 top 100 prediction over threshold 0.5 [('布莱恩·哈塞', 78, 0.8479126691818237)], expected tail is ['布莱恩·哈塞'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '杰森·爱德华·罗杰斯',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '国家',
        //   result: "杰森·爱德华·罗杰斯 国家 top 100 prediction over threshold 0.5 [('美国', 12, 0.979784369468689)], expected tail is ['美国'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '攻击战斗机中队94',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥官',          
        //   result: "攻击战斗机中队94 指挥官 top 100 prediction over threshold 0.5 [('迈克·坎贝尔', 56, 0.8979921340942383)], expected tail is ['迈克·坎贝尔'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '加里·拜鲁姆',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '任职单位',        
        //   result: "加里·拜鲁姆 任职单位 top 100 prediction over threshold 0.5 [('美国海军韦恩·迈耶号导弹驱逐舰', 36, 0.9042770862579346)], expected tail is ['美国海军韦恩·迈耶号导弹驱逐舰'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '克里斯托弗·斯威尼',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '同事',        
        //   result: "克里斯托弗·斯威尼 同事 top 100 prediction over threshold 0.5 [('约翰·沃克', 37, 0.8689561486244202), ('杰森威尔斯', 26, 0.8336781859397888)], expected tail is ['杰森威尔斯', '约翰·沃克'], hits at [2, 1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '海上打击直升机中队73',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '执行官',         
        //   result: "海上打击直升机中队73 执行官 top 100 prediction over threshold 0.5 [('斯科特·利平科特', 65, 0.8769981861114502)], expected tail is ['斯科特·利平科特'], hits at [1]"
        // },],
        // tableData: [{
        //   date: '2022-11-1-14:26:23',
        //   head: '约翰·保罗·琼斯号导弹驱逐舰',
        //   head_typ: '驱逐舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '产国',
        //   result: "韦恩·迈耶号导弹驱逐舰 产国 top 100 prediction over threshold 0.5 [('美国', 12, 0.9684031009674072)], expected tail is ['美国'], hits at [1]"
        // }, {
        //   date: '2022-11-1-14:26:23',
        //   head: '罗纳德·费尔班克斯',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '国家',
        //   result: "罗纳德·费尔班克斯 国家 top 100 prediction over threshold 0.5 [('美国', 12, 0.9741235971450806)], expected tail is ['美国'], hits at [1]"
        // }, {
        //   date: '2022-11-1-14:26:23',
        //   head: '韦恩·迈耶号导弹驱逐舰',
        //   head_typ: '驱逐舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥长官',
        //   result: "韦恩·迈耶号导弹驱逐舰 指挥长官 top 100 prediction over threshold 0.5 [('指挥军士长DDG108', 70, 0.9267532229423523)], expected tail is ['指挥军士长DDG108'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '邦克山号导弹巡洋舰',
        //   head_typ: '巡洋舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '执行官',
        //   result: "邦克山号导弹巡洋舰 执行官 top 100 prediction over threshold 0.5 [('丹·科尔贝克', 9, 0.9167358875274658)], expected tail is ['丹·科尔贝克'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '攻击战斗机中队22',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥官',
        //   result: "击战斗机中队22 指挥官 top 100 prediction over threshold 0.5 [('布莱恩·哈塞', 78, 0.8479126691818237)], expected tail is ['布莱恩·哈塞'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '杰森·爱德华·罗杰斯',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '国家',
        //   result: "杰森·爱德华·罗杰斯 国家 top 100 prediction over threshold 0.5 [('美国', 12, 0.979784369468689)], expected tail is ['美国'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '攻击战斗机中队94',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥官',          
        //   result: "攻击战斗机中队94 指挥官 top 100 prediction over threshold 0.5 [('迈克·坎贝尔', 56, 0.8979921340942383)], expected tail is ['迈克·坎贝尔'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '加里·拜鲁姆',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '任职单位',        
        //   result: "加里·拜鲁姆 任职单位 top 100 prediction over threshold 0.5 [('美国海军韦恩·迈耶号导弹驱逐舰', 36, 0.9042770862579346)], expected tail is ['美国海军韦恩·迈耶号导弹驱逐舰'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '克里斯托弗·斯威尼',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '同事',        
        //   result: "克里斯托弗·斯威尼 同事 top 100 prediction over threshold 0.5 [('约翰·沃克', 37, 0.8689561486244202), ('杰森威尔斯', 26, 0.8336781859397888)], expected tail is ['杰森威尔斯', '约翰·沃克'], hits at [2, 1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '海上打击直升机中队73',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '执行官',         
        //   result: "海上打击直升机中队73 执行官 top 100 prediction over threshold 0.5 [('斯科特·利平科特', 65, 0.8769981861114502)], expected tail is ['斯科特·利平科特'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '伊利湖号导弹巡洋舰',
        //   head_typ: '巡洋舰',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '执行官',         
        //   result: "伊利湖号导弹巡洋舰 执行官 top 100 prediction over threshold 0.5 [('卡尔·P·坡', 55, 0.8939499258995056)], expected tail is ['卡尔·P·坡'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '克里斯托弗·J·格林',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '家庭信息',         
        //   result: "克里斯托弗·J·格林 家庭信息 top 100 prediction over threshold 0.5 [('犹他州邦蒂富尔人', 77, 0.8592641949653625)], expected tail is ['犹他州邦蒂富尔人'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '安东尼·梅西',
        //   head_typ: 'Per',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '军衔',         
        //   result: "安东尼·梅西 军衔 top 100 prediction over threshold 0.5 [('中校', 10, 0.9428871870040894)], expected tail is ['中校'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '攻击战斗机中队94',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥军士长',        
        //   result: "攻击战斗机中队94 指挥军士长 top 100 prediction over threshold 0.5 [('普尼·阿莱法约', 72, 0.8703957796096802)], expected tail is ['普尼·阿莱法约'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '海上打击直升机中队73',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '产国',         
        //   result: "海上打击直升机中队73 产国 top 100 prediction over threshold 0.5 [('美国', 12, 0.9572444558143616)], expected tail is ['美国'], hits at [1]"
        // },{
        //   date: '2022-11-1-14:26:23',
        //   head: '舰队后勤支援中队30第4分遣队',
        //   head_typ: '队伍',
        //   tail: 'unknown',
        //   tail_typ: 'unknown',
        //   rel: '指挥军士长',        
        //   result: "舰队后勤支援中队30第4分遣队 指挥军士长 top 100 prediction over threshold 0.5 [('珍妮·狄更斯', 79, 0.869109034538269)], expected tail is ['珍妮·狄更斯'], hits at [1]"
        // },]
        extract_data:"本杰明·华盛顿,指挥军舰\n柯蒂斯·威尔伯号导弹驱逐舰,执行官\n安东尼·梅西,同事\n罗纳德·费尔班克斯,国家\n道尔顿·特劳斯,军衔\n约书亚·温克,指挥军舰\n斯特雷特号导弹驱逐舰,指挥军士长\n安东尼·梅西,家庭信息\n斯特雷特号导弹驱逐舰,制造厂\n第十一航母打击群,巡洋舰",
        extract_table:[],
        printRes: [],
      };
    },

    methods: {
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
          axios.post('/pythonApi/link_prediction',{
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
              this.printRes = response.data.data.res_str
              this.extract_table= response.data.data.preds;
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
      // setHeightKeyWord(keywords) {
      //   var tempHTML = $("#ner_result").html();
      //   /* 关键字替换文本 该文本设置有高亮颜色 */
      //   var replaceText = "<font style='color:red;'>$1</font>";
      //   for(var i = 0; i < keywords.length; i++) {
      //     var keyword = keywords[i]["content"];
      //     /* 关键字正则匹配规则 */
      //     var r = new RegExp("(" + keyword + ")", "ig");
      //     /* 将匹配到的关键字替换成我们预设的文本 */
      //     tempHTML = tempHTML.replace(r, replaceText);
      //   }
      //   console.log(tempHTML)
      //     /* 将文本显示到浏览器上 */
      //   $("#ner_result").html(tempHTML);
      // },
      open1() {
        const h = this.$createElement;

        this.$notify({
          title: '成功',
          message: h('i', { style: 'color: teal'}, '链接预测完成！'),
          type: 'success'
        })
      },
      open2() {
        this.$prompt('请输入保存路径', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '预测结果已保存至目标路径: ' + value
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