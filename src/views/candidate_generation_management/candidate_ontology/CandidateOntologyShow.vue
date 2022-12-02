<template>
  <body>
        <el-card class="candidate-ontology-card">
          <span>候选本体列表</span>
          <el-table
              class="candidate-ontology-table"
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
                label="候选本体名称"
                width="200">
            </el-table-column>
            <el-table-column
                prop="name"
                label="创建时间"
                width="200">
            </el-table-column>
            <el-table-column
                prop="address"
                label="创建者"
                width="200">
            </el-table-column>
            <el-table-column
                prop="desc"
                label="备注"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="查看"
                width="150">
              <el-button
                  @click="showCandidateOntology()"
                  type="primary"
                  icon="el-icon-search">
              </el-button>
            </el-table-column>
            <el-table-column
                label="删除"
                width="150">
              <el-button
                  slot-scope="scope"
                  type="primary"
                  icon="el-icon-delete-solid"
                  @click.native.prevent="deleteRow(scope.$index, tableData)">
              </el-button>
            </el-table-column>
          </el-table>
          <!--  :before-close="this.clearGraph 抽屉关闭前的回调，会暂停抽屉的关闭，done用于关闭抽屉  -->
          <el-drawer
              id="candidate-ontology-drawer-id"
              class="candidate-ontology-drawer"
              title="我是标题"
              :visible.sync="drawer"
              :with-header="false"
              size="95%"
              :before-close="this.clearGraph"
          >
            <!--
              需要在 HTML 中创建一个用于容纳 G6 绘制的图的容器，通常为 div  标签。
              G6 在绘制时会在该容器下追加 canvas 标签，然后将图绘制在其中。
            -->
            <div id="candidate-ontology-show-test" style="width: 700px;height: 600px;float: left;margin-top: 30px"></div>
            <div class="search-ontology-class" style="margin-top: 30px">
              <el-input placeholder="请输入要查找的节点" v-model="search">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <el-table class="show-ontology-table" style="margin-top: 30px">
              <el-table-column
                  label="头节点"
                  prop="date">
              </el-table-column>
              <el-table-column
                  label="关系"
                  prop="name">
              </el-table-column>
              <el-table-column
                  label="尾节点"
                  prop="name">
              </el-table-column>
            </el-table>
          </el-drawer>
          <div style="margin-top: 20px">
            <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
          </div>
        </el-card>
  </body>
</template>

