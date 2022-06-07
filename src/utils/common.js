export const getChainId = () => {
  if (process.env.NODE_ENV === "development") {
    return {
      chain_id: "0x4",
      chain_name: "Rinkeby Test Network",
      rpc_urls: "https://rinkeby.infura.io/v3/",
    };
  } else {
    return {
      chain_id: "0x4",
      chain_name: "Rinkeby Test Network",
      rpc_urls: "https://rinkeby.infura.io/v3/",
    };
  }
};
