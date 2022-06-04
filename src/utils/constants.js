export const REACT_APP_API_URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEVELOPMENT_API_URL : process.env.REACT_APP_PRODUTION_API_URL;

export const CHAIN = process.env.NODE_ENV === 'development' ? 
                    {chain_id: "0x4", chain_name: "Rinkeby Test Network",  rpc_urls: "https://rinkeby.infura.io/v3/"}
                    : {chain_id: "0x1", chain_name: "Ethereum Mainnet",  rpc_urls: "https://mainnet.infura.io/v3/"};

export const ACCOUNT_TYPE = {
    OWNER: "account_owner",
    ADMIN: "account_admin",
    NORMAL: "account_normal" 
}