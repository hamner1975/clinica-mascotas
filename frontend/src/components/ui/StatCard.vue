<template>
  <div class="card stat-card h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start gap-2">
        <div>
          <p class="stat-card__label">{{ label }}</p>
          <h3 class="stat-card__value">{{ value }}</h3>
        </div>
        <span class="stat-card__icon" :class="`stat-card__icon--${variant}`">
          <i :class="['bi', icon]"></i>
        </span>
      </div>

      <p v-if="trend !== null" class="stat-card__trend mb-0" :class="trendClass">
        <i :class="['bi', trend >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right']"></i>
        {{ Math.abs(trend) }}%
        <span class="text-muted fw-normal">vs. mes anterior</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'bi-activity' },
  variant: { type: String, default: 'primary' }, // primary | info | success | warning | danger
  trend: { type: Number, default: null },
})

const trendClass = computed(() => (props.trend >= 0 ? 'text-success' : 'text-danger'))
</script>
