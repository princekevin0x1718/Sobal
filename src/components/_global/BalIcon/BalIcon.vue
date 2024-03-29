<script lang="ts" setup>
/**
 * TYPES
 */
export type IconSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  name: string;
  size?: IconSize;
  filled?: boolean;
  color?: string;
  spin?: boolean;
  bounce?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  filled: false,
});

/**
 * COMPUTED
 */
const iconSize = computed(() => {
  switch (props.size) {
    case 'xxs':
      return '8';
    case 'xs':
      return '12';
    case 'sm':
      return '16';
    case 'lg':
      return '24';
    case 'xl':
      return '28';
    default:
      return '20';
  }
});

const fill = computed(() => (props.filled ? 'currentColor' : 'none'));

const spinClass = computed(() => (props.spin ? 'animate-spin' : ''));
const bounceClass = computed(() => (props.bounce ? 'animate-bounce' : ''));

/**
 * LIFECYCLE
 */
onMounted(async () => {
  const feather = await import('feather-icons');
  feather.replace();
});
</script>

<template>
  <div class="inline-block bal-icon" :class="[spinClass, bounceClass]">
    <i
      :data-feather="name"
      :width="iconSize"
      :height="iconSize"
      :fill="fill"
      :color="color"
    />
  </div>
</template>
