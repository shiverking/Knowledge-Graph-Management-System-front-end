<template>
  <div id="main" class="canvas_main">
    <div id="container" class="canvas_container" ></div>
    <div class="kg_form">
      <div class="div_in-lineblock_left">
        <el-input placeholder="请输入三元组" v-model="search">
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
      <el-table
          :data="triplesPageList"
      >
        <el-table-column
            label="源实体"
            prop="date">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.head }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="关系"
            prop="name">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.relation }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="目标实体"
            prop="name">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.tail }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            prop="name">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="triplesHandleSizeChange"
          @current-change="triplesHandleCurrentChange"
          :current-page="triplesCurrentPage"
          :page-sizes="triplesPageSizes"
          :page-size="triplesPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="triplesTotal">
      </el-pagination>
    </div>
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
  props: ['containerId','candidateId'],
  data() {
    return {
      id: this.containerId,
      candidateId:this.candidateId,
      nodes:[],
      edges:[],
      //搜索
      search:'',
      deleteVisible: false,
      confirmVisible:false,
      //批量处理
      batchProcessing:false,
      // 右侧三元组显示
      triplesPageList:[],
      triplesCurrentPage: 1,
      triplesTotal: 0,
      triplesPageSize: 10,
      triplesPageSizes: [10, 20, 30, 50],
    }
  },
  methods: {
    initComponent() {
      $("#container").attr('id', this.containerId)
    },
    //处理页容量改变事件
    triplesHandleSizeChange(val) {
      //修改当前分页大小
      this.triplesPageSize= val;
      //重新请求数据
      this.get_triples(this.triplesCurrentPage,val)
    },
    //翻页动作
    triplesHandleCurrentChange(val) {
      this. get_triples(val,this.triplesPageSize)
    },
    //向后端请求候选三元组数据
    get_triples(num, limit) {
      //axios请求
      axios.request({
        method:"POST",
        url:'/api/triples/getTriplesFromSameKg',
        params:{page:num,limit:limit,id:this.candidateId}
      })
          .then((response) => {
            if (response.status == 200) {
              //修改数据
              this.triplesPageList = response.data.data
              this.triplesTotal = response.data.count
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    //生成节点和边
    generateNodesAndEdges(id){
      //axios请求
      axios.request({
        method:"POST",
        url:'/api/triples/getTriplesFromSameKgNotByPage',
        params:{id:this.candidateId}
      })
      .then((response) => {
        if (response.status == 200) {
          //修改数据
          let list = response.data.data;
          const map = new Map();
          var nodeCounter = 0;
          for(var i=0;i<list.length;i++){
              var head = list[i].head;
              var tail = list[i].tail;
              var relation = list[i].relation;
              if(!map.has(head)){
                map.set(head,"node"+nodeCounter)
                this.nodes.push({id:"node"+nodeCounter ,label:head,size:30})
                nodeCounter++;
              }
              if(!map.has(tail)){
                map.set(tail,"node"+nodeCounter)
                this.nodes.push({id:"node"+nodeCounter ,label:tail,size:30})
                nodeCounter++;
              }
              let from = map.get(head)
              let to =map.get(tail)
              this.edges.push({source:from, target:to,label:relation})
          }
          var paneName = "pane-" + id;
          var container = document.getElementById(paneName).children[0].children[0];
          const width = container.scrollWidth;
          const height = container.offsetHeight;
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
                  return 300;
                }
                return 200;
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
            nodes:this.nodes,
            edges: this.edges,
          });
          // graph.data({
          //   nodes,
          //   edges: this.edges.map(function (edge, i) {
          //     edge.id = 'edge' + i;
          //     return Object.assign({}, edge);
          //   }),
          // });
          graph.render();
          console.log("渲染完成")
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
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  },
  watch: {
    containerId(newVal) {
      this.id = newVal //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
    },
    candidateId(newVal) {
      this.candidateId = newVal //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
    }
  },
  created() {
    this.initComponent();
  },
  mounted() {
    //生成节点
    this.generateNodesAndEdges(this.containerId)
    // this.initGraph(this.containerId);
    // $(".minimap").css({'position':'relative','left':'90%','bottom':'20%'})
    this.get_triples(this.triplesCurrentPage,this.triplesPageSize)
  }
}
</script>

<style scoped>

</style>