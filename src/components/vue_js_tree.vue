<template>
    <div class="vueJs">
        <VueJstree  :item-events="itemEvents" allow-batch whole-row :draggable="draggable" class="tree" ref="jstree"
            @item-drag-start="itemDragStart" @item-drag-end="itemDragEnd" @item-drop-before="itemDropBefore"
            @item-drop="itemDrop" v-if="treeData.length" @item-click="itemClick" text-field-name="name"
            value-field-name="id" :data="treeData">
            <template slot-scope="_">
                <div v-if="isEdit" v-contextmenu="contextmenu2" @contextmenu.prevent="customItemClick2(_.vm, _.model, $event)"
                    style="display: inherit; width: 200px" @click.exact="customItemClick(_.vm, _.model, $event)">
                    <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                    {{ _.model.name }}
                </div>
                <div v-else @contextmenu.prevent="customItemClick2(_.vm, _.model, $event)"
                    style="display: inherit; width: 200px" @click.exact="customItemClick(_.vm, _.model, $event)">
                    <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                    {{ _.model.name }}
                </div>
            </template>
        </VueJstree>
    </div>
</template>

<script>
import 'jstree';
import VueJstree from 'vue-jstree'
import $ from '../plugins/jquery.min.js';
export default {
    name: '',
    props: ['treeData', 'type',"draggable", "isEdit",'refresh',], /// draggable 是否可以拖拽 /// isEdit 是否可以增加子类
    components: {
        VueJstree
    },
    data() {
        return {
            // dataList:this.treeData,
            contextmenu2: [
                { text: '新增子类', handler: this.handleClick },
                { text: '删除', handler: this.handleClick }
            ],
            leftTreeDataFlag: false,
            currentItem: {},
            editingNode: {},
            itemEvents: {
                mouseover: function () {
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
    // computed: {
    //     dataList() {
    //         return this.renderTree(this.treeData);
    //     }
    // },
    methods: {
        itemDragStart(node) {
            console.log(node)
            this.currentDragItem = node;
            console.log(node.model.name + ' drag start !')
        },
        itemDragEnd(node) {
            console.log(node)
            console.log(node.model.name + ' drag end !')
            axios.request({
                method: 'PUT',
                url: '/api/coreOntology/mergeOntology',
                params: {
                    beMergedClassId: node.model.id,
                    candidateOntologyId: 1,
                    coreOntologyClassId: this.currentDragItem.model.id,
                }
            }).then(response => {
                console.log(response);
                console.log(response.data.msg);
                if (response.status == 200 && response.data.result) {
                    console.log('请求到的response');
                    console.log(response);
                    this.$message({
                        type: 'success',
                        message: "合并成功"
                    });
                    this.$emit('setRefresh',!this.refresh)
                } else {
                    this.$message({
                        type: 'warning',
                        message: response.data.msg
                    });
                }
            }).catch(error => {
                console.log(error);
            })
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
                        this.$emit('setRefresh',!this.refresh)
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
                                this.$emit('setRefresh',!this.refresh)
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
                                this.$emit('setRefresh',!this.refresh)
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
        itemClick(node, item, e) {
            console.log(node)
            console.log(item)
            console.log(e)
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