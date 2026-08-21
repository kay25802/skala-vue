<script setup>
import { useConfigStore } from '@/stores/configStore'

// =====================================================
// Pinia Store
// =====================================================

const configStore = useConfigStore()
</script>


<template>
  <div class="unit-toggler">

    <span>
      날씨단위:

      <strong>
        {{
          configStore.unit === 'celsius'
            ? `섭씨(${configStore.unitSymbol})`
            : `화씨(${configStore.unitSymbol})`
        }}
      </strong>
    </span>


    <button
      class="toggle-btn"
      @click="configStore.toggleUnit"
    >
      단위변경
    </button>

  </div>
</template>


<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin-left: auto;

  text-align: center;
}

.toggle-btn {
  padding: 6px 10px;

  background-color: #4b6584;
  color: #ffffff;

  border: none;
  border-radius: 4px;

  cursor: pointer;

  font-weight: bold;
}

.toggle-btn:hover {
  background-color: #3c536d;
}
</style>