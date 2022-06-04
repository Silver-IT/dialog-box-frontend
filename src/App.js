import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./store/actions";
import "./styles/app.sass";
import Home from "./screens/Home";
import Collection from "./screens/Collection";
import About from "./screens/About";
import Charity from "./screens/Charity";
import CreateItem from "./screens/CreateItem";
import CreateDetails from "./screens/CreateDetails";
import ConnectWallet from "./screens/ConnectWallet";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./screens/Dashboard";
import {connectMetaMask, checkAccountType} from "./utils/connectMetaMask.js"
import {ACCOUNT_TYPE} from "./utils/constants"

function App() {

  const auth = useSelector(state => state.authReducer.data);
  const dispatch = useDispatch();
  
  useEffect(() => {

    connectMetaMask(dispatch);

    window.ethereum.on('accountsChanged', function (accounts) {
      if (accounts.length > 0) {
        console.log("account changed");
        const address = accounts[0];
        checkAccountType(address, dispatch);
      }else{
        checkAccountType(null, dispatch);
      }
    })

    window.ethereum.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      window.location.reload();
    });

  }, []);

  return (
    <Router>
      <div className="main">
        <Header />
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/about" render={() => <About />} />
          <Route exact path="/charity" render={() => <Charity />} />
          <Route exact path="/dashboard" render={() => (
              auth.accountType == ACCOUNT_TYPE.ADMIN || auth.accountType == ACCOUNT_TYPE.OWNER ?
                <Dashboard />
              :
                <Home />
          )}
          />
          <Route exact path="/connect-wallet" render={() => <ConnectWallet />} />
          <Route exact path="/collection/:id" render={() => <Collection />} />
          <Route exact path="/create" render={() => <CreateItem />} />
          <Route exact path="/create-details" render={() => (
              auth.accountType == ACCOUNT_TYPE.ADMIN || auth.accountType == ACCOUNT_TYPE.OWNER ?
                <CreateDetails />
              :
                <Home />
          )}
          />
        </Switch>
        <Footer />
      </div>
      
    </Router>
  );
}

export default App;