import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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

function App() {
  const auth = useSelector((state) => state.authReducer);
  const collectionArray = useSelector((state) => state.collectionReducer.collections);
  const dispatch = useDispatch();

  useEffect(() => {
    checkIfLoggedIn(dispatch);

    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length > 0) {
        console.log("account changed");
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
      console.log(`collection deployed: ${event.returnValues._addr}`);

      const artTokenContract = new web3.eth.Contract(
        artTokenContractABI.abi,
        event.returnValues._addr
      );

      let name = await artTokenContract.methods.name().call();
      let logoURL = await artTokenContract.methods.logoURI().call();

      const new_collection = {
        title: name,
        init_logo_uri: logoURL,
      };

      console.log("new collection", new_collection);

      Actions.addNewCollection(new_collection, dispatch);
    });

  }, []);

  const isAdminOrOwner = () => {
    return auth.accountType == ACCOUNT_TYPE.ADMIN ||
      auth.accountType == ACCOUNT_TYPE.OWNER
      ? true
      : false;
  };

  return (
    <Router>
      <div className="main">
        <Header />
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/about" render={() => <About />} />
          <Route exact path="/charity" render={() => <Charity />} />
          <Route exact path="/faq" render={() => <Faq />} />
          <Route exact path="/terms" render={() => <Terms />} />
          <Route
            exact
            path="/dashboard"
            render={() => (isAdminOrOwner() ? <Dashboard /> : <Home />)}
          />
          <Route
            exact
            path="/connect-wallet"
            render={() => <ConnectWallet />}
          />
          <Route exact path="/collection/:id" render={() => <Collection />} />
          <Route exact path="/create" render={() => <CreateItem />} />
          <Route
            exact
            path="/create-details"
            render={() => (isAdminOrOwner() ? <CreateDetails /> : <Home />)}
          />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
