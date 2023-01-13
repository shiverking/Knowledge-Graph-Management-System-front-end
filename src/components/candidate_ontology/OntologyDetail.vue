<template>
  <div id="main">
    <div id="tree-container" class="tree-container"></div>
    <div id="container" class="canvas_container"></div>
  </div>
</template>
<script>
  import G6 from '../../plugins/g6.min.js';
  import $ from '../../plugins/jquery.min.js';
  export default {
    name: 'OntologyDetail',
    //在这里接收父组件传输过来的候选本体id
    props: ['candidateOntologyId'],
    data() {
      return {
        candidateOntologyId: this.candidateOntologyId,
        newTreeContainerId: '',
        newContainerId: '',
        // treeData: {
        //   "children": [{
        //     "children": [],
        //     "name": "节点2",
        //     "id": 2,
        //     "parentId": 1
        //   }, {
        //     "children": [{
        //       "children": [],
        //       "name": "节点4",
        //       "id": 4,
        //       "parentId": 3
        //     }],
        //     "name": "节点3",
        //     "id": 3,
        //     "parentId": 1
        //   }],
        //   "name": "节点1",
        //   "id": 1,
        //   "parentId": 0
        // },
        treeData:{
          "name": "Thing",
          "children": [
            {
              "name": "武器装备",
              "children": [
                {"name": "陆", "value": 100},
                {
                  "name": "海",
                  "children": [
                    {"name": "舰船舰艇", "value": 100}
                  ]
                },
                {
                  "name": "空",
                  "children": [
                    {"name": "飞行器", "value": 100}
                  ]
                },
                {
                  "name": "天",
                  "children": [
                    {"name": "导弹武器", "value": 100}
                  ]
                },
                {
                  "name": "武器",
                  "children": [
                    {"name": "火炮", "value": 100},
                    {"name": "爆炸物", "value": 100}
                  ]
                }
              ]
            },
            {
              "name": "地理信息",
              "children": [
                {"name": "国家", "value": 100},
                {"name": "经纬度", "value": 100}
              ]
            },
            {
              "name": "机构",
              "children": [
                {"name": "单位", "value": 100},
                {"name": "学校", "value": 100}
              ]
            },
            {
              "name": "作战信息",
              "children": [
                {
                  "name": "计划",
                  "children": [
                    {"name": "任务", "value": 100}
                  ]
                }
              ]
            },
            {
              "name": "人员",
              "children": [
                {"name": "指挥官", "value": 100},
                {
                  "name": "经历",
                  "children": [
                    {"name": "学历", "value": 100},
                    {"name": "履历", "value": 100}
                  ]
                },
                {"name": "普通士兵", "value": 100}
              ]
            }
          ]
        },
        //图的节点
        // nodes: [
        //   { id: 'node0', size: 70, label:'节点一' },
        //   { id: 'node1', size: 50, label:'节点二' },
        //   { id: 'node2', size: 50, label:'节点三' },
        //   { id: 'node3', size: 50, label:'节点四' },
        //   { id: 'node4', size: 40, isLeaf: true },
        //   { id: 'node5', size: 40, isLeaf: true },
        //   { id: 'node6', size: 25, isLeaf: true },
        //   { id: 'node7', size: 25, isLeaf: true },
        //   { id: 'node8', size: 25, isLeaf: true },
        //   { id: 'node9', size: 25, isLeaf: true },
        //   { id: 'node10', size: 25, isLeaf: true },
        //   { id: 'node11', size: 25, isLeaf: true },
        //   { id: 'node12', size: 25, isLeaf: true },
        //   { id: 'node13', size: 25, isLeaf: true },
        //   { id: 'node14', size: 25, isLeaf: true },
        //   { id: 'node15', size: 25, isLeaf: true },
        //   { id: 'node16', size: 25, isLeaf: true },
        // ],
        nodes: [
          {id: '0', label: '舰船舰艇', size: '50'},
          {id: '1', label: '导弹武器', size: '50'},
          {id: '2', label: '火炮', size: '50'},
          {id: '3', label: '飞行器', size: '50'},
          {id: '4', label: '人员', size: '50'},
          {id: '5', label: '学历', size: '50'},
          {id: '6', label: '任务', size: '50'},
          {id: '7', label: '国家', size: '50'},
          {id: '8', label: '履历', size: '50'},
          {id: '9', label: '计划', size: '50'},
        ],
        //图的边
        // edges: [
        //   { source: 'node0', target: 'node1', label:'关系一' },
        //   { source: 'node0', target: 'node2', label:'关系二'  },
        //   { source: 'node0', target: 'node3', label:'关系三'  },
        //   { source: 'node0', target: 'node4', label:'关系四'  },
        //   { source: 'node0', target: 'node5', label:'关系五'  },
        //   { source: 'node1', target: 'node6', label:'关系六'  },
        //   { source: 'node1', target: 'node7', label:'关系七'  },
        //   { source: 'node2', target: 'node8', label:'关系八'  },
        //   { source: 'node2', target: 'node9', label:'关系九'  },
        //   { source: 'node2', target: 'node10', label:'关系十'  },
        //   { source: 'node2', target: 'node11', label:'关系十一'  },
        //   { source: 'node2', target: 'node12', label:'关系十二'  },
        //   { source: 'node2', target: 'node13', label:'关系十三'  },
        //   { source: 'node3', target: 'node14', label:'关系十四'  },
        //   { source: 'node3', target: 'node15', label:'关系十五'  },
        //   { source: 'node3', target: 'node16', label:'关系十六'  },
        // ],
        edges: [
          {source: '0', target: '1', label:'携带'},
          {source: '0', target: '2', label:'携带'},
          {source: '0', target: '3', label:'携带'},
          {source: '3', target: '1', label:'携带'},
          {source: '4', target: '5', label:'拥有'},
          {source: '0', target: '6', label:'执行'},
          {source: '3', target: '6', label:'执行'},
          {source: '0', target: '4', label:'乘坐'},
          {source: '3', target: '4', label:'乘坐'},
          {source: '7', target: '0', label:'生产'},
          {source: '7', target: '1', label:'生产'},
          {source: '7', target: '2', label:'生产'},
          {source: '7', target: '3', label:'生产'},
          {source: '4', target: '8', label:'拥有'},
          {source: '6', target: '9', label:'组成'},
        ],
      }
    },
    methods: {
      //把画图的容器id做一个改变，随着传输过来的候选图谱id进行动态改变
      //因为如果不把容器的id动态变化的话，所有的候选本体就会在同一个容器里
      initComponent() {
        this.newTreeContainerId = 'tree_candidate_ontology_' + this.candidateOntologyId;
        this.newContainerId = 'candidate_ontology_' + this.candidateOntologyId;
        $('#tree-container').attr('id',this.newTreeContainerId);
        $('#container').attr('id',this.newContainerId);
      },
      getTreeDataByCandidateOntologyId(){
        let treeJson = '';
        axios.request({
          method: 'POST',
          url: '/api/candidateOntology/getTreeClassByCandidateOntologyId',
          params: {candidateOntologyId: this.candidateOntologyId}
        }).then(response => {
          if(response.status === 200){
            // this.treeData = response.data.data;
            // treeJson = JSON.parse(this.treeData);
            console.log('请求到的treeData');
            console.log(response.data.data);
            this.initTree();
          }
        }).catch(error => {
          console.log(error);
        })
      },
      getGraphDataByCandidateOntologyId(){
        axios.request({
          method : "post",
          url : "/api/candidateOntology/"
        })
      },
      initTree(){
        G6.registerNode('file-node', {
          draw: function draw(cfg, group) {
            const keyShape = group.addShape('rect', {
              attrs: {
                x: 10,
                y: -12,
                fill: '#fff',
                stroke: null,
              },
            });
            let isLeaf = false;
            if (cfg.collapsed) {
              group.addShape('marker', {
                attrs: {
                  symbol: 'triangle',
                  x: 4,
                  y: -2,
                  r: 4,
                  fill: '#666',
                },
                name: 'marker-shape',
              });
            } else if (cfg.children && cfg.children.length > 0) {
              group.addShape('marker', {
                attrs: {
                  symbol: 'triangle-down',
                  x: 4,
                  y: -2,
                  r: 4,
                  fill: '#666',
                },
                name: 'marker-shape',
              });
            } else {
              isLeaf = true;
            }
            const shape = group.addShape('text', {
              attrs: {
                x: 15,
                y: 4,
                text: cfg.name,
                fill: '#666',
                fontSize: 16,
                textAlign: 'left',
                fontFamily:
                    typeof window !== 'undefined'
                        ? window.getComputedStyle(document.body, null).getPropertyValue('font-family') ||
                        'Arial, sans-serif'
                        : 'Arial, sans-serif',
              },
              name: 'text-shape',
            });
            const bbox = shape.getBBox();
            let backRectW = bbox.width;
            let backRectX = keyShape.attr('x');
            if (!isLeaf) {
              backRectW += 8;
              backRectX -= 15;
            }
            keyShape.attr({
              width: backRectW,
              height: bbox.height + 4,
              x: backRectX,
            });
            return keyShape;
          },
        });
        G6.registerEdge(
            'step-line',
            {
              getControlPoints: function getControlPoints(cfg) {
                const startPoint = cfg.startPoint;
                const endPoint = cfg.endPoint;
                return [
                  startPoint,
                  {
                    x: startPoint.x,
                    y: endPoint.y,
                  },
                  endPoint,
                ];
              },
            },
            'polyline',
        );

        const container = document.getElementById(this.newTreeContainerId);
        const width = container.scrollWidth;
        const height = container.scrollHeight || 500;
        const graph = new G6.TreeGraph({
          container: this.newTreeContainerId,
          width,
          height,
          linkCenter: true,
          modes: {
            default: [
              {
                type: 'collapse-expand',
                animate: false,
                onChange: function onChange(item, collapsed) {
                  const data = item.get('model');
                  data.collapsed = collapsed;
                  return true;
                },
              },
              'zoom-canvas',
            ],
          },
          defaultEdge: {
            style: {
              stroke: '#A3B1BF',
            },
          },
          layout: {
            type: 'indented',
            isHorizontal: true,
            direction: 'LR',
            indent: 30,
            getHeight: function getHeight() {
              return 16;
            },
            getWidth: function getWidth() {
              return 16;
            },
          },
        });

        let data = this.treeData;
        console.log('树形图的data:')
        console.log(data);

        graph.node((node) => {
          return {
            type: 'file-node',
            label: node.name,
          };
        });
        graph.edge(() => {
          return {
            type: 'step-line',
          };
        });
        //为树上的所有节点绑定点击事件
        graph.on('node:click', (evt) => {
          const item = evt.item; // 被操作的节点 item
          //拿到被点击的节点的id
          console.log(item._cfg.model.id);
        });

        graph.data(data);
        graph.render();
        graph.fitView();

        if (typeof window !== 'undefined')
          window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
          };
      },
      initGraph(){
        const container = document.getElementById(this.newContainerId);
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
      this.getTreeDataByCandidateOntologyId();
      this.initGraph();
    }
  }
</script>
<style>
.tree-container{
  display: inline-block;
  width: 25%;
  height: 600px;
  background-color: rgba(251, 242, 250, 0.46);
  margin-left: 10px;
}
.canvas_container {
  display: inline-block;
  width: 69%;
  height:600px;
  background-color: rgba(251, 242, 250, 0.46);
  margin-right: 10px;
  float: right;
}
</style>
