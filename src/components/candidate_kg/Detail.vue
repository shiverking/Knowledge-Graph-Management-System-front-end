<template>
  <div id="main" class="canvas_main">
    <div id="container" class="canvas_container"></div>
    <div class="kg_form">
      <div class="div_in-lineblock_left">
        <el-input placeholder="请输入要查找三元组" v-model="search">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="div_in-lineblock_right">
        <el-tooltip class="item" effect="dark" content="重新载入图谱" placement="top-start">
          <el-button type="primary" icon="el-icon-refresh-left" circle class="operation_button"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="保存图谱" placement="top-start">
          <el-popover
              placement="top"
              width="190"
              v-model="confirmVisible">
            <p>是否保存当前更改？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="confirmVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="confirmVisible = false">确定</el-button>
            </div>
          <el-button type="success" icon="el-icon-check" circle class="operation_button" slot="reference"></el-button>
          </el-popover>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="批量处理" placement="top-start">
          <el-button type="warning" icon="el-icon-edit-outline" circle class="operation_button" @click="batchProcessing = true"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除该图谱" placement="top-start">
          <el-popover
              placement="top"
              width="190"
              v-model="deleteVisible">
            <p>确定要删除该该候选图谱吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteVisible = false">确定</el-button>
            </div>
            <el-button type="danger" icon="el-icon-delete" circle  slot="reference" class="operation_button"></el-button>
          </el-popover>
        </el-tooltip>
      </div>
      <!--批量处理dialog-->
      <el-dialog title="详细数据" :visible.sync="batchProcessing" width="70%">
        <el-button type="primary" plain>查找</el-button>
        <el-button type="success" plain>编辑</el-button>
        <el-button type="danger" plain>批量删除</el-button>
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
              label="日期"
              width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
              prop="name"
              label="姓名"
              width="120">
          </el-table-column>
          <el-table-column
              prop="address"
              label="地址"
              show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
        </el-pagination>
      </el-dialog>
      <el-table>
        <el-table-column
            label="源实体"
            prop="date">
        </el-table-column>
        <el-table-column
            label="关系"
            prop="name">
        </el-table-column>
        <el-table-column
            label="目标实体"
            prop="name">
        </el-table-column>
        <el-table-column
            label="操作"
            prop="name">
        </el-table-column>
      </el-table>
    </div>
    <!--    <p>{{this.containerId}}</p>-->
  </div>
</template>
<style>
.div_in-lineblock_left{
  display: inline-block;
  width: 40%;
}
.div_in-lineblock_right{
  display: inline-block;
  width: 60%;
}
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

.kg_form {
  display: inline-block;
  float: right;
  width: 30%;
}
.operation_button{
  margin-left: 0px !important;
}
</style>
<script>
import * as G6 from '../../plugins/g6.min.js';
import $ from '../../plugins/jquery.min.js';

export default {
  name: "Detail",
  props: ['containerId'],
  data() {
    return {
      id: this.containerId,
      nodes: [
        {id: 'node0', size: 50},
        {id: 'node1', size: 30},
        {id: 'node2', size: 30},
        {id: 'node3', size: 30},
        {id: 'node4', size: 30, isLeaf: true},
        {id: 'node5', size: 30, isLeaf: true},
        {id: 'node6', size: 15, isLeaf: true},
        {id: 'node7', size: 15, isLeaf: true},
        {id: 'node8', size: 15, isLeaf: true},
        {id: 'node9', size: 15, isLeaf: true},
        {id: 'node10', size: 15, isLeaf: true},
        {id: 'node11', size: 15, isLeaf: true},
        {id: 'node12', size: 15, isLeaf: true},
        {id: 'node13', size: 15, isLeaf: true},
        {id: 'node14', size: 15, isLeaf: true},
        {id: 'node15', size: 15, isLeaf: true},
        {id: 'node16', size: 15, isLeaf: true},
      ],
      edges: [
        {source: 'node0', target: 'node1'},
        {source: 'node0', target: 'node2'},
        {source: 'node0', target: 'node3'},
        {source: 'node0', target: 'node4'},
        {source: 'node0', target: 'node5'},
        {source: 'node1', target: 'node6'},
        {source: 'node1', target: 'node7'},
        {source: 'node2', target: 'node8'},
        {source: 'node2', target: 'node9'},
        {source: 'node2', target: 'node10'},
        {source: 'node2', target: 'node11'},
        {source: 'node2', target: 'node12'},
        {source: 'node2', target: 'node13'},
        {source: 'node3', target: 'node14'},
        {source: 'node3', target: 'node15'},
        {source: 'node3', target: 'node16'},
      ],
      //搜索
      search:'',
      deleteVisible: false,
      confirmVisible:false,
      //批量处理
      batchProcessing:false
    }
  },
  methods: {
    initGraph(id) {
      var paneName = "pane-" + id;
      var container = document.getElementById(paneName).children[0].children[0];
      // while (container!=null){
      //   container = document.getElementById(id);
      // }
      console.log(container)
      // const width = container.offsetWidth;
      // const height = window.getComputedStyle(container).getPropertyValue("height");
      // console.log(width);
      // console.log(height);
      // const width = 500;
      // const height = 500;
      const width = container.scrollWidth;
      const height = container.offsetHeight;
      console.log(height);
      // const minimap = new G6.Minimap({
      //   size: [200, 200],
      //   className: 'minimap',
      //   type: 'delegate',
      // });
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: (d) => {
            if (d.source.id === 'node0') {
              return 100;
            }
            return 30;
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
        // 允许拖拽画布、放缩画布、拖拽节点
        modes: {
          default: ['drag-canvas','zoom-canvas', 'drag-node'],
        },
        //配置插件
        // plugins: [minimap], // 将 minimap 实例配置到图上
      });
      const nodes = this.nodes;
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
    initComponent() {
      $("#container").attr('id', this.containerId)
    }
  },
  watch: {
    containerId(newVal) {
      this.id = newVal //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
    }
  },
  created() {
    this.initComponent();
  },
  mounted() {
    this.initGraph(this.containerId);
    $(".minimap").css({'position':'relative','left':'90%','bottom':'20%'})
  }
}
</script>

<style scoped>

</style>