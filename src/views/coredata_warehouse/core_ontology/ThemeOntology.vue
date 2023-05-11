<template>
  <div id="main" class="canvas_main">
    <div id="container" class="canvas_container">
    </div>
    <el-card style="width: 30%;float: right;height: 600px">
      <el-button type="primary" style="margin-bottom: 20px" @click="dialogTableVisible = true;getThemeOntoList()">选择主题本体</el-button>
      <el-dialog title="主题本体列表" :visible.sync="dialogTableVisible">
        <el-table
            class="candidate-ontology-table"
            ref="multipleTable"
            :data="themeOntoList"
            tooltip-effect="dark"
            style="width: 100%">
          <el-table-column
              prop="name"
              label="主题本体名称"
              width="280">
          </el-table-column>
          <el-table-column
              prop="comment"
              label="备注"
              width="280"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              label="选择"
              width="150">
            <template slot-scope="scope">
              <el-button
                  @click="selectThemeOnto(scope.row.id)"
                  type="primary"
                  icon="el-icon-check">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-table :data="triplesOntoList">
        <el-table-column
            label="头类别"
            prop="headClassName">
        </el-table-column>
        <el-table-column
            label="关系"
            prop="relationName">
        </el-table-column>
        <el-table-column
            label="尾类别"
            prop="tailClassName">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as G6 from '../../../plugins/g6.min';
import $ from '../../../plugins/jquery.min.js';
export default {
  name: "ThemeOntology",
  data(){
    return{
      nodes:[],
      edges:[],
      triplesOntoList:[],
      dialogTableVisible: false,
      themeOntoId: null,
      themeOntoList: [],
    }
  },
  methods: {
    getThemeOntoList(){
      axios.request({
        method : "GET",
        url : "/api/themeOnto/list",
      })
          .then(
              (response) => {
                if (response.status === 200 && response.data.result) {
                  this.themeOntoList = response.data.data
                } else {
                  this.$message({
                    type: 'warning',
                    message: response.data.msg
                  });
                }
              }
          )
          .catch(function (error) {
            console.log(error);
          })
    },
    selectThemeOnto(themeOntoId){
      this.themeOntoId = themeOntoId;
      this.dialogTableVisible = false;
      this.getTriplesOntoList();
      this.getNode();
    },
    getTriplesOntoList(){
      axios.request({
        method: 'GET',
        url: '/api/themeOnto/graphEdge/1'
      }).then(response => {
        if (response.status === 200 && response.data.result) {
          this.triplesOntoList = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.message
          });
        }
      }).catch(error => {
        console.log(error);
      })
    },
    initGraph(){
      let container = document.getElementById('container');
      const width = container.scrollWidth;
      const height = container.scrollHeight;
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: (d) => {
            return 300;
          },
          nodeStrength: (d) => {
            if (d.isLeaf) {
              return -50;
            }
            return -10;
          },
          edgeStrength: (d) => {
            return 0.2;
          },
        },
        defaultNode: {
          size: [10, 10],
          style: {
            lineWidth: 1,
            fill: '#DEE9FF',
            stroke: '#5B8FF9',
          },
        },
        defaultEdge: {
          size: 1,
          style: {
            stroke: '#e2e2e2',
            lineAppendWidth: 2,
            endArrow: true,
          },
        },
        nodeStateStyles: {
          highlight: {
            opacity: 1,
          },
          dark: {
            opacity: 0.2,
          },
        },
        edgeStateStyles: {
          highlight: {
            stroke: '#999',
          },
        },
        // 允许拖拽画布、放缩画布、拖拽节点
        modes: {
          default: ['drag-canvas','zoom-canvas', 'drag-node','activate-relations'],
        },
      });
      const nodes = this.nodes;
      console.log('nodes = ' + nodes);
      //移入节点高亮
      function clearAllStats() {
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function (node) {
          graph.clearItemStates(node);
        });
        graph.getEdges().forEach(function (edge) {
          graph.clearItemStates(edge);
        });
        graph.paint();
        graph.setAutoPaint(true);
      }

      graph.on('node:mouseenter', function (e) {
        const item = e.item;
        graph.setAutoPaint(false);
        graph.getNodes().forEach(function (node) {
          graph.clearItemStates(node);
          graph.setItemState(node, 'dark', true);
        });
        graph.setItemState(item, 'dark', false);
        graph.setItemState(item, 'highlight', true);
        graph.getEdges().forEach(function (edge) {
          if (edge.getSource() === item) {
            graph.setItemState(edge.getTarget(), 'dark', false);
            graph.setItemState(edge.getTarget(), 'highlight', true);
            graph.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else if (edge.getTarget() === item) {
            graph.setItemState(edge.getSource(), 'dark', false);
            graph.setItemState(edge.getSource(), 'highlight', true);
            graph.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else {
            graph.setItemState(edge, 'highlight', false);
          }
        });
        graph.paint();
        graph.setAutoPaint(true);
      });
      graph.on('node:mouseleave', clearAllStats);
      graph.on('canvas:click', clearAllStats);
      graph.data({
        nodes,
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
    },
    getNode() {
      axios.request({
        method: 'get',
        url: '/api/themeOnto/graphNode/1'
      }).then(response => {
        if (response.status === 200 && response.data.result === true) {
          let list = response.data.data;
          list.forEach((item) => {
            item.label = item.name
            item.id = item.id + ''
          })
          this.nodes = list;
          this.getEdge();
          // this.initGraph();
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg
          });
        }
      }).catch(error => {
        console.log(error);
      })

    },
    getEdge() {
      axios.request({
        method: 'GET',
        url: '/api/themeOnto/graphEdge/1'
      }).then(response => {
        if (response.status === 200 && response.data.result) {
          var list = response.data.data;
          list.forEach((item) => {
            item.source = item.headClassId + ''
            item.target = item.tailClassId + ''
            item.label = item.relationName
          })
          this.edges = list;
          if (this.graphInfo != null) {
            this.graphInfo.changeData({
              nodes: this.nodes,
              edges: this.edges.map(function (edge, i) {
                edge.id = 'edge' + i;
                return Object.assign({}, edge);
              }),
            })
          } else {
            $("#container").remove();
            let newContainer="<div id=\"container\" class=\"canvas_container\">\n" +
                "    </div>";              // 以 HTML 创建新元素
            $("#main").prepend(newContainer);
            this.initGraph()
          }
        } else {
          this.$message({
            type: 'warning',
            message: response.data.message
          });
        }
      }).catch(error => {
        console.log(error);
      })
    },
  },
  mounted() {
    // this.getNode();
  }
}
</script>

<style>
.canvas_main {
  height: 700px;
  width: auto;
}

.canvas_container {
  display: inline-block;
  width: 69%;
  height:600px;
  background-color: rgba(251, 242, 250, 0.46);
  margin-right: 10px;
}
</style>