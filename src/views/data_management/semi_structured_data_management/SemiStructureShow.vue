<template>
  <div >
<!--    <div style="margin-bottom: 30px">-->
<!--      <center>-->
<!--        <el-link v-for="(item,index) in listdata" :key="index" @click="change(index)" :underline="false" style="margin-right: 10px;font-size: 20px;" :class="{active:currentIndex === index}">{{ item }}</el-link>-->
<!--      </center>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">导弹</el-link>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">舰船</el-link>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">火炮</el-link>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">爆炸物</el-link>-->
      <!--      <el-link :underline="false" style="margin-right: 10px;font-size: 20px;">人员</el-link>-->
<!--    </div>-->
    <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline" style="float: left">

      <el-form-item >
        <el-input  v-model="ruleForm.value" placeholder="请输入名称" style = "width: 300px"></el-input>
      </el-form-item >
      <el-form-item >
        <el-button  type="primary" icon="el-icon-search"  style = "margin-right: 50px" @click="search()">搜索</el-button>
<!--        <el-upload-->
<!--            class="upload-demo"-->
<!--            accept = ".jpg,.jpeg,.png"-->
<!--            list-type="picture">-->
<!--          <el-button  type="primary">导入文件</el-button>-->
<!--        </el-upload>-->
      </el-form-item>
      <span style="color: deepskyblue">数据来源：</span>
      <el-select v-model="value" placeholder="请选择" @change="selectTrigger(value)">
        <el-option
            v-for="item in options"
            :label="item.name"
            :value="item.cid"
        >
        </el-option>
      </el-select>
    </el-form>
<!--    <el-button type="success" icon="el-icon-download" style="float: right;margin-right: 50px">文件导出</el-button>-->
<!--    <el-button  type="primary" style="float: right ;margin-right: 50px">转换为候选三元组</el-button>-->
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">

      <el-table-column
          type="selection"
      >
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="max_speed"
          label="最大速度"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="weight"
          label="重量"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="创建时间"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="length"
          label="长度"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="width"
          label="宽度"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="height"
          label="高度"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="crew"
          label="乘员"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="range"
          label="飞行/发射范围"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="draught"
          label="吃水"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="displacement"
          label="排水量"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="service_year"
          label="服役年份"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="origin"
          label="来源"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="horsepower"
          label="马力"
          width="100px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="manufacturer"
          label="生产商"
          width="50px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
          prop="ceiling"
          label="飞行高度"
          width="50px"
          :show-overflow-tooltip="true"
      >
      </el-table-column>
<!--      <el-table-column-->
<!--          fixed="right"-->
<!--          label="操作"-->
<!--          width="200px"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button @click="textdetail()" type="text" size="big" >编辑</el-button>-->
<!--          <el-button @click="deleteBook(scope.row)" type="text" size="big">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <el-pagination
        @current-change="currentChange"
        :current-page="page" :page-size="pagesize"
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
import SJson from "./s-json";
import FileSaver from "file-saver";

export default {
  components: {SJson},
  data() {
    return {
      crawlid:1,
      total: 10,
      page: 1,
      pagesize: 20,
      value: '',
      options: [],
      dataList: [
        {
          text: 'Parent node',
          children: [
            {text: 'Child node 1'},
            {text: 'Child node 2'}
          ]
        }
      ],
      currentIndex: 0,
      listdata: ['全部', '飞机', '导弹', '火炮', '爆炸物', '舰船', '人员'],
      ruleForm: {"value":null},
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
        id: 1,
        date: '2022-05-02 10:40:00',
        name: 'milltory_factory',
        origin: 'Militaryfactory ',
        url: 'https://www.militaryfactory.com/aircraft/detail.php?aircraft_id=1509',
        remark: '',
        tag: '未抽取',
        type: '飞机 ; 导弹',
        user: '用户1',
      }, {
        id: 2,
        date: '2022-05-03 9:32:00',
        name: '台湾海军',
        origin: '台湾海军官网',
        url: 'https://navy.mnd.gov.tw/AboutUs/Other_List.aspx?ID=1',
        remark: '数据为繁体字',
        tag: '已抽取',
        type: '飞机 ; 火炮',
        user: '用户1',
      }, {
        id: 3,
        date: '2022-05-04 13:57:00',
        name: '台湾海军',
        origin: '台湾海军官网',
        url: 'https://navy.mnd.gov.tw/AboutUs/Other_List.aspx?ID=1',
        remark: '数据转换为简体字',
        tag: '未抽取',
        type: '飞机 ; 火炮',
        user: '用户1',
      }, {
        id: 4,
        date: '2022-05-05 20:35:00',
        name: '美国飞机与导弹',
        url: 'http://www.designation-systems.info/usmilav/index.html',
        origin: 'System.net',
        remark: '',
        tag: '已抽取',
        type: '飞机 ; 导弹',
        user: '用户1',
      }]
    }
  },
  methods: {
    search(){
      const _this = this
      _this.axios.get('/api/semistructure/getSemistructuredDataByname/'+"/0"+'/10/'+_this.ruleForm.value).then(function(resp) {

        _this.tableData = resp.data.data
        _this.pageSize = resp.data.data.length
        _this.total = resp.data.count
      })

    },
    currentChange(currentPage){
      const _this = this
        _this.axios.get('/api/semistructure/getSemistructuredDataBycid/'+(currentPage)+'/10/'+_this.crawlid).then(function(resp) {
          _this.tableData = resp.data.data
          _this.pageSize = resp.data.data.length
          _this.total = resp.data.count
        })
            },
    selectTrigger(id) {
      const _this = this
      _this.axios.get('/api/semistructure/getSemistructuredDataBycid/0/10/' + id).then(function (resp) {
        _this.tableData = resp.data.data
        _this.total = resp.data.count
        _this.pagesize = resp.data.data.length
      })
      this.crawlid=id
    },

    change(index) {
      this.currentIndex = index
    },
    downloadjson() {
      let data = JSON.stringify(this.jsonData);
      let blob = new Blob([data], {type: "application/json"});
      FileSaver.saveAs(blob, `半结构化数据.json`);
    },
    jsondetail(row) {
      this.$router.push({
        path: '/data/semistructure/SemiStructureDetail',
        query: {
          id: row.id
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
  },

  created() {
    const _this = this
    _this.axios.get('/api/crawl/findAllnopage').then(function(resp){
      _this.options = resp.data
      _this.value= resp.data[0].cid

    })
    _this.axios.get('/api/semistructure/getSemistructuredDataBycid/0/10/1').then(function(resp){
      _this.tableData = resp.data.data
      _this.total=resp.data.count
      _this.pagesize=resp.data.data.length
    })
  }
}

</script>
<style scoped lang="scss">
::v-deep .el-input__inner {
  width: 200px!important;
}

::v-deep .el-input {
  width: 200px!important;
}

::v-deep .my-select{
  display: block!important;;
  width: 200px!important;
}
</style>
