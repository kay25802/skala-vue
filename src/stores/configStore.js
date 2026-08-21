import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {

  // =====================================================
  // state
  // =====================================================

  const unit = ref('celsius')

  const language = ref('ko')


  // =====================================================
  // getters
  // =====================================================

  const unitSymbol = computed(() => {
    return unit.value === 'celsius'
      ? '°C'
      : '°F'
  })

  const languageLabel = computed(() => {
    return language.value === 'ko'
      ? '한국어'
      : 'English'
  })


  // =====================================================
  // actions
  // =====================================================

  function toggleUnit() {
    unit.value =
      unit.value === 'celsius'
        ? 'fahrenheit'
        : 'celsius'
  }

  function toggleLanguage() {
    language.value =
      language.value === 'ko'
        ? 'en'
        : 'ko'
  }


  return {
    unit,
    language,

    unitSymbol,
    languageLabel,

    toggleUnit,
    toggleLanguage,
  }
})