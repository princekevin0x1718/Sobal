<script lang="ts" setup>
import useNetwork from '@/composables/useNetwork';
import { buildNetworkIconURL } from '@/lib/utils/urls';
import { configService } from '@/services/config/config.service';
import { computed } from 'vue';

const { networkId } = useNetwork();

const bridgeUrl = computed((): string => {
  return configService.network.bridgeUrl;
});

const label = computed((): string => {
  return `Bridge assets to ${configService.network.chainName} via ${bridgeUrl.value}`;
});
</script>

<template>
  <BalLink
    :href="bridgeUrl"
    external
    noStyle
    class="flex items-center p-4 text-sm dark:bg-gray-850 rounded-lg border dark:border-0"
  >
    <img
      :src="buildNetworkIconURL(networkId)"
      :alt="label"
      class="mr-4 w-6 h-6"
    />
    {{ label }}
    <BalIcon
      name="arrow-up-right"
      size="sm"
      class="ml-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    />
  </BalLink>
</template>
