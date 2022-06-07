import React from "react";
import { useDispatch } from "react-redux";
import * as Actions from "../../store/actions";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../utils/toast";
import cn from "classnames";
import styles from "./ConnectWallet.module.sass";
import Icon from "../../components/Icon";
import {connectMetaMask} from "../../utils/connectMetaMask.js"

const Connect = () => {

  const dispatch = useDispatch();

  const connectMetaMaskFunc = async () => {
    connectMetaMask(dispatch);
  }

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <Link className={styles.back} to="/">
            <Icon name="arrow-prev" size="24" />
            <div className={cn("h2", styles.stage)}>Connect your wallet</div>
          </Link>
        </div>
        <div className={styles.body}>
          <div className={styles.menu}>

            <div className={cn(styles.link)} onClick={connectMetaMaskFunc}>
              <div className={styles.icon} style={{ backgroundColor: "#9757D7" }}>
                <Icon name="wallet" size="24" />
                <Icon name="check" size="18" fill={"#9757D7"} />
              </div>
              <span>MetaMask Wallet</span>
              <div className={styles.arrow}>
                <Icon name="arrow-next" size="14" />
              </div>
            </div>

          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Connect;
