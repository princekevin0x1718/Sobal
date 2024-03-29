<template>
  <div
    ref="animateRef"
    :class="[
      `flex items-center py-3 border border-transparent ml-4 mr-2 px-2 text-base
  leading-5 opacity-0 highlight hover:bg-blue-50 dark:hover:bg-blue-900
  rounded-lg transition-colors ease-in duration-300`,
      {
        'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-500':
          focussed,
      },
    ]"
  >
    <BalAsset
      :address="token.address"
      :iconURI="token.logoURI"
      :size="34"
      class="mr-3"
    />
    <div
      :class="['flex-auto', { 'text-blue-500 dark:text-blue-200': focussed }]"
    >
      {{ token.symbol }}
      <div class="w-40 md:w-56 text-sm truncate text-gray">
        {{ token.name }}
      </div>
    </div>
    <span
      v-if="!hideBalance"
      class="flex flex-row items-end font-medium text-right"
    >
      <div class="flex flex-row">
        <template v-if="solanaBalance > 0">
          <div class="flex flex-col pr-2">
            <span class="text-xs font-semibold">{{ $t('solana') }}</span>
            <template v-if="solanaBalance >= 0.0001">
              {{ fNum(solanaBalance, FNumFormats.token) }}
            </template>
            <template v-else> &#60; 0.0001 </template>
            <div
              v-if="solanaValue > 0"
              class="text-sm font-normal text-secondary"
            >
              {{ fNum(solanaValue, FNumFormats.fiat) }}
            </div>
          </div>
        </template>
        <template v-if="balance > 0">
          <div class="flex flex-col">
            <span v-if="solana" class="text-xs font-semibold truncate">{{
              network.chainName
            }}</span>
            <template v-if="balance >= 0.0001">
              {{ fNum(balance, FNumFormats.token) }}
            </template>
            <template v-else> &#60; 0.0001 </template>
            <div v-if="value > 0" class="text-sm font-normal text-secondary">
              {{ fNum(value, FNumFormats.fiat) }}
            </div>
          </div>
        </template>
        <BalLoadingBlock v-if="balanceLoading" class="w-14 h-4" />
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import anime from 'animejs';
import { computed, onMounted, onUnmounted, PropType, ref } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { TokenInfo } from '@/types/TokenList';
import { configService } from '@/services/config/config.service';

export default {
  name: 'TokenListItem',

  props: {
    token: { type: Object as PropType<TokenInfo>, required: true },
    balanceLoading: { type: Boolean, default: true },
    hideBalance: { type: Boolean, default: false },
    focussed: { type: Boolean, default: false },
    solana: { type: Boolean, default: false },
  },

  setup(props) {
    /**
     * COMPOSABLES
     */
    const { fNum } = useNumbers();
    const animateRef = ref();

    /**
     * COMPUTED
     */
    const balance = computed(() => Number(props.token.balance));
    const solanaBalance = computed(() =>
      props.token.address_spl ? Number(props.token.solanaBalance) : 0
    );
    const value = computed(() => balance.value * (props.token.price || 0));
    const solanaValue = computed(
      () => solanaBalance.value * (props.token.price || 0)
    );
    const { network } = configService;

    /**
     * CALLBACKS
     */
    onMounted(() => {
      anime({
        opacity: 1,
        targets: animateRef.value,
        delay: anime.stagger(100),
      });
    });

    onUnmounted(() => {
      anime({
        opacity: 0,
        targets: animateRef.value,
      });
    });

    return {
      fNum,
      FNumFormats,
      animateRef,
      balance,
      solanaBalance,
      value,
      solanaValue,
      network,
    };
  },
};
</script>
