<script setup lang="ts">
import { format, fromUnixTime } from 'date-fns';
import { Dictionary, mapKeys, mapValues, pickBy, toPairs } from 'lodash';
import { useI18n } from 'vue-i18n';
import { useQuery } from '@tanstack/vue-query';

import { useSwapState } from '@/composables/swap/useSwapState';
import useBreakpoints from '@/composables/useBreakpoints';
import useTailwind from '@/composables/useTailwind';
import { useTokens } from '@/providers/tokens.provider';
import QUERY_KEYS from '@/constants/queryKeys';
import { coingeckoService } from '@/services/coingecko/coingecko.service';
import useWeb3 from '@/services/web3/useWeb3';

/**
 *
 * @param inputAsset The address of the input asset
 * @param outputAsset The address of the output asset
 * @param nativeAsset The address of the native asset on the network
 * @param wrappedNativeAsset The address of the wrapped native asset on the network
 * @param days The number of days to pull historical data for
 * @param inverse Swaps the pricing calc to be output/input rather than input/output
 */
async function getPairPriceData(
  inputAsset: string,
  outputAsset: string,
  nativeAsset: string,
  wrappedNativeAsset: string,
  days: number,
  inverse?: boolean
) {
  let _inputAsset =
    inputAsset === nativeAsset ? wrappedNativeAsset : inputAsset;
  let _outputAsset =
    outputAsset === nativeAsset ? wrappedNativeAsset : outputAsset;

  if (inverse) {
    [_inputAsset, _outputAsset] = [_outputAsset, _inputAsset];
  }

  /**
   * @description
   * due to coingecko docs if we query from 1 to 90 days from current time it returns hourly data
   * @see https://www.coingecko.com/en/api/documentation
   */
  const aggregateBy = days <= 90 ? 'hour' : 'day';
  const getInputAssetData = coingeckoService.prices.getTokensHistorical(
    [_inputAsset],
    days,
    1,
    aggregateBy
  );

  const getOutputAssetData = coingeckoService.prices.getTokensHistorical(
    [_outputAsset],
    days,
    1,
    aggregateBy
  );

  const [inputAssetData, outputAssetData] = await Promise.all([
    getInputAssetData,
    getOutputAssetData,
  ]);

  const calculatedPricing = mapValues(inputAssetData, (value, timestamp) => {
    if (!outputAssetData[timestamp]) return null;
    return (1 / value[0]) * outputAssetData[timestamp][0];
  });

  const calculatedPricingNoNulls = pickBy(
    calculatedPricing
  ) as Dictionary<number>;

  const formatTimestamps = mapKeys(
    calculatedPricingNoNulls,
    (_, timestamp: any) =>
      format(fromUnixTime(timestamp / 1000), 'yyyy/MM/dd HH:mm')
  );

  return toPairs(formatTimestamps);
}

const chartTimespans = [
  {
    option: '1d',
    fulltext: 'day',
    value: 1,
  },
  {
    option: '1w',
    fulltext: 'week',
    value: 7,
  },
  {
    option: '1m',
    fulltext: 'month',
    value: 30,
  },
  {
    option: '1y',
    fulltext: '1 day',
    value: 365,
  },
  {
    option: 'All',
    fulltext: '&infin;',
    value: 4000,
  },
];

type Props = {
  landing?: boolean;
  chain?: string;
  height?: string;
  hideTooltip?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  landing: false,
  chain: '',
  height: '120',
  hideTooltip: false,
});

const { upToLargeBreakpoint } = useBreakpoints();
const { t } = useI18n();
const { getToken, wrappedNativeAsset, nativeAsset } = useTokens();
const { tokenInAddress, tokenOutAddress, initialized } = useSwapState();
const tailwind = useTailwind();
const { chainId: userNetworkId, appNetworkConfig } = useWeb3();

const chartHeight = ref(Number(props.height));
const activeTimespan = ref(chartTimespans[1]);

const inputSym = computed(() => {
  if (tokenInAddress.value === '') return 'Unknown';
  return getToken(tokenInAddress.value)?.symbol;
});
const outputSym = computed(() => {
  if (tokenOutAddress.value === '') return 'Unknown';
  return getToken(tokenOutAddress.value)?.symbol;
});

