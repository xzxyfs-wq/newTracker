<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormItemProps } from "../utils/types";

defineOptions({
  name: "RoomForm"
});

const props = defineProps<{
  formInline?: FormItemProps;
  hospitalDistrictOptions?: any[];
}>();

const formRef = ref();
// 优化：移除 hospital_district_name，只保留必要的字段，减少数据维护成本
const formInline = reactive<FormItemProps>({
  room_id: undefined,
  room_name: "",
  order_by: 1, // 默认值为1
  hospital_district_id: undefined
});

// 优化监听：只监听 formInline 引用变化，避免深度监听
// 合并字段更新逻辑，减少重复代码
watch(
  () => props.formInline,
  newVal => {
    if (newVal) {
      formInline.room_id = newVal.room_id ?? undefined;
      formInline.room_name = newVal.room_name ?? "";
      // 新增时默认为1，编辑时使用原有值（如果为0或undefined则设为1）
      formInline.order_by =
        newVal.order_by && newVal.order_by > 0 ? newVal.order_by : 1;
      formInline.hospital_district_id =
        newVal.hospital_district_id ?? undefined;
    }
  },
  { immediate: true }
);

const rules = reactive({
  room_name: [{ required: true, message: "请输入房间名称", trigger: "blur" }],
  hospital_district_id: [
    { required: true, message: "请选择院区", trigger: "change" }
  ],
  order_by: [{ required: true, message: "请输入排序", trigger: "blur" }]
});

function getRef() {
  return formRef.value;
}

defineExpose({ getRef, formInline });
</script>

<template>
  <el-form ref="formRef" :model="formInline" :rules="rules" label-width="100px">
    <el-form-item label="房间名称" prop="room_name">
      <el-input
        v-model="formInline.room_name"
        placeholder="请输入房间名称"
        clearable
      />
    </el-form-item>
    <el-form-item label="院区名称" prop="hospital_district_id">
      <el-select
        v-model="formInline.hospital_district_id"
        placeholder="请选择院区"
        clearable
        style="width: 100%"
      >
        <el-option
          v-for="option in props.hospitalDistrictOptions || []"
          :key="option.hospital_district_id"
          :label="option.hospital_district_name"
          :value="option.hospital_district_id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="排序" prop="order_by">
      <el-input-number
        v-model="formInline.order_by"
        :min="1"
        placeholder="请输入排序"
        style="width: 100%"
      />
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
