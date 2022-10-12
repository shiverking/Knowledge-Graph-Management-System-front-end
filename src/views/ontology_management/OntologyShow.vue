<template>
  <div id="main" class="main">
    <div id="show_ontology_like_graph" class="show_ontology" >
      <span class="desc">本体结构展示</span>
      <svg id="show_ontology_in_svg" width="100%" height="100%"></svg>
    </div>
    <el-card class="class_info">
      <el-descriptions title="节点详细信息" direction="vertical" :column="2" border>
        <el-descriptions-item label="节点名">Country</el-descriptions-item>
        <el-descriptions-item label="父节点">GIS</el-descriptions-item>
        <el-descriptions-item label="备注">国家信息</el-descriptions-item>
        <el-descriptions-item label="数据库url">localhost:3306</el-descriptions-item>
        <el-descriptions-item label="数据库">FKFD</el-descriptions-item>
        <el-descriptions-item label="映射数据表">t_country</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-button id="update_class_button" @click="updateClassButton = true" type="primary" style="margin-left: 16px;">
      修改节点
    </el-button>
    <el-drawer title="请输入需要修改的节点的信息" :visible.sync="updateClassButton" :with-header="true">
      <el-form ref="form" :model="addClass" label-width="80px">
        <el-form-item label="节点名称">
          <el-input v-model="addClass.name"></el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="addClass.desc" placeholder="请修改备注"></el-input>
        </el-form-item>
        <el-form-item label="父节点">
          <el-select v-model="addClass.father" placeholder="请修改父节点">
            <el-option label="无" value=""></el-option>
            <el-option label="父节点一" value="Country"></el-option>
            <el-option label="父节点二" value="Sky"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkUpdateClass" size="small">确认修改</el-button>
          <el-button size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-button id="update_relation_button" @click="updateRelationButton = true" type="primary" style="margin-left: 16px;">
      修改关系
    </el-button>
    <el-drawer title="请输入需要修改的关系的信息" :visible.sync="updateRelationButton" :with-header="true">
      <el-form ref="form" :model="addRelation" label-width="80px">
        <el-form-item label="关系名称">
          <el-input v-model="addRelation.name"></el-input>
        </el-form-item>
        <el-form-item label="头节点">
          <el-select v-model="addRelation.classList" placeholder="请选择头节点">
            <el-option label="头节点一" value="Country"></el-option>
            <el-option label="头节点二" value="Sky"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尾节点">
          <el-select v-model="addRelation.classList" placeholder="请选择尾节点">
            <el-option label="尾节点一" value="Country"></el-option>
            <el-option label="尾节点二" value="Sky"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkUpdateRelation" size="small">确认修改</el-button>
          <el-button size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-button id="add_class_button" @click="addClassButton = true" type="primary" style="margin-left: 16px;">
      添加节点
    </el-button>
    <el-drawer title="请输入需要添加的节点的信息" :visible.sync="addClassButton" :with-header="true">
      <el-form ref="form" :model="addClass" label-width="80px">
        <el-form-item label="节点名称">
          <el-input v-model="addClass.name"></el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="addClass.desc" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="父节点">
          <el-select v-model="addClass.father" placeholder="请选择父节点">
            <el-option label="无" value=""></el-option>
            <el-option label="父节点一" value="Country"></el-option>
            <el-option label="父节点二" value="Sky"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkAddClass" size="small">确认添加</el-button>
          <el-button size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-button id="add_relation_button" @click="addRelationButton = true" type="primary" style="margin-left: 16px;">
      添加关系
    </el-button>
    <el-drawer title="请输入需要添加的关系的信息" :visible.sync="addRelationButton" :with-header="true">
      <el-form ref="form" :model="addRelation" label-width="80px">
        <el-form-item label="关系名称">
          <el-input v-model="addRelation.name"></el-input>
        </el-form-item>
        <el-form-item label="头节点">
          <el-select v-model="addRelation.classList" placeholder="请选择头节点">
            <el-option label="头节点一" value="Country"></el-option>
            <el-option label="头节点二" value="Sky"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尾节点">
          <el-select v-model="addRelation.classList" placeholder="请选择尾节点">
            <el-option label="尾节点一" value="Country"></el-option>
            <el-option label="尾节点二" value="Sky"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkAddRelation" size="small">确认添加</el-button>
          <el-button size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import * as d3 from '../../plugins/d3.v5.min.js'
