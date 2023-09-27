<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SortDropdown",
  props: {
    modelValue: {
      type: String,
      default: "По названию"
    }
  },
  data() {
    return {
      sortValue: "По названию",
      sortOptions: ["По названию", "По рейтингу", "По году", "По хронометражу"]
    };
  },
  watch: {
    modelValue(value) {
      this.sortValue = value;
    }
  },
  methods: {
    updateModel(option) {
      this.sortValue = option;
      this.$emit("update:modelValue", option);
    }
  }
});
</script>

<template>
  <div class="dropdown m-2">
    <button
      id="dropdownBtn"
      class="btn btn-primary dropdown-toggle px-3 py-2"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ sortValue }}
    </button>
    <ul
      class="dropdown-menu dropdown-menu-dark bg-primary p-0"
      aria-labelledby="dropdownBtn"
    >
      <li
        v-for="option in sortOptions"
        :key="option"
      >
        <button
          class="dropdown-item btn btn-primary text-white px-3 py-2"
          :class="sortValue === option ? 'active' : ''"
          type="button"
          @click="updateModel(option)"
        >
          {{ option }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.active {
  background: rgba(0, 0, 0, 0.1);
}
</style>