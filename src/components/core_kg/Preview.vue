<template>
  <div>
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
        initialCypher: "match (n)-[r]->(m) return n,r,m"
      };
      viz = new NeoVis(config);
      viz.render();
    }
  },
  mounted() {
    this.draw_intern();
  }
}
</script>

<style scoped>

</style>