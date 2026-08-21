import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {

  // =====================================================
  // 1. state
  // 현재 날씨 단위를 저장
  // 'celsius' 또는 'fahrenheit'
  // =====================================================

  const unit = ref('celsius')


  // =====================================================
  // 2. getter
  // 현재 단위에 맞는 기호 반환
  // =====================================================

  const unitSymbol = computed(() => {
    return unit.value === 'celsius'
      ? '°C'
      : '°F'
  })


  // =====================================================
  // 3. action
  // celsius ↔ fahrenheit 단위 변경
  // =====================================================

  function toggleUnit() {
    unit.value =
      unit.value === 'celsius'
        ? 'fahrenheit'
        : 'celsius'
  }


  // =====================================================
  // 외부에서 사용할 값 반환
  // =====================================================

  return {
    unit,
    unitSymbol,
    toggleUnit,
  }
})