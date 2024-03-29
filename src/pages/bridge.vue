<script setup lang="ts">
import { onMounted } from 'vue';
import BridgeCard from '@/components/bridge/BridgeCard.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import BridgeLinkExternal from '@/components/links/BridgeLinkExternal.vue';
import { hasBridge } from '@/composables/useNetwork';
import { provideUserTokens } from '@/providers/local/user-tokens.provider';
import Col3Layout from '@/components/layouts/Col3Layout.vue';
import useNetwork from '@/composables/useNetwork';
import { configService } from '@/services/config/config.service';

import neonPassLogo from '@/assets/images/landing/thirdPartyLogos/neonpass_logo_text.svg';

const bridgeUi = computed(() => configService.network.bridgeUi);

/**
 * PROVIDERS
 */
provideUserTokens();

/**
 * COMPOSABLES
 */
const { setSelectedTokens } = usePoolFilters();
const { networkConfig } = useNetwork();

/**
 * CALLBACKS
 */
onMounted(() => {
  // selectedPoolTokens are only persisted between the Home/Pool pages
  setSelectedTokens([]);
});
</script>

<template>
  <div v-if="bridgeUi">
    <div class="flex flex-col justify-between">
      <h1 class="mt-5 xl:mt-0 font-light text-center xl:text-left">
        {{ $t('bridgeOn') }}
        <span class="font-medium">{{ networkConfig.chainName }}</span>
      </h1>
    </div>
    <Col3Layout class="py-36">
      <BridgeCard />
      <div class="flex flex-col">
        <p class="self-center mt-5 text-center">
          {{ $t('bridgeCard.neonpass') }}
        </p>
        <img class="self-center mt-2" width="150" :src="neonPassLogo" />
      </div>
      <div class="mt-10 bg-green-600 bg-opacity-5 rounded-xl">
        <p class="p-5 text-sm font-medium text-center text-green-700">
          {{ $t('bridgeCard.poweredBy') }}
        </p>
      </div></Col3Layout
    >
  </div>
  <div v-else-if="hasBridge">
    <BalAlert
      block
      type="warning"
      :title="$t('bridgeCard.warnings.notSupported')"
    />
    <BridgeLinkExternal />
  </div>
  <div v-else>
    <BalAlert block type="error" :title="$t('bridgeCard.warnings.noService')" />
  </div>
</template>

<style scoped>
.graph-modal {
  height: 450px;
}
</style>
