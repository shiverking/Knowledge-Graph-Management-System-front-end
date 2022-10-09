<template>
  <div class="block" style="margin: 10px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--主图谱-->
      <el-tab-pane label="主图谱" name="first">
        <div class="area-left">
          <el-card class="box-card card" style="height:200px;">
            主要数据概览
          </el-card>
          <el-card class="box-card card" style="height:400px;">
            数据流
          </el-card>
          <el-button style="margin: 10px" type="primary">预览</el-button>
        </div>
        <div class="area-right">
          <el-card class="box-card card" style="height:500px;">
            更新记录
          </el-card>
          <el-card class="box-card card" style="height:200px;">
            待更新版本
          </el-card>
        </div>

      </el-tab-pane>
      <!--分类查找-->
      <el-tab-pane label="版本库" name="second">

        <!--主题选择-->
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>

        <el-select v-model="value" placeholder="请选择库" style="display: block">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>

          <el-autocomplete
              v-model="state"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
          ></el-autocomplete>
          <el-button @click="clearFilter">查找</el-button>
          <el-button type="primary" size="medium">生成新图谱</el-button>
          <el-button @click="resetDateFilter" style="display: inline-block;">清除日期过滤器</el-button>
          <el-button @click="clearFilter" style="margin-left: 0px;margin-top:5px;display: inline-block">清除所有过滤器</el-button>
          <el-table
              ref="filterTable"
              :data="tableData"
              style="width: 100%;margin-top: 10px;"
              border
              key="version_table"
          >
            <el-table-column
                prop="name"
                label="id"
                >
            </el-table-column>
            <el-table-column
                prop="address"
                label="名称"
                :formatter="formatter">
            </el-table-column>
            <el-table-column
                prop="tag"
                label="标签"

                :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                    :type="scope.row.tag === '家' ? 'primary' : 'success'"
                    disable-transitions>{{scope.row.tag}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="date"
                label="最后修改时间"
                sortable
                column-key="date"
                :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
                :filter-method="filterHandler"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="drawer=true">查看详情</el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes=pageSizes
              :page-size=pageSize
              layout="total, sizes, prev, pager, next, jumper"
              :total=total>
          </el-pagination>
          <el-drawer
              title="简略信息"
              :visible.sync="drawer"
              :direction="direction"
              :before-close="handleClose">
              <div class="block" style="margin: 10px">
            <el-image :src="src"></el-image>
          </div>
              <el-descriptions  direction="horizontal" :column="1" border style="margin: 10px;">
                <el-descriptions-item label="图谱名称">第十一舰队打击群</el-descriptions-item>
                <el-descriptions-item label="节点个数">1810</el-descriptions-item>
                <el-descriptions-item label="分类"><el-tag size="small">舰队</el-tag></el-descriptions-item>
              </el-descriptions>
              <el-button type="primary" style="margin: 10px;">查看详情</el-button>
          </el-drawer>
      </el-tab-pane>
      <!--记录查询-->
      <el-tab-pane label="记录查询" name="third">
        <div style="width:50%;margin-top: 15px;margin-bottom: 10px;">
          <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="主版本" value="1"></el-option>
              <el-option label="候选版本" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="record-left">
          <el-table
              :data="tableData"
              highlight-current-row
              style="width: 100%"
              key="log_table"
          >
            <el-table-column
                prop="address"
                label="id">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                >
            </el-table-column>
          </el-table>
          <el-button type="primary">查询</el-button>
        </div>
        <div class="record-right">
          <el-timeline  v-loading="true">
                     <el-timeline-item timestamp="2022/4/12" placement="top">
                        <el-card>
                          <h4>军事图谱融合</h4>
                          <p>张三 提交于 2022/4/12 20:46</p>
                        </el-card>
                      </el-timeline-item>
                      <el-timeline-item timestamp="2022/4/3" placement="top">
                        <el-card>
                          <h4>军事图谱补充</h4>
                          <p>李四提交于 2018/4/3 20:46</p>
                        </el-card>
                      </el-timeline-item>
                      <el-timeline-item timestamp="2022/4/2" placement="top">
                        <el-card>
                          <h4>第三舰队图谱补充</h4>
                          <p>王五 提交于 2022/4/2 20:46</p>
                        </el-card>
                      </el-timeline-item>
                    </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
const cityOptions = ['上海', '北京', '广州', '深圳'];
export default {
  data() {
    return {
      restaurants: [],
      state: '',
      timeout:  null,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        tag: '家'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        tag: '公司'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        tag: '家'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        tag: '公司'
      }],
      src: '../../../static/avatar/kg.png',
      activeName: 'first',
      input1: '',
      input2: '',
      input3: '',
      select: '',
      options: [{
        value: '选项1',
        label: '主版本库'
      }, {
        value: '选项2',
        label: '候选库'
      }, ],
      value: '',
      //分页设置
      pageSize:"50",
      pageSizes:"[50, 100, 150, 200]",
      total:"400",
      //抽屉设置
      drawer: false,
      direction: 'rtl',
      //多选框
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true
    }
    },
  methods: {
    loadAll() {
      return [
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
        { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
        { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
        { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
        { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
        { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
        { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
        { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
        { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
        { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
        { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
        { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
        { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
        { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
        { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
        { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
        { "value": "枪会山", "address": "上海市普陀区棕榈路" },
        { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
        { "value": "钱记", "address": "上海市长宁区天山西路" },
        { "value": "壹杯加", "address": "上海市长宁区通协路" },
        { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
        { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
        { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
        { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
        { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
        { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
        { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
        { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
        { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
        { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
        { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
        { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
        { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
        { "value": "浏阳蒸菜", "address": "天山西路430号" },
        { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
        { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
        { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
        { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
        { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
        { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
        { "value": "阳阳麻辣烫", "address": "天山西路389号" },
        { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
      ];
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },

    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //多选框
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
  }
}
</script>
<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  width: 10%;
  background-color: #fff;
}
.area-left{
  width:70%;
  float: left;
}
.area-right{
  width:30%;
  float: right;
}
.record-left{
  width:30%;
  float: left;
}
.record-right{
  width:70%;
  float: right;
}
.card{
  margin: 10px;
}
</style>