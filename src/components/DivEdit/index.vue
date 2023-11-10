<template>
  <div class="div-edit"
       :class="{ 'editing': isEditing }"
       contenteditable="plaintext-only"
       placeholder="请输入内容"
       @input="changeDivText($event)"
       @focus="divFocus"
       @blur="divBlur"
       v-html="value">
    {{value}}
  </div>
</template>

<script>
export default {
  name: 'divEdit',
  data() {
    return {
      editText: "",
      isEditing: false
    }
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    sourceData: {
      type: Object,
      default: null
    }
  },
  created() {
    this.editText = this.value
  },
  methods: {
    changeDivText(event) {
      this.editText = event.target.innerHTML
    },
    divFocus() {
      this.editText = this.value
      this.isEditing = true
    },
    divBlur() {
      this.$emit("input", this.editText, this.sourceData)
      this.isEditing = false
    }
  }
}
</script>
<style scoped>
.div-edit {
  height: 40px;
  line-height: 40px;
  padding: 0 5px;
}
.div-edit.editing {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 5px;
  width: 100%;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
</style>
