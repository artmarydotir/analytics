<template>
  <div>
    {{ value }}
  </div>
</template>

<script>
export default {
  props: {
    /**
     * type : 'to' | 'ye' | 'l7d' | 'l28d' | 'l90d'
     * range: [start, current] unix timestamp
     * country: not implemented, add later
     */
    value: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
