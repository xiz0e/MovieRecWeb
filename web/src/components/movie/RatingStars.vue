<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  rating: number
  maxRating?: number
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:rating', value: number): void
}>()

const maxRating = props.maxRating || 5
const hoverRating = ref(0)

const fullStars = computed(() => {
  if (props.readonly) {
    return Math.floor(props.rating)
  }
  return hoverRating.value > 0 ? Math.floor(hoverRating.value) : Math.floor(props.rating)
})

const hasHalfStar = computed(() => {
  if (props.readonly) {
    return props.rating % 1 >= 0.5
  }
  return hoverRating.value > 0 
    ? hoverRating.value % 1 >= 0.5 
    : props.rating % 1 >= 0.5
})

const emptyStars = computed(() => {
  const total = fullStars.value + (hasHalfStar.value ? 1 : 0)
  return maxRating - total
})

const starArray = computed(() => {
  return [
    ...Array(fullStars.value).fill('full'),
    ...(hasHalfStar.value ? ['half'] : []),
    ...Array(emptyStars.value).fill('empty')
  ]
})

const handleMouseMove = (event: MouseEvent, index: number) => {
  if (props.readonly) return
  
  const starElement = event.currentTarget as HTMLElement
  const rect = starElement.getBoundingClientRect()
  const width = rect.width
  const x = event.clientX - rect.left
  
  // If mouse is on the left half of the star, it's a half star
  const isHalfStar = x < width / 2
  
  hoverRating.value = index + (isHalfStar ? 0.5 : 1)
}

const handleMouseLeave = () => {
  if (props.readonly) return
  hoverRating.value = 0
}

const setRating = (index: number, event: MouseEvent) => {
  if (props.readonly) return
  
  const starElement = event.currentTarget as HTMLElement
  const rect = starElement.getBoundingClientRect()
  const width = rect.width
  const x = event.clientX - rect.left
  
  // If click is on the left half of the star, it's a half star
  const isHalfStar = x < width / 2
  
  const newRating = index + (isHalfStar ? 0.5 : 1)
  emit('update:rating', newRating)
}
</script>

<template>
  <div 
    class="rating-stars" 
    :class="{ 'interactive': !readonly }"
    @mouseleave="handleMouseLeave"
  >
    <div 
      v-for="(type, index) in starArray" 
      :key="index"
      class="star-container"
      @mousemove="handleMouseMove($event, index)"
      @click="setRating(index, $event)"
    >
      <svg 
        viewBox="0 0 24 24"
        class="star"
        :class="type"
      >
        <path v-if="type === 'full'" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        <path v-else-if="type === 'half'" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2v15.27z" />
        <path v-else d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.rating-stars {
  display: flex;
  align-items: center;
}

.star-container {
  padding: 2px;
  cursor: default;
}

.interactive .star-container {
  cursor: pointer;
}

.star {
  width: 20px;
  height: 20px;
  fill: #ccc;
  transition: transform 0.2s;
}

.interactive .star-container:hover .star {
  transform: scale(1.2);
}

.star.full, .star.half {
  fill: var(--color-primary);
}

@media (max-width: 768px) {
  .star {
    width: 18px;
    height: 18px;
  }
}
</style>