<template>

</template>

<script>
  import * as d3 from 'd3'
  export default {
    name: "testd3"
  }
  var tree = d3.layout.tree()
      .size([width, height-200]) //设定尺寸
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2); });//设定节点之间的间隔
  d3.json("testd3.json", function(error, root) {
    var nodes = tree.nodes(root);
    var links = tree.links(nodes);
    console.log(nodes);
    console.log(links);
  });

  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  var link = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", diagonal);  //使用对角线生成器
</script>

<style scoped>

</style>