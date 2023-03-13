<template>
  <div>
    <div style="margin-bottom: 30px">
      <center>
        <el-link v-for="(item,index) in listdata" :key="index" @click="change(index)" :underline="false" style="margin-right: 10px;font-size: 20px;" :class="{active:currentIndex === index}">{{ item }}</el-link>
      </center>
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">导弹</el-link>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">舰船</el-link>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">火炮</el-link>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">爆炸物</el-link>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">人员</el-link>-->
    </div>
    <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline" style="float: left">

      <el-form-item >
        <el-input  v-model="ruleForm.value" placeholder="请输入名称" style = "width: 300px"></el-input>
      </el-form-item >
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  style = "float: left ;margin-right: 50px">搜索</el-button>
        <el-upload
            class="upload-demo"
            accept = ".jpg,.jpeg,.png"
            list-type="picture">
          <el-button  type="primary">导入文件</el-button>
        </el-upload>
      </el-form-item>

    </el-form>
    <el-button  type="primary" style="float: right ;margin-right: 50px">转换为候选三元组</el-button>
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="date"
          label="创建日期"
          sortable
          column-key="date"
          :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
          :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          width="180">
        <template slot-scope="scope">
          <el-link :href="scope.row.url" type="primary" target="_blank">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注">
      </el-table-column>
      <el-table-column
          prop="type"
          label="分类">
      </el-table-column>
      <el-table-column
          prop="user"
          label="创建者">
      </el-table-column>
      <el-table-column
          prop="tag"
          label="标签"
          :filters="[{ text: '未抽取', value: '未抽取' }, { text: '已抽取', value: '已抽取' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.tag === '未抽取' ? 'primary' : 'success'"
              disable-transitions>{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="200px"
      >
        <template slot-scope="scope">
          <el-button @click="textdetail(scope.row)" type="text" size="big" >详情</el-button>
          <el-button @click="textdetail()" type="text" size="big" >编辑</el-button>
          <el-button @click="downloadTxt()" type="text" size="big" >下载</el-button>
          <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @current-change="currentChange"
        :current-page="page" :page-size="size"
        layout="total,prev, pager, next"
        :total="total">
    </el-pagination>
    <!--    <el-dialog-->
    <!--        :visible.sync="dialogPreviewJSON"-->
    <!--        title="非结构化文本预览"-->
    <!--        v-if="dialogPreviewJSON"-->
    <!--        width="40%"-->
    <!--        append-to-body-->
    <!--    >-->
    <!--      <el-row>-->
    <!--        <el-col :span="24"><div class="grid-content bg-purple-dark">-->
    <!--          <el-button type="primary" @click="read=false">编辑</el-button>-->
    <!--          <el-button type="primary">保存</el-button>-->
    <!--        </div></el-col>-->
    <!--      </el-row>-->
    <!--      <br>-->
    <!--      <el-row>-->
    <!--        <el-col :span="24"><div class="grid-content bg-purple-dark">-->
    <!--          <el-input  v-model="input1" type="textarea" style="width: 100%" :readonly="read"></el-input>-->
    <!--        </div></el-col>-->
    <!--      </el-row>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import { saveAs } from 'file-saver';
export default {
  data() {
    return {
      textData:'',
      page:1,
      size:10,
      total:10,
      currentIndex:0,
      listdata:['全部','飞机','导弹','火炮','爆炸物','舰船','人员'],
      ruleForm:[],
      read:true,
      input1:'濟陽級飛彈巡防艦設計以遠洋反潛能力著稱，服役以來主要負擔台灣東北部至東部海域偵巡任務，駐地於海軍蘇澳軍港，隸屬海軍一六八艦隊。該型艦以反制潛艦設計為導向艦艇，配備武三系統、標準飛彈、五吋砲及近迫武器系統，可有效執行偵巡及防衛作戰任務。',
      dialogPreviewJSON: false,
      tableData: [{
        date: '2022-05-02 10:40:00',
        name: 'milltory_factory',
        origin: 'Militaryfactory ',
        url:'https://www.militaryfactory.com/aircraft/detail.php?aircraft_id=1509',
        remark: '',
        tag: '未抽取',
        type: '飞机',
        user: '用户1',
      }, {
        date: '2022-05-03 9:32:00',
        name: '台湾海军',
        origin: '台湾海军官网',
        url:'https://navy.mnd.gov.tw/AboutUs/Other_List.aspx?ID=1',
        remark: '数据为繁体字',
        tag: '已抽取',
        type: '飞机',
        user: '用户1',
      }, {
        date: '2022-05-04 13:57:00',
        name: '台湾海军',
        origin: '台湾海军官网',
        url:'https://navy.mnd.gov.tw/AboutUs/Other_List.aspx?ID=1',
        remark: '数据转换为简体字',
        tag: '未抽取',
        type: '飞机',
        user: '用户1',
      }, {
        date: '2022-05-05 20:35:00',
        name: '美国飞机与导弹',
        url:'http://www.designation-systems.info/usmilav/index.html',
        origin: 'System.net',
        remark: '',
        tag: '已抽取',
        type: '飞机',
        user: '用户1',
      }]
    }
  },
  methods: {
    getTableData() {
      this.tableData = this.textData.slice(
          (this.page - 1) * this.size,
          this.page * this.size
      );
      this.total=this.textData.length
    },
    currentChange(val) {
      console.log(val)
      this.page=val
      this.getTableData()
    },
    change(index){
      this.currentIndex=index
    },
    textdetail(row) {
      this.$router.push({
        path: '/data/unstructure/UnstructureTextDetail',
        query: {
          content: row.content
        }
      })
    },
    downloadTxt() {
      let str = '濟陽級飛彈巡防艦設計以遠洋反潛能力著稱，服役以來主要負擔台灣東北部至東部海域偵巡任務，駐地於海軍蘇澳軍港，隸屬海軍一六八艦隊。該型艦以反制潛艦設計為導向艦艇，配備武三系統、標準飛彈、五吋砲及近迫武器系統，可有效執行偵巡及防衛作戰任務。'
      let strData = new Blob([str], { type: 'text/plain;charset=utf-8' });
      saveAs(strData, "非结构化数据.txt");
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  },

created(){
  this.textData   = require('../../../data/unstructure.json')
  this.getTableData()
},
}
</script>
<style scoped>
.active{
  color: blue;
}
</style>