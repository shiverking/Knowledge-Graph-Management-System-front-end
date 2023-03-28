<template>
  <div class="vueJs">
    <VueJstree :item-events="itemEvents" allow-batch whole-row :draggable="draggable" class="tree" ref="jstree"
      @item-drag-start="itemDragStart" @item-drag-end="itemDragEnd" @item-drop-before="itemDropBefore"
      @item-drop="itemDrop" v-if="treeData.length" @item-click="itemClick" text-field-name="name" value-field-name="id"
      :data="treeData">
      <template slot-scope="_">
        <div v-if="isEdit" v-contextmenu="contextmenu2" @contextmenu.prevent="customItemClick2(_.vm, _.model, $event)"
          style="display: inherit; width: 200px" @click.exact="customItemClick(_.vm, _.model, $event)">
          <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
          {{ _.model.name }}
        </div>
        <div v-else @contextmenu.prevent="customItemClick2(_.vm, _.model, $event)" style="display: inherit; width: 200px"
          @click.exact="customItemClick(_.vm, _.model, $event)">
          <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
          {{ _.model.name }}
        </div>
      </template>
    </VueJstree>
    <el-dialog title="属性信息" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-table :data="attributeData" height="250" border style="width: 100%">
        <el-table-column prop="attributeName" label="属性名称" width="180">
        </el-table-column>
        <el-table-column prop="className" label="所属类别" width="180">
        </el-table-column>
        <el-table-column prop="comment" label="备注" width="270">
        </el-table-column>
        <el-table-column label="删除属性">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-delete" @click="deleteAttribute(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="float: left" @click="addDialogVisible = true">添 加 属 性</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      <el-dialog title="添加属性" :visible.sync="addDialogVisible" width="40%" :before-close="handleClose">
        <el-form ref="form" :model="attributeForm" label-width="80px">
          <el-form-item label="属性名称">
            <el-input v-model="attributeForm.attributeName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="attributeForm.comment"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="addAttribute">立即添加</el-button>
            <el-button @click="addDialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import 'jstree';
import VueJstree from 'vue-jstree'
import $ from '../plugins/jquery.min.js';
let leftNodeId = null
export default {
  name: '',
  props: ['treeData', 'type', "draggable", "isEdit", 'refresh', 'candidateOntologyId'], /// draggable 是否可以拖拽 /// isEdit 是否可以增加子类
  components: {
    VueJstree
  },
  data() {
    return {
      node: null,
      item: null,
      attributeForm: {
        attributeName: '',
        comment: ''
      },
      attributeData: [],
      dialogVisible: false,
      addDialogVisible: false,
      contextmenu2: [
        { text: '新增子类', handler: this.handleClick },
        { text: '删除', handler: this.handleClick }
      ],
      leftTreeDataFlag: false,
      currentItem: {},
      editingNode: {},
      itemEvents: {
        mouseover: function (e) {
          console.log(e.model.id);
          leftNodeId = e.model.id

          console.log('mouseover')
        },
        contextmenu: function () {
          console.log(arguments[2])
          arguments[2].preventDefault()
          console.log('contextmenu')
        }
      },
      currentDragItem: ""
    }
  },
  mounted() {
    this.renderTree(this.treeData);
  },
  methods: {
    deleteAttribute(attributeId) {
      if (this.$route.path === '/coredata/mainontology/display') {
        axios.request({
          method: 'DELETE',
          url: '/api/coreOntology/deleteAttribute/' + attributeId,
        }).then((response) => {
          if (response.status === 200 && response.data.result) {
            this.itemClick(this.node, this.item, null);
            this.$message({
              type: 'success',
              message: "删除成功"
            });
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg
            });
          }
        }).catch(error => {
          console.log(error);
        })
      }
      if (this.$route.path === '/candidate/ontology/show') {
        axios.request({
          method: 'DELETE',
          url: '/api/candidateOntology/deleteAttribute/' + attributeId,
        }).then((response) => {
          if (response.status === 200 && response.data.result) {
            this.itemClick(this.node, this.item, null);
            this.$message({
              type: 'success',
              message: "删除成功"
            });
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg
            });
          }
        }).catch(error => {
          console.log(error);
        })
      }
    },
    addAttribute() {
      if (this.$route.path === '/coredata/mainontology/display') {
        axios.request({
          method: 'POST',
          url: '/api/coreOntology/addAttribute',
          data: {
            classId: this.item.id,
            attributeName: this.attributeForm.attributeName,
            comment: this.attributeForm.comment
          }
        }).then((response) => {
          if (response.status === 200 && response.data.result) {
            this.itemClick(this.node, this.item, null);
            this.$message({
              type: 'success',
              message: "添加成功"
            });
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg
            });
          }
        }).catch(error => {
          console.log(error);
        })
      }
      if (this.$route.path === '/candidate/ontology/show') {
        console.log('候选本体id=' + this.candidateOntologyId);
        axios.request({
          method: 'POST',
          url: '/api/candidateOntology/addAttribute',
          data: {
            classId: this.item.id,
            attributeName: this.attributeForm.attributeName,
            comment: this.attributeForm.comment,
            belongCandidateId: this.candidateOntologyId
          }
        }).then((response) => {
          if (response.status === 200 && response.data.result) {
            this.itemClick(this.node, this.item, null);
            this.$message({
              type: 'success',
              message: "添加成功"
            });
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg
            });
          }
        }).catch(error => {
          console.log(error);
        })
      }
      this.addDialogVisible = false;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    itemDragStart(node) {
      console.log(node)
      this.currentDragItem = node;
      console.log(node.model.name + ' drag start !')
    },
    a() {

    },
    itemDragEnd(node) {
      console.log(leftNodeId);
      console.log(node);
      console.log("开始融合");
      console.log(node.model.name + " drag end !");
      console.log("candidateOntologyId=" + this.candidateOntologyId);
      console.log("beMergedClassId=" + node.model.id);
      console.log("coreOntologyClassId=" + this.currentDragItem.model.id);
      setTimeout(() => {
        axios.request({
          method: 'PUT',
          url: '/api/coreOntology/mergeOntology',
          params: {
            beMergedClassId: this.currentDragItem.model.id,
            candidateOntologyId: this.candidateOntologyId,
            coreOntologyClassId: leftNodeId,
          }
        }).then(response => {
          console.log(response);
          console.log(response.data.msg);
          if (response.status === 200 && response.data.result) {
            console.log('请求到的response');
            console.log(response);
            this.$message({
              type: 'success',
              message: "合并成功"
            });
            this.$emit('setRefresh', !this.refresh)
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg
            });
          }
        }).catch(error => {
          console.log(error);
        })
      }, 2000);
    },
    itemDropBefore(node, item, draggedItem, e) {
      console.log(node)
      console.log(item)
      console.log(draggedItem)
      console.log(e)
      // if (!draggedItem) {
      //     item.addChild({
      //         name: draggedItem.model.name,
      //         id: draggedItem.model.id,
      //     })
      // }
    },
    itemDrop(node, item, draggedItem, e) {
      var sortBy = function (attr, rev) {
        if (rev == undefined) {
          rev = 1;
        } else {
          rev = (rev) ? 1 : -1;
        }
        return function (a, b) {
          a = a[attr];
          b = b[attr];
          if (a < b) {
            return rev * -1;
          }
          if (a > b) {
            return rev * 1;
          }
          return 0;
        }
      }
      item.children.sort(sortBy('text', true))
      this.$refs.tree.handleRecursionNodeChildren(draggedItem, function (childrenItem) {
        childrenItem.selected = item.selected
      })
      console.log(node.model.text + ' drop !')
    },
    addClass(value) {
      if (this.type == 1) {
        axios.request({
          method: 'POST',
          url: '/api/coreOntology/addClass',
          data: {
            name: value,
            parentId: this.currentItem.id,
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200 && response.data.result) {
            console.log('请求到的response');
            console.log(response);
            this.currentItem.addChild({
              id: "",
              name: value,
              parentId: this.currentItem.parentId,
              belongCandidateId: this.currentItem.belongCandidateId,
            })
            this.$message({
              type: 'success',
              message: "添加成功"
            });
            this.renderTree(this.treeData);
            this.$emit('setRefresh', !this.refresh)
            this.$forceUpdate()
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg
            });
          }
        }).catch(error => {
          console.log(error);
        })
      } else {
        axios.request({
          method: 'POST',
          url: '/api/candidateOntology/addClass',
          data: {
            id: "",
            name: value,
            parentId: this.currentItem.id,
            belongCandidateId: this.currentItem.belongCandidateId,
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200 && response.data.result) {
            console.log('请求到的response');
            console.log(response);
            this.currentItem.addChild({
              id: "",
              name: value,
              parentId: this.currentItem.id,
              belongCandidateId: this.currentItem.belongCandidateId,
            })
            this.$message({
              type: 'success',
              message: "添加成功"
            });
            // this.renderTree(this.treeData);
            this.$emit('setRefresh', !this.refresh)
            this.$forceUpdate()
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg
            });
          }
        }).catch(error => {
          console.log(error);
        })
      }

    },
    handleClick(menuClick, menuIndex, target, evt) {
      console.log(`点击了菜单第${menuIndex}项`)
      if (menuIndex == 0) {
        this.$prompt('请输入节点名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.addClass(value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      } else {
        this.$confirm('此操作将永久删除此节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.type == 1) {
            axios.request({
              method: 'DELETE',
              url: '/api/coreOntology/deleteClass',
              data: {
                name: this.currentItem.name,
              }
            }).then(response => {
              console.log(response);
              if (response.status == 200 && response.data.result) {
                console.log('请求到的response');
                console.log(response);
                if (this.currentItem.id !== undefined) {
                  var index = this.editingNode.parentItem.indexOf(this.currentItem)
                  this.editingNode.parentItem.splice(index, 1)
                }
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.$emit('setRefresh', !this.refresh)
                this.$forceUpdate()
              } else {
                this.$message({
                  type: 'warning',
                  message: response.data.msg
                });
              }
            }).catch(error => {
              console.log(error);
            })
          } else {
            axios.request({
              method: 'DELETE',
              url: '/api/candidateOntology/deleteClass',
              data: {
                id: this.currentItem.id,
                name: this.currentItem.name,
                belongCandidateId: this.currentItem.belongCandidateId,
              }
            }).then(response => {
              if (response.status == 200 && response.data.result) {
                if (this.currentItem.id !== undefined) {
                  var index = this.editingNode.parentItem.indexOf(this.currentItem)
                  this.editingNode.parentItem.splice(index, 1)
                }
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.$emit('setRefresh', !this.refresh)
                this.$forceUpdate()

              } else {
                this.$message({
                  type: 'warning',
                  message: response.data.message
                });
              }
            }).catch(error => {
              console.log(error);
            })
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    },
    customItemClick(node, item, e) {
      console.log(node)
      console.log(item)
      console.log(e)
    },
    customItemClick2(node, item, e) {
      this.currentItem = item;
      this.editingNode = node;
      console.log(this.currentItem);
      if ($(".contextmenu").length) {
        const menu1 = $(".contextmenu")[0]
        menu1.parentNode.removeChild(menu1);
        console.log(node)
        console.log(item)
        console.log(e)
      }
    },
    //树上节点的点击事件，点击后打开属性列表
    itemClick(node, item, e) {
      if (!this.isEdit) {
        return
      }
      this.node = node;
      this.item = item;
      this.attributeData = [];
      this.dialogVisible = true;
      if (this.$route.path === '/coredata/mainontology/display') {
        axios.request({
          method: 'GET',
          url: '/api/coreOntology/getAttribute/' + item.id
        }).then((response) => {
          if (response.status === 200 && response.data.result) {
            this.attributeData = response.data.data;
          }
        }).catch(error => {
          console.log(error);
        })
      }
      if (this.$route.path === '/candidate/ontology/show') {
        console.log('候选本体id=' + this.candidateOntologyId);
        axios.request({
          method: 'GET',
          url: '/api/candidateOntology/getAttribute/' + item.id + '/' + this.candidateOntologyId
        }).then((response) => {
          if (response.status === 200 && response.data.result) {
            this.attributeData = response.data.data;
          }
        }).catch(error => {
          console.log(error);
        })
      }
    },
    renderTree(tree) {
      for (let node of tree) {
        node.opened = false;
        node.selected = false;
        node.loading = false;
        node.disabled = false;
        if (node.children) {
          this.renderTree(node.children)
        }
      }
    },
    addNode(node, item, e) {
      console.log(node)
      console.log(item)
      console.log(e)
    },
    deleteNode(node, item, e) {
      console.log(node)
      console.log(item)
      console.log(e)
    },
    onMuseover(e) {
      console.log(e);
    }
  },
}
</script>

<style>
.vueJs {
  width: 100%;
  height: 100%;
}

.tree-default {
  width: 100%;
  height: 100%;
}
</style>