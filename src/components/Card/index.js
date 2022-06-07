import React, { useState, useEffect, useRef } from "react";
import * as Actions from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../utils/toast";
import cn from "classnames";
import styles from "./Card.module.sass";
import Loader from "../Loader";

import SlickArrow from "../../components/SlickArrow";
import Icon from "../../components/Icon";
import artTokenContractABI from "../../config/abis/artToken.json";
import { API_URL } from "../../utils/constants";

const web3 = new Web3(Web3.givenProvider);

const Card = ({ className, item, data, index }) => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [openedMediaIndex, setOpenedMediaIndex] = useState(0);
  const [isMInted, setIsMinted] = useState(false);

  const scrollRef = useRef(null);

  const auth = useSelector((state) => state.authReducer);
  const price = useSelector((state) => state.mintPriceReducer.data);

  const _Contract = new web3.eth.Contract(
    artTokenContractABI.abi,
    item.collection_address
  );

  useEffect(async () => {
    if (item.token_id === "") {
      setIsMinted(false);
    } else {
      setIsMinted(true);
    }
  }, []);

  useEffect(() => {
    open ? disableBodyScroll(scrollRef) : enableBodyScroll(scrollRef);
    setOpenedMediaIndex(index);
  }, [open]);

  const mintNFT = async (data) => {
    setIsMinting(true);
    try {
      _Contract.methods
        .publicMint(data.metadata_id, data.royalty_fraction)
        .send({ from: auth.authAddress, value: Web3.utils.toWei(price, "ether")})
        .then(response => {
          console.log(response);
          setIsMinted(true);
          toast.success("Success!", toastOptions);
          setIsMinting(false);
        })
        .catch(error => {
          toast.error(error.message, toastOptions);
          setIsMinting(false);
        });

    } catch (error) {
      console.log(error, "===error");
      toast.info(error, toastOptions);
      setIsMinting(false);
    }
  };

  return (
    <React.Fragment>
      <div className={cn(styles.card, className)}>
        {/* <div className={styles.preview}> */}
        <div className={styles.card_body}>
          <div
            style={{
              backgroundImage: `url(${API_URL}/${
                JSON.parse(item.metadata).image
              })`,
            }}
            className={styles.card_image}
            onClick={() => setOpen(true)}
          />
        </div>
        <div className={styles.line}>
          <div>
            {isMInted == false ? (
              isMinting ? (
                <button
                  disabled
                  className={cn("button", styles.button)}
                  type="button"
                >
                  <Loader className={styles.loader} />
                </button>
              ) : (
                <button
                  className={cn("button-small btn-font btn-buy")}
                  onClick={() => mintNFT(item)}
                >
                  Mint
                </button>
              )
            ) : (
              <button
                className={cn(
                  "button-stroke button-small disabled btn-font btn-sold"
                )}
              >
                Minted
              </button>
            )}
          </div>
          <div className={styles.price}>${price}</div>
        </div>
        <ToastContainer />
        {/* </div> */}
      </div>
      {open ? (
        <div className={styles.img_modal} ref={scrollRef}>
          <span className={styles.x_close} onClick={() => setOpen(false)}>
            &times;
          </span>
          <div className={styles.modal_body}>
            <div className={styles.slideItem}>
              <SlickArrow
                className={styles.btn_prev}
                onClick={() =>
                  setOpenedMediaIndex(
                    openedMediaIndex <= 0
                      ? data.length - 1
                      : openedMediaIndex - 1
                  )
                }
              >
                <Icon name="arrow-prev" size="30" />
              </SlickArrow>

              <img
                className={styles.modal_content}
                src={`${API_URL}/${
                  JSON.parse(data[openedMediaIndex].metadata).image
                }`}
              />

              <SlickArrow
                className={styles.btn_next}
                onClick={() =>
                  setOpenedMediaIndex(
                    openedMediaIndex >= data.length - 1
                      ? 0
                      : openedMediaIndex + 1
                  )
                }
              >
                <Icon name="arrow-next" size="30" />
              </SlickArrow>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Card;
