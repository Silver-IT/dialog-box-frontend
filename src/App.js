import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./store/actions";
import "./styles/app.sass";
import Home from "./screens/Home";
import Collection from "./screens/Collection";
import About from "./screens/About";
import Charity from "./screens/Charity";
import Faq from "./screens/Faq";
import Terms from "./screens/Terms";
import CreateItem from "./screens/CreateItem";
import CreateDetails from "./screens/CreateDetails";
import ConnectWallet from "./screens/ConnectWallet";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./screens/Dashboard";
import {
  connectMetaMask,
  checkAccountType,
  checkIfLoggedIn,
} from "./utils/connectMetaMask.js";
import { ACCOUNT_TYPE } from "./utils/constants";
import Web3 from "web3";
import artTokenContractABI from "./config/abis/artToken.json";
import artTokenManagerContractABI from "./config/abis/artTokenManager.json";
import { getChainId } from "./utils/common";
import NotFound from "./screens/NotFound"

function App() {
  const auth = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
  
    checkIfLoggedIn(dispatch);

    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length > 0) {
        const address = accounts[0];
        checkAccountType(address, dispatch);
      } else {
        checkAccountType(null, dispatch);
      }
    });

    window.ethereum.on("chainChanged", (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      window.location.reload();
    });

    const web3 = new Web3(Web3.givenProvider);
    const tokenManagerContract = new web3.eth.Contract(
      artTokenManagerContractABI.abi,
      process.env.REACT_APP_TOKENMANAGER_CONTRACT_ADDRESS
    );

    //set event listener to collection deployment.
    tokenManagerContract.events.CollectionAdded().on("data", async (event) => {

      const artTokenContract = new web3.eth.Contract(
        artTokenContractABI.abi,
        event.returnValues._addr
      );

      let name = await artTokenContract.methods.name().call();
      let symbol = await artTokenContract.methods.symbol().call();
      let logoURL = await artTokenContract.methods.logoURI().call();
      let mintPrice = await artTokenContract.methods.MINT_PRICE().call();
      let maxSupply = await artTokenContract.methods.MAX_SUPPLY().call();
      let baseURI = await artTokenContract.methods.baseURI().call();
      let owner = await artTokenContract.methods.owner().call();

      const new_collection = {
        title: name,
        symbol: symbol,
        logo_uri: logoURL,
        base_uri: baseURI,
        mint_price: mintPrice,
        max_supply: maxSupply,
        address: event.returnValues._addr,
        owner: owner
      };

      Actions.addNewCollection(new_collection, dispatch);
    });
  }, []);

  const isAdminOrOwner = () => {

    if (auth.accountType == ACCOUNT_TYPE.ADMIN || auth.accountType == ACCOUNT_TYPE.OWNER){
      return true;
    }else{
      return false;
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAdminOrOwner()) {
      return <Navigate to="/" replace />;
    } else {
      return children;
    }
  };

  return (
    <Router>
      <div className="main">
      
        <Header/>  
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/charity" element={<Charity />} />
          <Route exact path="/faq" element={<Faq />} />
          <Route exact path="/terms" element={<Terms />} />
          <Route
            exact
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route exact path="/connect-wallet" element={<ConnectWallet />} />
          <Route exact path="/collection/:id" element={<Collection />} />
          <Route exact path="/create" element={<CreateItem />} />
          <Route
            exact
            path="/create-details"
            element={
              <ProtectedRoute>
                <CreateDetails />
              </ProtectedRoute>
            }
          />
          <Route exact path="/404" element={<NotFound/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
