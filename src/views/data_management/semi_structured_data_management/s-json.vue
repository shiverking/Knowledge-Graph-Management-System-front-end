<template>
  <div>
    <pre v-html="formattedJSON"></pre>
  </div>
</template>
<script>
export default {
  props: {
    json: Object,
  },
  mounted() {
    this.formattedJSON = syntaxHighlight(this.json);
  },
  data() {
    return {
      formattedJSON: "",
    };
  },
};

function syntaxHighlight(json) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">");
  return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function(match) {
        var cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
  );
}
</script>
<style scoped>
/deep/ pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}

/deep/ .string {
  color: green;
}

/deep/ .number {
  color: darkorange;
}

/deep/ .boolean {
  color: blue;
}

/deep/ .null {
  color: magenta;
}

/deep/ .key {
  color: red;
}
</style>
