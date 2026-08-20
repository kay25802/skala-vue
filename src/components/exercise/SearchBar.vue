<script setup>
// =====================================================
// Props
// 부모 WeatherParent로부터 현재 검색어를 전달받음
// =====================================================

defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

// =====================================================
// Emits
// 검색어가 변경되면 부모에게 전달
// =====================================================

const emit = defineEmits(['update-query'])
</script>

<template>
  <div class="search-inner">

    <h3>🔍 도시 검색</h3>

    <input
      type="text"
      :value="currentQuery"
      @input="emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />

    <p>
      검색 중인 도시:
      <strong>{{ currentQuery || '없음' }}</strong>
    </p>

  </div>
</template>

<style scoped>
.search-inner input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
}

.search-inner p {
  margin-bottom: 0;
}
</style>