<template>
  <!--
    需要在 HTML 中创建一个用于容纳 G6 绘制的图的容器，通常为 div  标签。
    G6 在绘制时会在该容器下追加 canvas 标签，然后将图绘制在其中。
  -->
  <div id="mountNode"></div>
</template>

<script>
  import * as G6 from '../../../plugins/g6.min.js';
  export default {
    name:'CandidateOntologyShow',
    data() {
      return {
      }
    },
    methods:{
      initGraph(){
        //缩略图 (Minimap) 是一种常见的用于快速预览和探索图的工具，可作为导航辅助用户探索大规模图。
        // Minimap 是 G6 的插件之一，引入 G6 后可以直接使用。实例化 Minimap 对象，并将其配置到图实例的插件列表里即可
        // 实例化 minimap 插件
        const minimap = new G6.Minimap({
          size: [100, 100],
          className: 'minimap',
          type: 'delegate',
        });

        // Grid网格可用于辅助用户在拖拽节点时对齐到网格。
        // 实例化 grid 插件
        const grid = new G6.Grid();

        // 实例化图
        const graph = new G6.Graph({
          container: 'mountNode', // 指定挂载容器
          width: 1200, // 图的宽度
          height: 500, // 图的高度
          // 为优化超出屏幕到问题，G6 提供了图的两个相关配置项
          // fitView: true, //设置是否将图适配到画布中
          // fitViewPadding: [20, 40, 50, 20], //画布上四周的留白宽度

//    适用场景：所有节点统一的属性配置，所有边统一的属性配置。
//    使用方式：使用图的两个配置项：
//    defaultNode：节点在默认状态下的样式属性（style）和其他属性；
//    defaultEdge：边在默认状态下的样式属性（style）和其他属性。
          // 节点在默认状态下的样式配置（style）和其他配置
          defaultNode: {
            size: 30, // 节点大小
            // 节点样式配置
            style: {
              fill: 'steelblue', // 节点填充色
              stroke: '#666', // 节点描边色
              lineWidth: 1, // 节点描边粗细
            },
            // 节点上的标签文本配置
            labelCfg: {
              // 节点上的标签文本样式配置
              style: {
                fill: '#fff', // 节点标签文字颜色
              },
            },
          },
          // 边在默认状态下的样式配置（style）和其他配置
          defaultEdge:{
            // 去掉全局配置的 style
            // 边上的标签文本配置
            labelCfg: {
              autoRotate: true, // 边上的标签文本根据边的方向旋转
            },
          },

//    当实例化图时没有配置布局时：
//    若数据中节点有位置信息（x 和 y），则按照数据的位置信息进行绘制；
//    若数据中节点没有位置信息，则默认使用 Random Layout 进行布局。
//    实例化图时全局配置
//       G6 使用布局的方式非常简单，在图实例化的时候，加上 layout 配置即可。
//       下面代码在实例化图时设置了布局方法为 type: 'force'，即经典力导向图布局。
//       并设置了参数 preventOverlap: true ，表示希望节点不重叠。
          layout: {
            // Object，可选，布局的方法及其配置项，默认为 random 布局。
            type: 'force', // 指定为力导向布局
            preventOverlap: true, // 防止节点重叠
            // nodeSize: 30        // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
            //linkDistance 属性用来指定布局的时候边的距离长度
            linkDistance: 100, // 指定边距离为100
          },

          // G6 中的交互行为
          // Mode 是 G6 交互行为的管理机制，一个 mode 是多种行为 Behavior 的组合，允许用户通过切换不同的模式进行交互行为的管理。
          modes: {
            default: [
              'drag-canvas', // 允许拖拽画布
              'zoom-canvas', //放缩画布
              'drag-node', //拖拽节点

              //    交互工具是指配置到图上交互模式中的工具。使用交互工具时，有两个步骤：
              //    Step 1: 在实例化图时配置 modes；
              //    Step 2: 为交互工具定义样式。
              // 由于 tooltip 实际上是一个悬浮的 <div> 标签，因此可在 HTML 的 <style> 标签或 CSS 中设置样式
              // {
              //   type: 'tooltip', // 提示框
              //   formatText(model) {
              //     // 提示框文本内容
              //     const text = 'label: ' + model.label + '<br/> class: ' + model.class;
              //     return text;
              //   },
              // },
              // edge-tooltip 边提示框
              // 边提示框可以用在边的详细信息的展示。当鼠标滑过边时，显示一个浮层告知边的详细信息
              // {
              //   type: 'edge-tooltip', // 边提示框
              //   formatText(model) {
              //     // 边提示框文本内容
              //     const text =
              //         'source: ' +
              //         model.source +
              //         '<br/> target: ' +
              //         model.target +
              //         '<br/> weight: ' +
              //         model.weight;
              //     return text;
              //   },
              // },
            ],
          },

          // 举例解释不同模式
          // 上面代码中的 modes 定义了 G6 的模式，default 是默认的模式，还可以允许有其他的模式，
          // 比如：编辑模式 edit 等。不同的模式，用户能进行的行为可以不同，比如默认模式能拖拽画布，编辑模式不允许拖拽画布
          // modes: {
          //   default: ['drag-canvas'],
          //   edit: []
          // }

          // 在实例化图时，通过 nodeStateStyles 和 edgeStateStyles 两个配置项可以配置元素在不同状态下的样式。
          // 下面代码设置了节点分别在 hover 和 click 状态为 true 时的样式，边在 click 状态为 true 时的样式
          // 节点不同状态下的样式集合
          nodeStateStyles: {
            // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
            hover: {
              fill: 'lightsteelblue',
            },
            // 鼠标点击节点，即 click 状态为 true 时的样式
            click: {
              stroke: '#000',
              lineWidth: 3,
            },
          },
          // 边不同状态下的样式集合
          edgeStateStyles: {
            // 鼠标点击边，即 click 状态为 true 时的样式
            click: {
              stroke: 'steelblue',
            },
          },

          //配置插件
          plugins: [minimap,grid], // 将 minimap 实例配置到图上

          // animate: true, // Boolean，可选，全局变化时否使用动画过渡
        });

        // 修改 index.html，通过 fetch 函数异步加载远程的数据源，并传入 G6 的图实例中：
        // fetch 函数允许我们发起网络请求，加载数据，而其异步的过程可以通过 async/await 进行更合理的控制。
        // 这里我们为了方便起见，将主要逻辑放在了 main 函数里面
        const main = async () => {
          const response = await fetch(
              'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json',
          );
          const remoteData = await response.json();
          //读入数据后，通过遍历的方式写入配置。下面代码展示了如何遍历数据进行属性的配置
          const nodes = remoteData.nodes;
          // 图中有一些节点被渲染成了矩形，还有一些被渲染成了椭圆形。
          // 除了设置 type 属性之外，我们还覆盖了上文全局配置的节点的 size 属性，在矩形和椭圆的情况下，size 是一个数组；
          // 而在默认圆形的情况下，G6 将仍然读取全局配置的 size 属性为数字 30。
          // 也就是说，动态配置属性让我们既可以根据数据的不同配置不同的属性值，也可以有能力覆盖全局静态的属性值。
          nodes.forEach((node) => {
            if (!node.style) {
              node.style = {};
            }
            switch (
                node.class // 根据节点数据中的 class 属性配置图形
                ) {
              case 'c0': {
                node.type = 'circle'; // class = 'c0' 时节点图形为 circle
                break;
              }
              case 'c1': {
                node.type = 'rect'; // class = 'c1' 时节点图形为 rect
                node.size = [35, 20]; // class = 'c1' 时节点大小
                break;
              }
              case 'c2': {
                node.type = 'ellipse'; // class = 'c2' 时节点图形为 ellipse
                node.size = [35, 20]; // class = 'c2' 时节点大小
                break;
              }
            }
          });
          // 遍历边数据,根据数据的比重不同，配置不一样边的粗细：
          const edges = remoteData.edges;
          edges.forEach((edge) => {
            if (!edge.style) {
              edge.style = {};
            }
            edge.style.lineWidth = edge.weight; // 边的粗细映射边数据中的 weight 属性数值
            // 移到此处
            edge.style.opacity = 0.6;
            edge.style.stroke = 'grey';
          });
          graph.data(remoteData);// 加载远程数据
          graph.render(); // 渲染

          // G6 中所有元素监听都挂载在图实例上，如下代码中的 graph 对象是 G6.Graph 的实例，
          // graph.on()  函数监听了某元素类型（node / edge）的某种事件（click / mouseenter / mouseleave / ... 所有事件参见：Event API）
          // 我们通过下面代码，为 Tutorial 案例 增加点和边上的监听事件，并在监听函数里使用 graph.setItemState() 改变元素的状态
          // 鼠标进入节点
          graph.on('node:mouseenter', (e) => {
            const nodeItem = e.item; // 获取鼠标进入的节点元素对象
            graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
          });

          // 鼠标离开节点
          graph.on('node:mouseleave', (e) => {
            const nodeItem = e.item; // 获取鼠标离开的节点元素对象
            graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
          });

          // 点击节点
          graph.on('node:click', (e) => {
            // 先将所有当前是 click 状态的节点置为非 click 状态
            const clickNodes = graph.findAllByState('node', 'click');
            clickNodes.forEach((cn) => {
              graph.setItemState(cn, 'click', false);
            });
            const nodeItem = e.item; // 获取被点击的节点元素对象
            graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
          });

          // 点击边
          graph.on('edge:click', (e) => {
            // 先将所有当前是 click 状态的边置为非 click 状态
            const clickEdges = graph.findAllByState('edge', 'click');
            clickEdges.forEach((ce) => {
              graph.setItemState(ce, 'click', false);
            });
            const edgeItem = e.item; // 获取被点击的边元素对象
            graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
          });
        };
        main()
        // 数据的加载和图的渲染是两个步骤，可以分开进行。
        // graph.data(initData); // 加载数据
        // 调用 graph.render() 方法之后，G6 引擎会根据加载的数据进行图的绘制。结果如下：
        // graph.render(); // 渲染
      },

    },
    mounted() {
      this.initGraph()
    }
  }
</script>

<style>
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
</style>