const {
  isLoading: isLoadingPriceData,
  data: priceData,
  error: failedToLoadPriceData,
} = useQuery(
  QUERY_KEYS.Tokens.PairPriceData(
    tokenInAddress,
    tokenOutAddress,
    activeTimespan,
    userNetworkId,
    nativeAsset,
    wrappedNativeAsset
  ),
  () =>
    getPairPriceData(
      tokenInAddress.value,
      tokenOutAddress.value,
      nativeAsset?.address,
      wrappedNativeAsset.value?.address,
      activeTimespan.value.value,
      true
    ),
  reactive({
    enabled: initialized,
    retry: false,
    // when refetch on window focus in enabled, it causes a flash
    // in the loading state of the card which is jarring. disabling it
    refetchOnWindowFocus: false,
  })
);

const equivalentTokenPairs = [
  [
    appNetworkConfig.tokens.Addresses.wNativeAsset,
    appNetworkConfig.tokens.Addresses.nativeAsset,
  ],
];

const allChartValuesEqual = computed(() =>
  equivalentTokenPairs.some(
    pair =>
      pair.includes(tokenInAddress.value) &&
      pair.includes(tokenOutAddress.value)
  )
);

const chartData = computed(() => {
  if (allChartValuesEqual.value) return [];
  return [
    {
      name: `${outputSym.value}/${inputSym.value}`,
      values: priceData.value || [],
    },
  ];
});

const chartBlankText = computed(() => {
  if (allChartValuesEqual.value) {
    return `${inputSym.value} -> ${outputSym.value} is 1:1`;
  }
  return t('noData');
});

const isNegativeTrend = computed(() => {
  const _priceData = priceData.value || [];
  if (_priceData.length > 2) {
    if (_priceData[_priceData.length - 1][1] < _priceData[0][1]) {
      return true;
    }
  }
  return false;
});

const chartColors = computed(() => {
  let color = tailwind.theme.colors.lime['400'];
  if (isNegativeTrend.value) color = tailwind.theme.colors.red['400'];
  return [color];
});

const chartGrid = computed(() => {
  return {
    left: '2.5%',
    right: '0',
    top: '10%',
    bottom: '15%',
    containLabel: false,
  };
});
</script>

<template>
  <div>
    <BalLoadingBlock v-if="isLoadingPriceData" class="h-40" />
    <BalCard
      v-else
      :square="upToLargeBreakpoint"
      shadow="none"
      hFull
      growContent
      noPad
      :background="false"
      :noBorder="upToLargeBreakpoint"
    >
      <div class="relative p-4 lg:p-0 h-full bg-transparent">
        <div
          v-if="failedToLoadPriceData && tokenOutAddress"
          class="flex justify-center items-center w-full h-40"
        >
          <span class="text-sm text-gray-400">{{
            $t('insufficientData')
          }}</span>
        </div>
        <div
          v-if="failedToLoadPriceData && !tokenOutAddress"
          class="flex justify-center items-center w-full h-full"
        >
          <span class="text-sm text-center text-gray-400">{{
            $t('chooseAPair')
          }}</span>
        </div>
        <div
          v-if="!failedToLoadPriceData && !isLoadingPriceData"
          class="flex-col"
        >
          <BalBlankSlate v-if="chartData.length === 0" class="mt-4 h-40">
            <BalIcon name="bar-chart" />
            {{ chartBlankText }}
          </BalBlankSlate>
          <template v-else>
            <BalChart
              :data="chartData"
              :height="chartHeight"
              :showLegend="false"
              :color="chartColors"
              :customGrid="chartGrid"
              :axisLabelFormatter="{
                yAxis: { maximumSignificantDigits: 6, fixedFormat: true },
              }"
              wrapperClass="flex flex-row lg:flex-col flex-row"
              :showTooltip="!upToLargeBreakpoint && !landing"
              chartType="line"
              hideYAxis
              hideXAxis
              showHeader
              useMinMax
              :inputSym="inputSym"
              :outputSym="outputSym"
              :timespan="activeTimespan.fulltext"
              :landing="landing"
            />
            <div class="-mt-2 lg:mt-2">
              <span
                class="flex justify-end w-full text-sm text-gray-500"
                :class="{ 'pr-4': landing }"
                >{{ activeTimespan.option }}
                <BalTooltip
                  v-if="!hideTooltip"
                  class="ml-2"
                  :text="$t('coingeckoPricingTooltip')"
                >
                  <template #activator>
                    <img
                      class="h-5"
                      src="@/assets/images/icons/coingecko.svg"
                    />
                  </template>
                </BalTooltip>
              </span>
            </div>
          </template>
        </div>
      </div>
    </BalCard>
  </div>
</template>

<style scoped>
.maximise {
  @apply absolute;

  right: 0;
  top: 0;
}
</style>
