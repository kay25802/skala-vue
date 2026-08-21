<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="config-area">

    <!-- 날씨 단위 -->
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

  margin-left: auto;

  /* ⭐ 두 설정 그룹 사이 간격 */
  gap: 22px;

  flex-wrap: nowrap;

  white-space: nowrap;
}


/* 각각
   [날씨단위 + 버튼]
   [언어 + 버튼]
   하나의 묶음 */
.config-item {
  display: flex;
  align-items: center;

  gap: 10px;

  flex: 0 0 auto;

  white-space: nowrap;
}


.config-item span {
  display: inline-block;

  white-space: nowrap;
}


/* 버튼 */
.toggle-btn {
  flex: 0 0 auto;

  padding: 7px 12px;

  background-color: #4b6584;
  color: #ffffff;

  border: none;
  border-radius: 5px;

  cursor: pointer;

  font-size: 13px;
  font-weight: bold;

  white-space: nowrap;

  line-height: 1.2;
}


.toggle-btn:hover {
  background-color: #3c536d;
}


.toggle-btn:active {
  transform: scale(0.98);
}


/* 화면이 조금 좁아지는 경우 */
@media (max-width: 1000px) {
  .config-area {
    gap: 14px;
  }

  .config-item {
    gap: 7px;
  }

  .toggle-btn {
    padding: 6px 9px;
    font-size: 12px;
  }
}
</style>