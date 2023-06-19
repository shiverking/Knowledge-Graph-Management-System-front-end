<template>
  <div>
<!--    <el-form ref="formInline" :inline="true" :model="ruleForm" class="demo-form-inline" style="float: left ">-->

<!--      <el-form-item >-->
<!--        <el-input  v-model="ruleForm.value"  style = "width: 300px"></el-input>-->
<!--      </el-form-item >-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search"  >搜索</el-button>-->
<!--      </el-form-item>-->

<!--    </el-form>-->
    <div >

<!--      <el-row >-->
<!--        <el-col :span="24"><div class="grid-content bg-purple-dark">-->
<!--          <el-button type="primary" @click="read=false">编辑</el-button>-->
<!--          <el-button type="primary" @click="read=true">保存</el-button>-->
<!--        </div></el-col>-->
<!--      </el-row>-->
      <br>
<!--      <div >-->
<!--      <el-row >-->
<!--        <el-col :span="24"><div class="grid-content bg-purple-dark">-->

<!--          <el-input :rows="20" v-model="input1" type="textarea" style="width: 100%" :readonly="read" ></el-input>-->
<!--        </div></el-col>-->
<!--      </el-row>-->
<!--      </div>-->
    </div>
<!--    <br>-->
<!--    <center >-->
<!--    <el-button-group>-->
<!--      <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>-->
<!--      <el-button type="primary">下一页<i class="el-icon-arrow-right el-icon&#45;&#45;right"></i></el-button>-->
<!--    </el-button-group>-->
<!--    </center>-->

    <el-input   type="textarea"  autosize :value="content" :readonly="true" ></el-input>
<!--  <el-carousel indicator-position="none" :autoplay="false" height="800px" :initial-index=index>-->
<!--    <el-carousel-item v-for="(item,index) in input1" :key="item">-->
<!--      <el-input :rows="30" v-model="item.content" type="textarea" style="width: 100%" :readonly="read" ></el-input>-->
<!--&lt;!&ndash;      <span>{{item}}</span>&ndash;&gt;-->
<!--    </el-carousel-item>-->
<!--  </el-carousel>-->
  </div>
</template>

<script>
export default {
  data() {

    return {
      content:"",
      index:10,
      read:true,
      input1:["The Aero L-39 series of advanced jet trainer and light strike aircraft followed along the same lines as its predecessor - the L-29 \"Delphin\" detailed elsewhere on this site - in terms of development. Designed just three years after the successful L-29 became the frontline advanced trainer for the Soviet Union and associated Bloc countries, the L-39 emerged in prototype form and recorded its first flight on November 4th, 1968 prior to introduction with the Czechoslovakian Air Force in 1972. From then on, the aircraft was equally accepted and successful in the training of a new generation of pilots for the Soviet Empire and its satellite states and supporters. Total production exceeding 3,000 aircraft from 1971 to 1999. It became the first turbofan-powered trainer to enter serial production." +
      "\n" +
      "Compared to the earlier L-29, the L-39 was a more simplified approach with modularity in mind, allowing the newer aircraft to be produced more efficiently and quicker than its counterpart. The powerplant increased thrust was added as was a new avionics suite along with a reinforced structure. The tandem, twin-seat aircraft - as in the L-29 before it - allowed for unfettered views out of the cockpit (save for the rear), bringing about a heightened sense of situational awareness. The training derivative was eventually branched into a light strike form and four underwing hardpoints were used to carry various ordnance options including rocket pods, air-to-air missiles, and conventional drop bombs. This was in addition to the standard, centerline-mounted 23mm GSh-23L twin-barrel cannon for close-in work."+
      "\n" +
      "Outwardly, the L-39 was a complete revision over the L-29. It sported low-set, straight-edged,  monoplane mainplanes with a well-sloped nose assembly. Views were hindered by the raised fuselage spine but this, in turn, allowed for increased internal storage space. Twin, half-moon intakes were set to either side of the slim fuselage which aspirated the single turbofan engine installation. The tail unit included a single vertical tail fin and low-mounted horizontal planes as well as the singular jetpipe. The tricycle undercarriage consisted of a single-wheeled nose leg and two single-wheeled main legs under the wings."+
      "\n" +
      "Export numbers for the L-39 Albatross were abundant was the case with the L-29 - though roughly the same set of customers greeted the new machine. Thailand went on to purchase forty of an export model designated with L-39ZA/ART that featured Israeli-produced Elbit avionics. The most numerous in terms of production was the L-39C model which helped drive total production of the L-39 system as a whole past the 3,000 mark."+
          "\n" +
      "Variants have included the five prototypes and two static airframes as the L-39X (-01 through -07). The L-39C was the standard trainer for many Soviet entities during the Cold War. The L-39CM became an upgraded C-form for the Slovakian Air Force. The Ukrainians received the L-39M1 with AI-25TLSh series turbofan engines. The L-39V variant covered target tugs for the Czechoslovakian Air Force. A weapons trainer emerged as the L-39ZO. An armed trainer and light attack platform became the L-39ZA which supported air-to-air missile launching. The L-39ZAM was a Slovakian Air Force modernization of the L-39ZA mark."+
          "\n" +
      "The L-39 was then offered in a more refined form through the L-59 \"Super Albatros\" and the line further branched to include the L-159 \"Alca\". However, these did not go on to achieve the same level of success as the L-39, leaving Aero Vodochody to now offer an all-new, modernized version of the L-39 instead as the L-39NG (\"Next Generation\"). This was announced in August of 2014 with intended upgrades aimed at the avionics suite and engines (the U.S.-built Williams FJ44 series). The aircraft would serve the current military market as a low-cost advanced jet trainer alternative to more pricier mounts emerging from the West and Russia. The prototype is expected to go airborne sometime in 2016 with the product becoming available in 2018.©MilitaryFactory.com\n" +
      "\t\t"
      ],
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

    inputWid(key){
      return (String(key).length*10+ 10) + 'px'
    },
    inputWid2(key){
      return (String(key).length*12+ 10) + 'px'
    },
    enter(){
      this.seen = true;

    },
    leave(){
      this.seen = false;
    }
  },
  created(){
    const _this=this
    this.index=this.$route.query.id
    this.content = this.$route.query.content
    // console.log(this.index)
    // _this.axios.get('/api/unstructure/getAllTextByPageandcid/0/10/2').then(function(resp){
    //   console.log(resp)
    //   _this.input1 = resp.data.data
    // })
  }
}
</script>

<style scoped>
.my-input {
  height: 500px;
}
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