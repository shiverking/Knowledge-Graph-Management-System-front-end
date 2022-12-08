<template>
  <div id="main">
    <div id="container" class="canvas_container"></div>
  </div>
</template>
<script>
  import * as G6 from '../../plugins/g6.min.js';
  import $ from '../../plugins/jquery.min.js';
  export default {
    name: 'OntologyDetail',
    //在这里接收父组件传输过来的候选本体id
    props: ['candidateOntologyId'],
    data() {
      return {
        candidateOntologyId: this.candidateOntologyId,
        newContainerId: '',
        //图的节点
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
        //图的边
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
      }
    },
    methods: {
      //把画图的容器id做一个改变，随着传输过来的候选图谱id进行动态改变
      //因为如果不把容器的id动态变化的话，所有的候选本体就会在同一个容器里
      initComponent() {
        this.newContainerId = 'candidate_ontology_' + this.candidateOntologyId;
        $('#container').attr('id',this.newContainerId)
      },
      initGraph(){
        console.log(this.newContainerId);
        const container = document.getElementById(this.newContainerId);
        console.log(container)
        const width = container.scrollWidth;
        const height = container.scrollHeight;
        const graph = new G6.Graph({
          // container为容器id
          container: this.newContainerId,
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
    },
    mounted() {
      this.initComponent();
      this.initGraph();
    }
  }
</script>
<style>
.canvas_container {
  display: inline-block;
  width: 69%;
  height:600px;
  background-color: rgba(251, 242, 250, 0.46);
  margin-right: 10px;
}
</style>
