import { Pools } from '@/types/pools';

export const poolIdThatRequiresInternalBalanceExit =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const boostedPoolId =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const poolIdWithTwoBoostedProtocols =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const reaperBoostedPoolId =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const tetuBoostedPoolId =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const idleBoostedPoolId =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const pools: Pools = {
  IdsMap: {},
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: true,
  DelegateOwner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [''],
  IncludedPoolTypes: [
    'Weighted',
    'Stable',
    'MetaStable',
    'LiquidityBootstrapping',
    'Investment',
    'StablePhantom',
    'ComposableStable',
    'FX',
    'EulerLinear',
    'Gyro2',
    'Gyro3',
    'GyroE',
  ],
  Stable: {
    AllowList: [
      '0x57e2b9fcec1d6f16b660934a604f1a5345709df9000000000000000000000004',
    ],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [],
  },
  Factories: {
    // lowercase!!!!
    '0x8d88057b8cc9235d4c69db3c14fd8d4229a6ae35': 'weightedPool', // weighted pool v4
    '0x08e3814ad06be2a555a4c0d330a20078e5344dfd': 'managedPool', // managed pool v2
    '0x60ef61c5c0f4213c7b2c02f64a575dc4bfdbf302': 'composableStablePool', // composable stable v5
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {},
  Deep: [],
  BoostedApr: [],
  DisabledJoins: [],
  NewVersionAvailable: {},
  Deprecated: {},
  GaugeMigration: {},
  BrandedRedirect: {},
  ExitViaInternalBalance: [],
  Issues: {},
};

export default pools;