import * as echarts from 'echarts';
import * as jquery from '../../plugins/jquery.min.js'
import Panzoom from '@panzoom/panzoom';
export default {
  name: 'OntologyShow',
  data() {
    return{
      dataset:{
        name: "Thing",
        children: [
          {
            name: "Equipment",
            children: [
              {name: "Land", value: 100},
              {
                name: "Sea",
                children: [
                  {name: "Vessel", value: 100}
                ]
              },
              {
                name: "Sky",
                children: [
                  {name: "Aircraft", value: 100}
                ]
              },
              {
                name: "Space",
                children: [
                  {name: "Misile", value: 100}
                ]
              },
              {
                name: "Weapon",
                children: [
                  {name: "Artillery", value: 100},
                  {name: "Bomb", value: 100}
                ]
              }
            ]
          },
          {
            name: "GIS",
            children: [
              {name: "Country", value: 100},
              {name: "LongitudeAndLatitude", value: 100},
            ]
          },
          {
            name: "Mechanism",
            children: [
              {name: "Company", value: 100},
              {name: "School", value: 100}
            ]
          },
          {
            name: "OperationalInformation",
            children: [
              {
                name: "Plan",
                children: [
                  {name: "Task", value: 100}
                ]
              }
            ]
          },
          {
            name: "Person",
            children: [
              {name: "Commander", value: 100},
              {
                name: "Experience",
                children: [
                  {name: "Education", value: 100},
                  {name: "Resume", value: 100}
                ]
              },
              {name: "OrdinarySoldier", value: 100}
            ]
          }
        ]
      },
      addClass: {
        name: '',
        father: '',
        desc: ''
      },
      addRelation:{
        name:'',
        classList:''
      },
      updateClassButton:false,
      updateRelationButton:false,
      addClassButton:false,
      addRelationButton:false
    }
  },
  methods:{
    // draw(){
    //   //定义边界
    //   let marge = {top: 50, bottom: 0, left: 10, right: 0};
    //
    //   let svg = d3.select("svg");
    //   //设置长宽
    //   for (let i = 0; i < svg.length; i++) {
    //     svg[i].setAttribute('viewBox', '0,0,' + svg[i].getBBox().width + ',' + svg[i].getBBox().height + '')
    //   }
    //   let graph = document.getElementById("show_ontology_like_graph")
    //   let width = parseInt(window.getComputedStyle(graph).width);
    //   let height = parseInt(window.getComputedStyle(graph).height);
    //   let g = svg.append("g")
    //       .attr("transform", "translate(" + marge.top + "," + marge.left + ")");
    //
    //   let scale = svg.append("g")
    //       .attr("transform", "translate(" + marge.top + "," + marge.left + ")");
    //   //创建一个hierarchy layout
    //   let hierarchyData = d3.hierarchy(this.$data.dataset)
    //       .sum(function (d) {
    //         return d.value;
    //       });
    //
    //   //创建一个树状图
    //   let tree = d3.tree()
    //       .size([width, height])
    //       // .size([width - 400, height - 200])
    //       .separation(function (a, b) {
    //         return (a.parent == b.parent ? 1 : 2) / a.depth;
    //       })
    //
    //   //初始化树状图，也就是传入数据,并得到绘制树基本数据
    //   let treeData = tree(hierarchyData);
    //   console.log(treeData);
    //   //得到节点
    //   let nodes = treeData.descendants();
    //   let links = treeData.links();
    //
    //   //输出节点和边
    //   console.log(nodes);
    //   console.log(links);
    //
    //   //创建一个贝塞尔生成曲线生成器
    //   let Bézier_curve_generator = d3.linkHorizontal()
    //       .x(function (d) {
    //         return d.y;
    //       })
    //       .y(function (d) {
    //         return d.x;
    //       });
    //
    //   //有了节点和边集的数据后，我们就可以开始绘制了，
    //   //绘制边
    //   g.append("g")
    //       .selectAll("path")
    //       .data(links)
    //       .enter()
    //       .append("path")
    //       .attr("d", function (d) {
    //         let start = {x: d.source.x, y: d.source.y};
    //         let end = {x: d.target.x, y: d.target.y};
    //         return Bézier_curve_generator({source: start, target: end});
    //       })
    //       .attr("fill", "none")
    //       .attr("stroke", "green")
    //       .attr("stroke-width", 1);
    //
    //       //绘制节点和文字
    //     //先创建用以绘制每个节点和对应文字的分组<g>
    //   let gs = g.append("g")
    //       .selectAll("g")
    //       .data(nodes)
    //       .enter()
    //       .append("g")
    //       .attr("transform", function (d) {
    //         let cx = d.x;
    //         let cy = d.y;
    //         return "translate(" + cy + "," + cx + ")";
    //       });
    //   //绘制节点
    //   gs.append("circle")
    //       .attr("r", 6)
    //       .attr("fill", "white")
    //       .attr("stroke", "blue")
    //       .attr("stroke-width", 1);
    //   //文字
    //   gs.append("text")
    //       .attr("x", function (d) {
    //         return d.children ? -40 : 8;
    //       })
    //       .attr("y", -5)
    //       .attr("dy", 10)
    //       .text(function (d) {
    //         return d.data.name;
    //       });
    // },
    draw(){
      let ROOT_PATH = 'test';

      let chartDom = document.getElementById('show_ontology_like_graph');
      let myChart = echarts.init(chartDom,);
      let option;

      myChart.showLoading();
      // jquery.getJSON('../../data/ontology.json', {},,'json');
      var ontology_data  = require('../../data/ontology.json')
      function initEcharts (data){
        myChart.hideLoading();
        data.children.forEach(function (datum, index) {
          index % 2 === 0 && (datum.collapsed = true);
        });
        myChart.setOption(
            (option = {
              tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
              },
              series: [
                {
                  type: 'tree',
                  data: [data],
                  top: '1%',
                  left: '7%',
                  bottom: '1%',
                  right: '20%',
                  symbolSize: 7,
                  label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 9
                  },
                  leaves: {
                    label: {
                      position: 'right',
                      verticalAlign: 'middle',
                      align: 'left'
                    }
                  },
                  emphasis: {
                    focus: 'descendant'
                  },
                  expandAndCollapse: true,
                  animationDuration: 550,
                  animationDurationUpdate: 750
                }
              ]
            })
        );
      }
      initEcharts(ontology_data);
      option && myChart.setOption(option);
    },
    checkUpdateClass(){
      this.$alert('是否确认修改', '修改节点', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }
      });
    },
    checkUpdateRelation(){
      this.$alert('是否确认修改', '修改关系', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }
      });
    },
    checkAddClass() {
      this.$alert('是否确认添加', '添加节点', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '添加成功'
          });
        }
      });
    },
    checkAddRelation(){
      this.$alert('是否确认添加', '添加关系', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: '添加成功'
          });
        }
      });
    },
    // initPanzoom(){
    //   // const elem = document.getElementById('show_ontology_like_graph')
    //   // const panzoom = Panzoom(elem, {
    //   //   maxScale: 5
    //   // })
    //   // panzoom.pan(10, 10)
    //   // panzoom.zoom(2, { animate: true })
    //   // elem.addEventListener('click', panzoom.zoomIn)
    //   // elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
    // }
  },
  mounted(){
    this.draw()
    // this.initPanzoom()
  }
}
</script>

<style lang="css">
.main {
  background: white;
  height: 600px;
  width: 100%;
  margin-top: 20px;
}
.show_ontology {
  float: left;
  height: 750px;
  width: 800px;
  margin-top: 20px;
  /*border: red 1px solid;*/
  /*overflow-x:scroll;*/
  /*overflow-y:scroll;*/
}
.desc{
  font-size: 16px;
  font-weight: 700;
}
#update_class_button{
  margin-left: 150px;
  margin-top: 10px;
  float: right;
}
#update_relation_button{
  margin-right: 150px;
  margin-top: 10px;
  float: right;
}
#add_class_button{
  margin-left: 150px;
  margin-top: 10px;
  float: right;
}
#add_relation_button{
  margin-right: 150px;
  margin-top: 10px;
  float: right;
}
.class_info {
  float: left;
  margin-left: 20px;
  width: 30%;
  height: 110%;
  margin-top: 20px;
}
</style>