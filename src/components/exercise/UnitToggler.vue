<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="config-area">

    <!-- 온도 단위 -->
    <div class="config-item">
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
        @click="configStore.toggleUnit()"
      >
        단위변경
      </button>
    </div>


    <!-- 언어 설정 -->
    <div class="config-item">
      <span>
        언어:

        <strong>
          {{ configStore.languageLabel }}
        </strong>
      </span>

      <button
        class="toggle-btn"
        @click="configStore.toggleLanguage()"
      >
        {{
          configStore.language === 'ko'
            ? '영어로 변경'
            : '한글로 변경'
        }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.config-area {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
}

.config-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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