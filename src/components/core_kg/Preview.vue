<template>
  <div>
    <h3 style="margin-left: 10px;display: inline-block;">核心图谱预览</h3>
    <el-tooltip class="item" effect="dark" content="当前显示节点限制1000,跳转到Neo4j数据库查看详情" placement="top-start">
      <el-button style="display: inline-block;margin-left: 10px;" @click="goNeo4j()">Neo4j</el-button>
    </el-tooltip>
    <div id = "viz" style="height:600px;">
    </div>
  </div>
</template>
<script src="@/plugins/neovis.js"></script>
<script src="@/plugins/jquery.min.js"></script>
<script>
import {NeoVis} from "@/plugins/neovis";
export default {
  name: "Preview",
  components:{
    NeoVis,
  },
  methods:{
    draw_intern() {
      var viz;
      var config = {
        containerId: "viz",
        neo4j: {
          serverUrl: "bolt://localhost:7687",
          serverUser: "neo4j",
          serverPassword: "123456"
        },
        labels: {
          all:{
            caption: "name", //节点显示的内容
            size:"pagerank",
            community:"community"
          }
        },
        relationships: {
          all: {
            caption:true,
            thickness: 'weight',
          },
        },
        initialCypher: "match (n)-[r]->(m) return n,r,m limit 1000"
      };
      viz = new NeoVis(config);
      viz.render();
    },
    goNeo4j(){
      window.location.href="http://localhost:7474/browser/"
    }
  },
  mounted() {
    this.draw_intern();
  }
}
</script>

<style scoped>

</style>