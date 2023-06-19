<template>
  <div>

    <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline" style="float: left">

      <el-form-item >
        <el-input  v-model="ruleForm.value"  style = "width: 300px"></el-input>
      </el-form-item >
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  >搜索</el-button>
        <el-button type="primary"  >数据清洗</el-button>
      </el-form-item>

    </el-form>
    <div style="float: right ;margin-right: 50px">
    <el-button-group style="margin-right: 50px">
      <el-button type="primary" icon="el-icon-arrow-left" >全部数据</el-button>
      <el-button type="primary">未抽取数据<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    </el-button-group>
    <el-button  type="primary" >转换为候选三元组</el-button>
    </div>
    <div style="float: left ;width: 70%">
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
>
      </el-table-column>

      <el-table-column
          v-for="key in keys"
          :key="key"
          :prop="key"
          :label="key"
          >

      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="100px"
      >
        <template slot-scope="scope">
          <el-button @click="textdetail()" type="text" size="big" >编辑</el-button>
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
    </div>
    <div style="float: right ;width:30%">
      <el-card class="box-card card" style="height:400px;">
        <h3 class="card_label">更新记录</h3>
        <el-timeline style="padding: 10px;">
          <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      indexs:[require('../../../data/militory_aircraft'),require('../../../data/navy_trachia.json'),require('../../../data/navy_simpchia.json'),require('../../../data/misile_old_en.json')],
      keys:'',
      page:1,
      size:5,
      total:10,
      activities: [{
        content: '新增21条数据',
        timestamp: '2022-07-23'
      }, {
        content: '新增16条数据',
        timestamp: '2022-07-01'
      }, {
        content: '新增10条数据',
        timestamp: '2022-06-14'
      }, {
        content: '新增25条数据',
        timestamp: '2022-05-30'
      }],
      edit:{
        edit0:true,
        edit1:true,
        edit2:true,
        edit3:true,
      },
      it:{
        card_see0:true,
        card_see1:true,
        card_see2:true,
        card_see3:true,
        card_see4:true,
        card_see5:true,
        card_see6:true,
        card_see7:true,
        card_see8:true,
        card_see9:true,
        card_see10:true,
      },
      card_see:true,
      el_see:true,
      seen:false,
      current:0,
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
        date: '2016-05-02',
        name: 'milltory_factory',
        origin: 'Militaryfactory ',
        url:'https://www.militaryfactory.com/aircraft/detail.php?aircraft_id=1509',
        remark: '',
        tag: '未抽取'
      }, {
        date: '2016-05-04',
        name: '台湾海军',
        origin: '台湾海军官网',
        url:'https://navy.mnd.gov.tw/AboutUs/Other_List.aspx?ID=1',
        remark: '数据为繁体字',
        tag: '已抽取'
      }, {
        date: '2016-05-01',
        name: '台湾海军',
        origin: '台湾海军官网',
        url:'https://navy.mnd.gov.tw/AboutUs/Other_List.aspx?ID=1',
        remark: '数据转换为简体字',
        tag: '未抽取'
      }, {
        date: '2016-05-03',
        name: '美国飞机与导弹',
        url:'http://www.designation-systems.info/usmilav/index.html',
        origin: 'System.net',
        remark: '',
        tag: '已抽取'
      }]
    }
  },
  methods: {
    getTableData() {
      this.tableData = this.jsonData.slice(
          (this.page - 1) * this.size,
          this.page * this.size
      );
      this.total=this.jsonData.length
    },
    currentChange(val) {
      this.page=val
      this.getTableData()
    },

    inputWid(key){
      return (String(key).length*10+ 10) + 'px'
    },
    inputWid2(key){
      return (String(key).length*12+ 10) + 'px'
    },
    enter(index){
      this.seen = true;
      this.current = index;
    },
    leave(){
      this.seen = false;
      this.current = null;
    }
  },
  created(){
    const index=this.$route.query.id
    const _this =this
    const keys = new Set()
    this.jsonData   = this.indexs[index-1]
    for(var i=0; i<_this.jsonData.length; i++){
      for(var key in _this.jsonData[i]){
        if (key != "图片" & key != "简介" & key != "content" & key != "variant" & key != "data_origin"){
          keys.add(key)
        }

      }
    }
    this.keys=keys
    console.log(keys)
    this.getTableData()
  }

}
</script>

<style scoped>
.borderNone /deep/ .el-input__inner {
  border: none;
  font-size: 10px;
  padding: 0 0;
}
.borderNone2 /deep/ .el-input__inner {
  border: none;
  font-size: 10px;
  padding: 0 0;
  color: cornflowerblue;
}
.text {
  font-size: 10px;
}

.item {
  margin-bottom: 0px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}
</style>