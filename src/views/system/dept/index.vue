<template>
  <div v-permission="['system:dept:query']" class="app-container">
    <a-row :gutter="20">
      <a-col :span="14">
        <a-card>
          <a-space>
            <a-button v-permission="['system:dept:add']" type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
            <a-button icon="reload" @click="getDeptTrees">刷新</a-button>
            <a-dropdown>
              <a-menu slot="overlay" @click="handleCommand">
                <a-menu-item key="allOpen">
                  <a-icon type="check" />展开所有
                </a-menu-item>
                <a-menu-item key="allFold">
                  <a-icon type="stop" />折叠所有
                </a-menu-item>
                <a-menu-item key="allCheck">
                  <a-icon type="stop" />全选
                </a-menu-item>
                <a-menu-item key="allUnCheck">
                  <a-icon type="stop" />取消选择
                </a-menu-item>
                <a-menu-item key="reserveCheck">
                  <a-icon type="stop" />反选
                </a-menu-item>
              </a-menu>
              <a-button>操作<a-icon type="down" /></a-button>
            </a-dropdown>

            <a-dropdown v-permission="['system:dept:modify']">
              <a-menu slot="overlay" @click="handleCommand">
                <a-menu-item key="batchEnable">
                  <a-icon type="check" />批量启用
                </a-menu-item>
                <a-menu-item key="batchUnable">
                  <a-icon type="stop" />批量停用
                </a-menu-item>
              </a-menu>
              <a-button>更多<a-icon type="down" /></a-button>
            </a-dropdown>
            <a-switch
              v-model="showAllDepts"
              checked-children="显示全部部门"
              un-checked-children="只显示启用部门"
              @change="showChange"
            />
          </a-space>

          <div v-loading="loading" class="tree-container">
            <a-tree
              ref="tree"
              v-model="checkedKeys"
              :tree-data="treeData"
              :checkable="true"
              :show-line="true"
              :expanded-keys.sync="expandedKeys"
              :replace-fields="{
                children: 'children',
                title: 'name',
                key: 'id'
              }"
              :check-strictly="false"
              :indent="0"
              style="margin-top: 10px;"
              @select="currentChange"
            >
              <template slot="title" slot-scope="treeNode">
                <span v-if="treeNode.available">
                  {{ treeNode.name }}
                </span>
                <span v-else style="color: #FF4D4F;">
                  {{ treeNode.name }}
                </span>
              </template>

              <div slot="child" />
            </a-tree>
          </div>
        </a-card>
      </a-col>
      <a-col :span="10">
        <a-card>
          <modify v-if="!$utils.isEmpty(id)" :id="id" ref="updateDialog" @confirm="e => {id = '';getDeptTrees()}" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="getDeptTrees" />
  </div>
</template>

<script>
import Add from './add'
import Modify from './modify'

export default {
  name: 'Dept',
  components: {
    Add, Modify
  },
  data() {
    return {
      loading: false,
      // 部门树形数据
      treeData: [],
      // 部门数据
      depts: [],
      // 是否显示停用的部门
      showAllDepts: false,
      id: '',
      expandedKeys: [],
      checkedKeys: []
    }
  },
  created() {
    this.getDeptTrees()
  },
  methods: {
    getDeptTrees() {
      this.checkedKeys = []
      this.expandedKeys = []
      this.loading = true
      this.id = ''
      this.$api.system.dept.trees().then(res => {
        if (!this.$utils.isEmpty(res)) {
          let treeData = this.$utils.toArrayTree(res, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })

          this.$utils.eachTree(treeData, item => {
            if (this.$utils.isEmpty(item.children)) {
              item.scopedSlots = { switcherIcon: 'child' }
            }
          })

          res = this.$utils.toTreeArray(treeData, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })

          treeData = res
          this.depts = res
          if (!this.showAllDepts) {
            treeData = treeData.filter(item => item.available)
          }

          this.treeData = this.$utils.toArrayTree(treeData, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })
        } else {
          this.treeData = []
          this.depts = []
        }

        this.handleCommand({
          key: 'allOpen'
        })
      }).finally(() => {
        this.loading = false
      })
    },
    handleCommand({ key }) {
      if (key === 'batchEnable') {
        this.batchEnable()
      } else if (key === 'batchUnable') {
        this.batchUnable()
      } else if (key === 'allOpen') {
        this.expandedKeys = this.depts.map(item => item.id)
      } else if (key === 'allFold') {
        this.expandedKeys = []
      } else if (key === 'allCheck') {
        const treeData = this.$utils.toTreeArray(this.treeData, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })
        this.checkedKeys = treeData.map(item => item.id)
      } else if (key === 'allUnCheck') {
        this.checkedKeys = []
      } else if (key === 'reserveCheck') {
        const treeData = this.$utils.toTreeArray(this.treeData, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })
        const allKeys = treeData.map(item => item.id)
        const unCheckedKeys = allKeys.filter(item => !this.checkedKeys.includes(item))

        this.checkedKeys = unCheckedKeys
      }
    },
    batchUnable() {
      const records = this.checkedKeys

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要停用的部门！')
        return
      }

      this.$msg.confirm('是否确定停用选择的部门及其下级部门？').then(() => {
        this.loading = true
        const ids = records
        this.$api.system.dept.batchUnable(ids).then(data => {
          this.$msg.success('停用成功！')
          this.getDeptTrees()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    batchEnable() {
      const records = this.checkedKeys

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要启用的部门！')
        return
      }

      this.$msg.confirm('是否确定启用选择的部门及其下级部门？').then(() => {
        this.loading = true
        const ids = records
        this.$api.system.dept.batchEnable(ids).then(data => {
          this.$msg.success('启用成功！')
          this.getDeptTrees()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    showChange(val) {
      let treeData = this.depts
      if (!val) {
        treeData = treeData.filter(item => item.available)

        const currentIds = treeData.map(item => item.id)
        this.checkedKeys = this.checkedKeys.filter(item => currentIds.includes(item))
      }
      this.treeData = this.$utils.toArrayTree(treeData)
    },
    // 选中的部门发生改变
    currentChange(data) {
      this.id = ''
      if (!this.$utils.isEmpty(data)) {
        this.$nextTick(() => {
          this.id = data[0]
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
