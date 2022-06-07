import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../store/actions";
import cn from "classnames";
import styles from "./Header.module.sass";
import Icon from "../Icon";
import Image from "../Image";
import {connectMetaMask} from "../../utils/connectMetaMask.js"
import { ACCOUNT_TYPE } from "../../utils/constants";
import { alertTitleClasses } from "@mui/material";

const openseaIcon = "/images/icons/opensea.svg";

const Headers = () => {

  const dispatch = useDispatch();

  const [visibleNav, setVisibleNav] = useState(false);
  const [visibleCollectionsNav, setVisibleCollectionsNav] = useState(false);

  const collectionArray = useSelector(state => state.collectionReducer.collections);
  const auth = useSelector(state => state.authReducer);
  
  useEffect(() => {

    // connectMetaMask(dispatch);
    Actions.getCollections(dispatch);

  }, []);

  const setVisableNavBar = () => {
    setVisibleNav(!visibleNav);
    if (visibleCollectionsNav) {
      setVisibleCollectionsNav(false);
    }
  };


  return (
    
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Link className={styles.logo} to="/" onClick={() => { setVisibleNav(false) }}>
          <Image
            className={styles.pic}
            src="/images/logo.png"
            srcDark="/images/logo.png"
            alt="Fitness Pro"
          />
          <div className={styles.site_title}>dialog box</div>
        </Link>
        <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>
          <nav className={styles.nav}>
            <div className={styles.dropdown}>
              <div className={styles.collection}>
                <div className={styles.collection_nav} onClick={() => { setVisibleCollectionsNav(true) }}>
                  <div className={styles.collection_name}>
                    <div>
                      Collections
                    </div>
                    <div className={styles.arrow_next_icon}>
                      <Icon name="arrow-next" fill='#777E90' size={20} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.dropdown_content}>
                {collectionArray.length > 0 && collectionArray.map((item, index) => {
                  return <Link key={index} to={{ pathname: `/collection/${item.address}` }} className={styles.dropdown_content_item} onClick={() => { setVisibleNav(false) }}> {item.title} </Link>
                })}
              </div>
            </div>
            <Link className={styles.link} to="/about" onClick={() => { setVisibleNav(false) }}>
              About us
            </Link>
            <Link className={styles.link} to="/charity" onClick={() => { setVisibleNav(false) }}>
              Charity
            </Link>
            {
              auth.authAddress
                ?
                auth.accountType == ACCOUNT_TYPE.ADMIN || auth.accountType == ACCOUNT_TYPE.OWNER
                  ?
                  <>
                    <Link className={styles.link} to="/dashboard" onClick={() => { setVisibleNav(false) }}>
                      Dashboard
                    </Link>
                    <Link className={styles.link} to="/create" onClick={() => { setVisibleNav(false) }}>
                      Create
                    </Link>
                  </>
                  : null
                : <Link className={styles.link} to="/connect-wallet" onClick={() => { setVisibleNav(false) }}>Connect Wallet</Link>
            }
          </nav>
        </div>
        <div className={cn(styles.collection_wrapper, { [styles.active]: visibleCollectionsNav })}>
          <nav className={styles.nav}>
            <div className={styles.collection_menu}>
              <div className={styles.collection_nav_menu} onClick={() => { setVisibleCollectionsNav(false) }}>
                <div className={styles.collection_nav_name}>
                  <div className={styles.arrow_prev_icon}>
                    <Icon name="arrow-prev" fill='#777E90' size={20} />
                  </div>
                  <div>
                    collections
                  </div>
                </div>
              </div>
            </div>
            {collectionArray.length > 0 && collectionArray.map((item, index) => {
              return (
                <Link
                  className={styles.collection_nav_link}
                  to={{ pathname: `/collection/${item.collectionId}` }}
                  onClick={() => {
                    setVisibleCollectionsNav(false)
                    setVisibleNav(false)
                  }}
                  key={index}
                >
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
        {
          auth.authAddress
            ?
            auth.accountType == ACCOUNT_TYPE.ADMIN || auth.accountType == ACCOUNT_TYPE.OWNER
              ?
              <>
                <Link className={cn("button-stroke button-small", styles.button)} to="/dashboard" onClick={setVisableNavBar}>Dashboard</Link>
                <Link className={cn("button-small", styles.button)} to="/create" onClick={setVisableNavBar}>Create</Link>
              </>
              :
              null
            :
            <Link className={cn("button-stroke button-small", styles.button)} to="/connect-wallet" onClick={setVisableNavBar}>Connect Wallet</Link>
        }
        <ul className={styles.social}>
          <li>
            <a href="https://twitter.com/dialogboxNFT" target="_blank">
              <Icon name="twitter" fill="#DADDE0" size={30} viewBoxAttribute = "0 0 17 17" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/dialogbox_nft/" target="_blank">
              <Icon name="instagram" fill="#DADDE0" size={30} viewBoxAttribute = "0 0 17 17" />
            </a>
          </li>
          <li>
            <a href="https://opensea.io" target="_blank">
              <img src={openseaIcon} className={styles.openseaIcon} />
            </a>
          </li>
        </ul>
        <button
          className={cn(styles.burger, { [styles.active]: visibleNav })}
          onClick={setVisableNavBar}
        ></button>
      </div>
    </header>
  );
};

export default Headers;