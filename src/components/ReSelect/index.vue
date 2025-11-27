<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "ReSelect"
});

interface Props {
  /** 清空时返回的默认值，默认为空字符串 */
  defaultReturn?: any;
  /** v-model 绑定的值 */
  modelValue?: any;
}

const props = withDefaults(defineProps<Props>(), {
  defaultReturn: ""
});

const emit = defineEmits<{
  "update:modelValue": [value: any];
}>();

/** 处理 v-model 的双向绑定 */
const model = computed({
  get: () => props.modelValue || "",
  set: value => emit("update:modelValue", value || props.defaultReturn)
});
</script>

<template>
  <el-select v-model="model" v-bind="$attrs">
    <slot></slot>
  </el-select>
</template>
