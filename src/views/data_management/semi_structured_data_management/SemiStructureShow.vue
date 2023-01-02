<template>
  <div>
    <div style="margin-bottom: 30px">
      <center>
        <el-link v-for="(item,index) in listdata" @click="change(index)" :underline="false" style="margin-right: 10px;font-size: 20px;" :class="{active:currentIndex === index}">{{ item }}</el-link>
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
          <el-button @click="jsondetail(scope.row)" type="text" size="big" >详情</el-button>
          <el-button @click="textdetail()" type="text" size="big" >编辑</el-button>
          <el-button @click="downloadTxt()" type="text" size="big" >下载</el-button>
          <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        layout="prev, pager, next"
        :total="50">
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
import SJson from "./s-json";
import FileSaver from "file-saver";
export default {
  components: {SJson},
  data() {
    return {
      currentIndex:0,
      listdata:['全部','飞机','导弹','火炮','爆炸物','舰船','人员'],
      ruleForm:[],
      jsonData: [
        {
          "名称": "500MD反潛直升機",
          "图片": "https://navy.mnd.gov.tw/Files/Others/500MD-1.jpg",
          "總重": "3550磅。",
          "油量": "約415磅",
          "留空時間": "約2小時",
          "巡航空速": "80節，最大空速132節。",
          "馬力": "350匹軸",
          "偵測裝備": "搜索雷達、磁測儀。",
          "武器": "MK-46魚雷乙枚",
          "简介": "因留空時間與偵蒐能力之限制，主要擔任水下目標定位與攻擊任務。",
          "类型": "航空飛行器"
        },
        {
          "名称": "濟陽級飛彈巡防艦",
          "图片": "https://navy.mnd.gov.tw/Files/Others/4.jpg",
          "排水量滿載": "4256噸",
          "最大速率": "28節",
          "長": "440呎9吋",
          "寬": "46呎9吋",
          "吃水": "15呎6吋",
          "类型": "軍艦"
        },
        {
          "名称": "基隆級飛彈驅逐艦",
          "图片": "https://navy.mnd.gov.tw/Files/Others/333.jpg",
          "排水量滿載": "10500噸",
          "最大速率": "30節",
          "長": "563呎3吋",
          "寬": "55呎",
          "吃水": "34呎",
          "类型": "軍艦"
        },
      ],
      dialogPreviewJSON: false,
      tableData: [{
        date: '2022-05-02 10:40:00',
        name: 'milltory_factory',
        origin: 'Militaryfactory ',
        url:'https://www.militaryfactory.com/aircraft/detail.php?aircraft_id=1509',
        remark: '',
        tag: '未抽取',
        type: '飞机 ; 导弹',
        user: '用户1',
      }, {
        date: '2022-05-03 9:32:00',
        name: '台湾海军',
        origin: '台湾海军官网',
        url:'https://navy.mnd.gov.tw/AboutUs/Other_List.aspx?ID=1',
        remark: '数据为繁体字',
        tag: '已抽取',
        type: '飞机 ; 火炮',
        user: '用户1',
      }, {
        date: '2022-05-04 13:57:00',
        name: '台湾海军',
        origin: '台湾海军官网',
        url:'https://navy.mnd.gov.tw/AboutUs/Other_List.aspx?ID=1',
        remark: '数据转换为简体字',
        tag: '未抽取',
        type: '飞机 ; 火炮',
        user: '用户1',
      }, {
        date: '2022-05-05 20:35:00',
        name: '美国飞机与导弹',
        url:'http://www.designation-systems.info/usmilav/index.html',
        origin: 'System.net',
        remark: '',
        tag: '已抽取',
        type: '飞机 ; 导弹',
        user: '用户1',
      }]
    }
  },
  methods: {
    change(index){
      this.currentIndex=index
    },
    downloadjson(){
      let data = JSON.stringify(this.jsonData);
      let blob = new Blob([data], { type: "application/json" });
      FileSaver.saveAs(blob, `半结构化数据.json`);
    },
    jsondetail(row){
      this.$router.push({
        path: '/data/semistructure/SemiStructureDetail',
        query:{
          id:row.id
        }
      })
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
  }
}
</script>
<style scoped>
.active{
  color: blue;
}
</style>
