<template>
  <div>
    <Modal v-model="modalShow" @on-cancel="cancel" @on-ok="ok">
      <p slot="header" style="text-align:center">
        <template>
          <Icon type="ios-menu" />
          <span>{{title?title:'菜单树'}}</span>
        </template>
      </p>
      <Tree :data="data" show-checkbox></Tree>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "tree",
    props: {
      show: Boolean,
      title: String
    },
    data () {
      return {
        data: []
      }
    },
    model: {
      prop: 'show',
      event: 'self-model'
    },
    computed: {
      modalShow:{
        get () {
          return this.show
        },
        set (value) {
          this.modal = value
        }
      }
    },
    methods: {
      init () {
        let menuRoot = this.$store.getters.menuRoot
        this.data = this.menuNodeToTreeNode(menuRoot.children)
      },
      menuNodeToTreeNode (menuNodes) {
        let treeNode = []
        menuNodes.forEach((v) => {
          let node = {
            title: v.element.name
          }
          if (v.hasChild) {
            node.children = this.menuNodeToTreeNode(v.children)
          }
          treeNode.push(node)
        })
        return treeNode
      },
      ok () {
        this.$emit('self-done',false);
        this.$emit('self-model',false);
      },
      cancel () {
        this.$emit('self-done',false);
        this.$emit('self-model',false);
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>

</style>
