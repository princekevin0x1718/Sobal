<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useI18n } from 'vue-i18n';
import useNetwork from '@/composables/useNetwork';
import useNotifications from '@/composables/useNotifications';
import useWeb3 from '@/services/web3/useWeb3';
import { configService } from '@/services/config/config.service';
import config from '@/lib/config';
import { Config } from '@/lib/config/types';
import { buildNetworkIconURL } from '@/lib/utils/urls';
import { hardRedirectTo } from '@/plugins/router/nav-guards';
import useBreakpoints from '@/composables/useBreakpoints';

export interface NetworkOption {
  id: string;
  name: string;
  networkSlug?: string;
  key?: string;
  testNetwork: boolean;
}

type Props = {
  hideLabel?: boolean;
  alignMenu?: string;
  noBg?: boolean;
  noPadding?: boolean;
  size?: number;
};

withDefaults(defineProps<Props>(), {
  alignMenu: 'right',
  hideLabel: false,
  noBg: false,
  noPadding: false,
  size: 22,
});

// COMPOSABLES
const { networkId, networkConfig } = useNetwork();
const { chainId } = useWeb3();
const router = useRouter();
const { addNotification } = useNotifications();
const { t } = useI18n();
const { isNarrowMobile } = useBreakpoints();

function convertConfigToNetworkOption(config: Config): NetworkOption {
  return {
    id: config.slug,
    name: config.chainName,
    networkSlug: config.slug,
    key: config.key,
    testNetwork: config.testNetwork,
  };
}

const prodNetworks: NetworkOption[] = Object.values(config)
  .filter(config => config.visibleInUI && !config.testNetwork)
  .map(convertConfigToNetworkOption);

const networks = ref(prodNetworks);

const testNetworks: NetworkOption[] = Object.values(config)
  .filter(config => config.visibleInUI && config.testNetwork)
  .map(convertConfigToNetworkOption);

const networksDev = ref(testNetworks);

const appNetworkSupported = computed((): boolean => {
  return networks.value
    .map(network => network.key)
    .includes(networkId.value.toString());
});

const activeNetwork = computed((): NetworkOption | undefined =>
  networks.value.find(network => {
    if (!appNetworkSupported.value && network.id === 'ethereum') return true;
    return isActive(network);
  })
);

// LIFECYCLE
onMounted(async () => {
  await router.isReady();
  if (router.currentRoute.value.query?.poolNetworkAlert) {
    addNotification({
      type: 'error',
      title: '',
      message: `${t('poolDoesntExist')} ${networkConfig.chainName}`,
    });
    router.replace({ name: 'home', query: {} });
  }
});

// WATCHERS
watch(chainId, (newChainId, oldChainId) => {
  if (
    newChainId &&
    oldChainId &&
    oldChainId !== newChainId &&
    networkId.value !== newChainId
  ) {
    const newNetwork = networks.value.find(n => Number(n.key) === newChainId);
    if (newNetwork) {
      localStorage.setItem('networkId', newChainId.toString());
      hardRedirectTo(getNetworkChangeUrl(newNetwork));
    }
  }
});

// METHODS
function getNetworkChangeUrl(network: NetworkOption): string {
  const routes = [
    'pool',
    'create-pool',
    'add-liquidity',
    'withdraw',
    'migrate-pool',
  ];
  if (routes.includes(router.currentRoute.value.name?.toString() ?? '')) {
    return `/#/${network.networkSlug}?poolNetworkAlert=true`;
  }

  const currentRoute = router.currentRoute.value;

  return router.resolve({
    name: currentRoute.name ?? 'home',
    params: { ...currentRoute.params, networkSlug: network.networkSlug },
    query: currentRoute.query,
  }).href;
}

function isActive(network: NetworkOption): boolean {
  if (!appNetworkSupported.value && network.id === 'ethereum') return true;
  return networkId.value.toString() === network.key;
}
</script>

<template>
  <BalPopover
    :noPad="!isNarrowMobile"
    :fullscreen="isNarrowMobile"
    :align="alignMenu"
  >
    <template #activator>
      <div class="flex flex-row place-items-center">
        <BalBtn
          :color="noBg ? 'transparent' : 'white'"
          :size="noPadding ? 'base-noPad' : 'md'"
          circle
        >
          <template v-if="activeNetwork">
            <img
              :src="buildNetworkIconURL(activeNetwork.id)"
              :alt="activeNetwork.name"
              :class="`rounded-full h-[${size}px] w-[${size}px]`"
            />
          </template>
        </BalBtn>
        <BalIcon name="chevron-down" size="sm" :color="noBg ? 'white' : ''" />
        <span v-if="!hideLabel && activeNetwork" class="hidden lg:block ml-1">
          {{ activeNetwork.name }}
        </span>
      </div>
    </template>
    <div
      role="menu"
      class="flex overflow-hidden flex-col rounded-lg"
      :class="[{ 'w-52': !isNarrowMobile }]"
    >
      <div
        class="py-2 px-3 text-sm font-medium text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-900"
      >
        {{ $t('networkSelection') }}:
      </div>
      <a
        v-for="network in networks"
        :key="network.id"
        :href="getNetworkChangeUrl(network)"
        class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
      >
        <div class="flex items-center">
          <img
            :src="buildNetworkIconURL(network.id)"
            :alt="network.name"
            class="mr-2 w-6 h-6 rounded-full"
          />
          <span class="ml-1 font-medium">
            {{ network.name }}
          </span>
        </div>
        <BalIcon
          v-if="isActive(network)"
          name="check"
          class="text-blue-500 dark:text-blue-400"
        />
      </a>
      <template
        v-if="
          configService.env.APP_ENV === 'development' ||
          configService.env.APP_ENV === 'staging'
        "
      >
        <div
          class="py-2 px-3 text-sm font-medium text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-900"
        >
          {{ $t('testnets') }}:
        </div>
        <a
          v-for="network in networksDev"
          :key="network.id"
          :href="getNetworkChangeUrl(network)"
          class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
        >
          <div class="flex items-center">
            <img
              :src="buildNetworkIconURL(network.id)"
              :alt="network.name"
              class="mr-2 w-6 h-6 rounded-full"
            />
            <span class="ml-1 font-medium">
              {{ network.name }}
            </span>
          </div>
          <BalIcon
            v-if="isActive(network)"
            name="check"
            class="text-blue-500 dark:text-blue-400"
          />
        </a>
      </template>
    </div>
  </BalPopover>
</template>