<script>
  import * as G6 from '../../../plugins/g6.min.js';
  import $ from '../../../plugins/jquery.min.js';

  export default {
    name:'CandidateOntologyShow',
    data() {
      return {
        drawer: false,
        nodes: [
          { id: 'node0', size: 70, label:'节点一' },
          { id: 'node1', size: 50, label:'节点二' },
          { id: 'node2', size: 50, label:'节点三' },
          { id: 'node3', size: 50, label:'节点四' },
          { id: 'node4', size: 40, isLeaf: true },
          { id: 'node5', size: 40, isLeaf: true },
          { id: 'node6', size: 25, isLeaf: true },
          { id: 'node7', size: 25, isLeaf: true },
          { id: 'node8', size: 25, isLeaf: true },
          { id: 'node9', size: 25, isLeaf: true },
          { id: 'node10', size: 25, isLeaf: true },
          { id: 'node11', size: 25, isLeaf: true },
          { id: 'node12', size: 25, isLeaf: true },
          { id: 'node13', size: 25, isLeaf: true },
          { id: 'node14', size: 25, isLeaf: true },
          { id: 'node15', size: 25, isLeaf: true },
          { id: 'node16', size: 25, isLeaf: true },
        ],
        edges: [
          { source: 'node0', target: 'node1', label:'关系一' },
          { source: 'node0', target: 'node2', label:'关系二'  },
          { source: 'node0', target: 'node3', label:'关系三'  },
          { source: 'node0', target: 'node4', label:'关系四'  },
          { source: 'node0', target: 'node5', label:'关系五'  },
          { source: 'node1', target: 'node6', label:'关系六'  },
          { source: 'node1', target: 'node7', label:'关系七'  },
          { source: 'node2', target: 'node8', label:'关系八'  },
          { source: 'node2', target: 'node9', label:'关系九'  },
          { source: 'node2', target: 'node10', label:'关系十'  },
          { source: 'node2', target: 'node11', label:'关系十一'  },
          { source: 'node2', target: 'node12', label:'关系十二'  },
          { source: 'node2', target: 'node13', label:'关系十三'  },
          { source: 'node3', target: 'node14', label:'关系十四'  },
          { source: 'node3', target: 'node15', label:'关系十五'  },
          { source: 'node3', target: 'node16', label:'关系十六'  },
        ],
        search:'',
        tableData: [{
          date: '人员相关本体',
          name: '2020-11-18',
          address: 'root',
          desc:'最新添加的人员相关本体'
        }, {
          date: '导弹相关本体',
          name: '2021-12-18',
          address: 'admin',
          desc:'该本体主要描述...'
        }, {
          date: '战斗机相关本体',
          name: '2022-05-14',
          address: 'userOne',
          desc: '这个本体是...'
        }, {
          date: '航母打击群相关本体',
          name: '2020-07-24',
          address: 'userTwo',
          desc: '该本体主要描述的是...'
        }, {
          date: '事件相关本体',
          name: '2022-11-15',
          address: 'root',
          desc: '这个本体是关于...'
        }, {
          date: '情报相关本体',
          name: '2022-10-31',
          address: 'userThree',
          desc: '这个本体用来...'
        }],
        multipleSelection: []
      };
    },
    methods:{
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      initGraph(){
        const container = document.getElementById('candidate-ontology-show-test');
        console.log(container)
        const width = container.scrollWidth;
        const height = container.scrollHeight;
        const graph = new G6.Graph({
          // container为容器id
          container: 'candidate-ontology-show-test',
          width,
          height,
          layout: {
            type: 'force',
            preventOverlap: true,
            //函数控制节点间边的长度
            linkDistance: (d) => {
              if (d.source.id === 'node0') {
                return 200;
              }
              return 100;
            },
            nodeStrength: (d) => {
              if (d.isLeaf) {
                return -50;
              }
              return -10;
            },
            edgeStrength: (d) => {
              if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
                return 0.7;
              }
              return 0.1;
            },
          },
          defaultNode: {
            color: '#5B8FF9',
          },
          defaultEdge: {
            color: '#500020',
            style:{
              endArrow: true,
            },
          } ,
          modes: {
            default: ['drag-canvas'],
          },
        });
        // this.data
        const nodes = this.nodes;
        graph.data({
          nodes:this.nodes,
          edges: this.edges.map(function (edge, i) {
            edge.id = 'edge' + i;
            return Object.assign({}, edge);
          }),
        });
        graph.render();

        graph.on('node:dragstart', function (e) {
          graph.layout();
          refreshDragedNodePosition(e);
        });
        graph.on('node:drag', function (e) {
          refreshDragedNodePosition(e);
        });
        graph.on('node:dragend', function (e) {
          e.item.get('model').fx = null;
          e.item.get('model').fy = null;
        });

        if (typeof window !== 'undefined')
          window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
          };

        function refreshDragedNodePosition(e) {
          const model = e.item.get('model');
          model.fx = e.x;
          model.fy = e.y;
        }
        return graph;
      },
      //抽屉打开时绘图
      showCandidateOntology(){
        //显示抽屉
        this.drawer = true;
        //等抽屉加载完成开始绘图
        this.$nextTick(()=>{
          this.initGraph();
        })
      },
      //抽屉关闭时销毁图
      clearGraph(done){
        //得到graph对象，然后清除这个对象
        const graph = this.initGraph();
        graph.clear();
        //得到graph容器,将其删除，不然每次新打开抽屉div就会不断追加
        var obj = document.getElementById('candidate-ontology-show-test');
        obj.parentNode.removeChild(obj);
        //上面删除了div，然后这里要新加一个div，作为后面第二次开启抽屉时的graph的容器
        var newDiv = '<div id="candidate-ontology-show-test" style="width: 700px;height: 600px;float: left;margin-top: 30px"></div>';
        $('.search-ontology-class').before(newDiv);
        done();
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      // this.initGraph()
    }
  }
</script>

<style>
  /*候选本体列表的样式*/
  .candidate-ontology-card span{
    font-weight: bold;
  }
  /* 提示框的样式 */
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
  /*图谱样式*/
  #candidate-ontology-show{
    width: 700px;
    height: 600px;
    float: left;
  }
  /*搜索框样式*/
  .search-ontology-class{
    float: right;
    margin-right: 90px;
    width: 300px;
  }
  /*本体信息表格样式*/
  .show-ontology-table{
    float: right;
    margin-right: 20px;
    width: 350px;
  }

</style>