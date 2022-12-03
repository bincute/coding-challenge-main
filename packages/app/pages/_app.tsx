import React, { Children } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { defaultTheme } from "@cosmology/react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { chain, assets, asset_list } from "@chain-registry/osmosis";
import { Asset } from "@chain-registry/types";
import ListPools from "../components/pools-list";

interface PoolsData {
  id: string;
  token1: { name: string; imgSrc: string };
  token2: { name: string; imgSrc: string };
  poolLiquidity: number;
  apr: number;
  myLiquidity: number;
  myBoundedAmount: number;
  longestDaysUnbonding: boolean;
}

interface AssetFun {
  (asset: Asset): void;
}

// interface poolFun {
//   (asset1: Asset, asset2: Asset): void;
// }

interface poolFun {
  (asset1: Asset, asset2: Asset): void;
}

const initAssets = asset_list.assets.slice(0, 8);

// .map(({ name, logo_URIs }) => ({
//   name: name,
//   imgSrc: logo_URIs.png,
// })).slice(0, 4)

const allTokens = asset_list.assets.map(({ name, logo_URIs }) => ({
  name: name,
  imgSrc: logo_URIs.png,
}));

const generateLiquidity = (amount) => {
  const getShuffledArr = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
    return arr;
  };
  const getRandomPoolLiquidity = [...Array(amount)].fill(undefined).map((_) => {
    return parseInt(
      getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        .toString()
        .replaceAll(",", "")
    );
  });

  const getRandomMyLiquidity = [...Array(amount)].fill(undefined).map((_) => {
    return parseInt(
      getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        .toString()
        .slice(0, 5)
        .replaceAll(",", "")
    );
  });
  const getRandomAPR = [...Array(amount)].fill(undefined).map((_) => {
    return (
      parseInt(
        getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
          .toString()
          .slice(0, 7)
          .replaceAll(",", "")
      ) / 100
    );
  });

  return { getRandomAPR, getRandomPoolLiquidity, getRandomMyLiquidity };
};

const getPoolsData = (assets, amount = 4, getAll = false) => {
  const getShuffledArr = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
    return arr;
  };
  const allTokens = assets.map(({ name, logo_URIs }) => ({
    name: name,
    imgSrc: logo_URIs.png,
  }));
  const ALL_TOAKENS_AMOUNT = allTokens.length;
  if (getAll) {
    amount = ALL_TOAKENS_AMOUNT;
  }
  const poolOptionToken1 = getShuffledArr([...allTokens]);
  const poolOptionToken2 = getShuffledArr([...allTokens]).filter(
    (v, i) => v !== poolOptionToken1[i]
  );
  const getRandomId = getShuffledArr(
    [...Array(500)].map((v, i) => (v = i + 1))
  ).slice(0, amount);
  const { getRandomAPR, getRandomPoolLiquidity, getRandomMyLiquidity } =
    generateLiquidity(amount);
  const getDefaultData = [...Array(amount)].fill(undefined).map((_, i) => ({
    id: getRandomId[i],
    token1: poolOptionToken1[i],
    token2: poolOptionToken2[i],
    poolLiquidity: getRandomPoolLiquidity[i],
    apr: getRandomAPR[i],
    myLiquidity: getRandomMyLiquidity[i],
    myBoundedAmount: getRandomMyLiquidity[i],
    longestDaysUnbonding: Math.random() < 0.5,
  }));
  return getDefaultData;
};

const getDefaultPoolsData = () => {
  return getPoolsData(initAssets, 4);
};

const generateAllPoolsData = () => {
  return getPoolsData(initAssets, 4, true);
};

const assetStoreContext = React.createContext<{
  assets: Asset[];
  waitAddingAssets: Asset[];
  addAsset?: AssetFun;
  updateAsset?: AssetFun;
  removeAsset?: AssetFun;
}>({ assets: [], waitAddingAssets: [] });

const poolStoreContext = React.createContext<{
  allListPools?: PoolsData[];
  listPools: PoolsData[];

  addPool?: poolFun;
  updatePool?: AssetFun;
}>({ listPools: [] });

/**
 * Explanation: The data is all come from asset_list and fake liquidity data.
 * The asset_list is divided into 2 parts, assets which could be added into pools and
 * waitAddingAssets which could be added into assets.
 */
const AssetStoreProvider = ({ children }) => {
  const store = useLocalStore(() => {
    const allListPools = generateAllPoolsData();
    return {
      assets: initAssets,
      waitAddingAssets: asset_list.assets.filter((item) =>
        initAssets.every((i) => i.name !== item.name)
      ),
      addAsset: (asset) => {
        store.assets.push(asset);
        const index = store.waitAddingAssets.findIndex(
          (a) => a.name === asset.name
        );
        store.waitAddingAssets.splice(index, 1);
      },
      updateAsset: (asset) => {
        const index = store.assets.findIndex(
          (item) => asset.name === item.name
        );
        const updateIndex = Math.floor(
          asset_list.assets.length * Math.random()
        );
        // borrow other asset's info
        store.assets[index].base = asset_list.assets[updateIndex].base;
        store.assets[index].denom_units =
          asset_list.assets[updateIndex].denom_units;
        store.assets[index].symbol = asset_list.assets[updateIndex].symbol;
      },
      removeAsset: (asset) => {
        const index = store.assets.findIndex(
          (item) => asset.name === item.name
        );
        store.assets.splice(index, 1);
        store.waitAddingAssets.push(asset);
      },
    };
  });

  return (
    <assetStoreContext.Provider value={store}>
      {children}
    </assetStoreContext.Provider>
  );
};

const PoolStoreProvider = ({ children }) => {
  const store = useLocalStore(() => {
    const allListPools = generateAllPoolsData();
    return {
      // allListPools,
      listPools: allListPools.slice(0, 4),
      // asset1 and asset2 are initial 2 assests
      addPool: (asset1, asset2) => {
        const newPools = getPoolsData([asset1, asset2], 1);
        store.listPools.push(...newPools);
      },
      updateLiquidity: (index) => {
        const { getRandomAPR, getRandomPoolLiquidity, getRandomMyLiquidity } =
          generateLiquidity(1);
        store.listPools[index].poolLiquidity = getRandomPoolLiquidity[0];
        store.listPools[index].apr = getRandomAPR[0];
        store.listPools[index].myLiquidity = getRandomMyLiquidity[0];
        store.listPools[index].myBoundedAmount = getRandomMyLiquidity[0];
      },

      updatePool: (removedAsset) => {
        const name = removedAsset.name;
        store.listPools.map((pool, index) => {
          let hasRemvedAsset = false;
          if (pool.token1 && pool.token1.name === name) {
            pool.token1 = null;
            hasRemvedAsset = true;
          }
          if (pool.token2 && pool.token2.name === name) {
            pool.token2 = null;
            hasRemvedAsset = true;
          }
          if (!pool.token1 && !pool.token2) {
            store.listPools.splice(index, 1);
          } else if (!pool.token1 || !pool.token2) {
            store.updateLiquidity(index);
          }
          return pool;
        });
      },
    };
  });

  return (
    <poolStoreContext.Provider value={store}>
      {children}
    </poolStoreContext.Provider>
  );
};

function CosmologyApp({ Component, pageProps }) {
  return (
    <AssetStoreProvider>
      <PoolStoreProvider>
        <ChakraProvider theme={defaultTheme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </PoolStoreProvider>
    </AssetStoreProvider>
  );
}

export default CosmologyApp;

export { assetStoreContext, poolStoreContext };
