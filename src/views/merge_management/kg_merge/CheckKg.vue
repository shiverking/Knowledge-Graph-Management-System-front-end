<template>
  <div class="block" style="margin: 10px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">

      <!--分类查找-->
      <el-tab-pane label="版本库" name="first">

        <!--选择库 -->
        <el-select v-model="value" placeholder="请选择库" style="display: block">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>

        <!--主题选择-->
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
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
                prop="id"
                label="ID"
                >
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
            >
            </el-table-column>
            <el-table-column
                prop="tag"
                label="标签"

                :filters="[{ text: '单位', value: '家' }, { text: '公司', value: '公司' }]"
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
                <TwoDViewSmall></TwoDViewSmall>
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
      <el-tab-pane label="记录查询" name="second">
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
                prop="id"
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
import TwoDViewSmall from "../../../components/visualization/2dViewSmall";
import * as echarts from 'echarts';
const cityOptions = ['部队', '装备', '单位', '人员'];
export default {
  components: {
    TwoDViewSmall,
  },
  data() {
    return {
      //主图谱-更新记录
      activities: [{
        content: '版本更新V1.0.7',
        timestamp: '2022-07-23'
      }, {
        content: '版本更新V1.0.6',
        timestamp: '2022-07-01'
      }, {
        content: '版本更新V1.0.5',
        timestamp: '2022-06-14'
      }, {
        content: '版本更新V1.0.4',
        timestamp: '2022-05-30'
      }, {
        content: '版本更新V1.0.3',
        timestamp: '2022-05-07'
      }, {
        content: '版本更新V1.0.2',
        timestamp: '2022-04-18'
      }, {
        content: '版本更新V1.0.1',
        timestamp: '2022-03-11'
      }],
      //主图谱-数据概览
      //主图谱-版本控制-查找
      kgs: [],
      state: '',
      timeout:  null,
      tableData: [{
        date: '2022-08-04',
        id: '52a75fce',
        name: '第十一航母打击群',
        tag: '打击群'
      }, {
        date: '2021-07-19',
        id:'6b1a790e',
        name: '第十二航母打击群',
        tag: '打击群'
      }, {
        date: '2022-10-3',
        id: 'fd4c1b89'  ,
        name: '第七舰载机联队',
        tag: '联队'
      }, {
        date: '2022-4-23',
        id: 'a2db27c3' ,
        name: '第五战斗机编队',
        tag: '编队'
      }],
      activeName: 'first',
      input1: '',
      input2: '',
      input3: '',
      select: '',
      //版本库-选择库
      options: [{
        value: '选项1',
        label: '主版本库'
      }, {
        value: '选项2',
        label: '候选库'
      },],
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
        { "value": "第十一航母打击群"},
        { "value": "第十二航母打击群"},
        { "value": "第七舰载机联队"},
        { "value": "第五战斗机编队"},
      ];
    },
    querySearchAsync(queryString, cb) {
      var kgs = this.kgs;
      var results = queryString ? kgs.filter(this.createStateFilter(queryString)) : kgs;

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
    },
    //绘制数据流图
    draw_dataflow(){
      let chartDom = document.getElementById('data_flow');
      let myChart = echarts.init(chartDom,{renderer:'svg'});
      var option;
      console.log(chartDom);
      // prettier-ignore
      const data = [["2022-06-05", 116], ["2022-06-06", 129], ["2022-06-07", 135], ["2022-06-08", 86], ["2022-06-09", 73], ["2022-06-10", 85], ["2022-06-11", 73], ["2022-06-12", 68], ["2022-06-13", 92], ["2022-06-14", 130], ["2022-06-15", 245], ["2022-06-16", 139], ["2022-06-17", 115], ["2022-06-18", 111], ["2022-06-19", 309], ["2022-06-20", 206], ["2022-06-21", 137], ["2022-06-22", 128], ["2022-06-23", 85], ["2022-06-24", 94], ["2022-06-25", 71], ["2022-06-26", 106], ["2022-06-27", 84], ["2022-06-28", 93], ["2022-06-29", 85], ["2022-06-30", 73], ["2022-07-01", 83], ["2022-07-02", 125], ["2022-07-03", 107], ["2022-07-04", 82], ["2022-07-05", 44], ["2022-07-06", 72], ["2022-07-07", 106], ["2022-07-08", 107], ["2022-07-09", 66], ["2022-07-10", 91], ["2022-07-11", 92], ["2022-07-12", 113], ["2022-07-13", 107], ["2022-07-14", 131], ["2022-07-15", 111], ["2022-07-16", 64], ["2022-07-17", 69], ["2022-07-18", 88], ["2022-07-19", 77], ["2022-07-20", 83], ["2022-07-21", 111], ["2022-07-22", 57], ["2022-07-23", 55], ["2022-07-24", 60]];
      const dateList = data.map(function (item) {
        return item[0];
      });
      const valueList = data.map(function (item) {
        return item[1];
      });
      option = {
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400
          }
        ],
        title: [
          {
            left: 'center',
            text: '数据流'
          },
        ],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            data: dateList
          },
        ],
        yAxis: [
          {},
        ],
        grid: [
          {
            bottom: '10%'
          },
        ],
        series: [
          {
            type: 'line',
            showSymbol: false,
            data: valueList
          },
        ]
      };
      option && myChart.setOption(option);
    },
    //绘制图谱样例
    draw_kg_example(){
      let chartDom_KGPreview = document.getElementById('limit_preview');
      let myChart_KGPreivew = echarts.init(chartDom_KGPreview);
      let option;

      myChart_KGPreivew.showLoading();
      var graph  = require('../../../data/mainkg_example.json')
      myChart_KGPreivew.hideLoading();
      graph.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 30
        };
      });
      option = {
        title: {
          text: '主图谱预览',
          subtext: '部分节点',
          top: 'top',
          left: 'left'
        },
        tooltip: {},
        legend: [
          {
            // selectedMode: 'single',
            data: graph.categories.map(function (a) {
              return a.name;
            })
          }
        ],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: 'Les Miserables',
            type: 'graph',
            layout: 'none',
            data: graph.nodes,
            links: graph.links,
            categories: graph.categories,
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      myChart_KGPreivew.setOption(option);
    }
  },
  mounted() {
    this.kgs = this.loadAll();
    this.draw_dataflow();
    this.draw_kg_example();
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
.to_update{
  margin: 10px;
}
.card_label{
  margin: 0px;
}
.main_data_row{
  margin-top: 6px;
  margin-bottom: 8px;
}
</style>