import React, { useState, useEffect, useRef } from "react";
import * as Actions from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { _Contract } from "../../utils/_contract";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../utils/toast";
import cn from "classnames";
import styles from "./Card.module.sass";
import Loader from "../Loader";

import SlickArrow from "../../components/SlickArrow";
import Icon from "../../components/Icon";

const web3 = new Web3(Web3.givenProvider);

const Card = ({ className, item , data , index}) => {

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [isClickedBuyItem, setIsClickedBuyItem] = useState(false);
    const [openedMediaIndex, setOpenedMediaIndex] = useState(0);

    const scrollRef = useRef(null);

    const auth = useSelector(state => state.authReducer.data);

    useEffect(() => {
        open ? disableBodyScroll(scrollRef) : enableBodyScroll(scrollRef);
        setOpenedMediaIndex(index);
    }, [open]);

    const buyNFT = async (data) => {
        if (data.owner !== auth.address) {
            setIsClickedBuyItem(true);
            try {
                const tokenId = data.idForSale;
                const price = data.price;
                let toWei = web3.utils.toWei(price, 'ether');
                await _Contract.methods
                    .buyItem(tokenId)
                    .send({ from: auth.address, value: toWei, gas: 250000 })
                let res = await Actions.updateNFT({ tokenId: tokenId, buyer: auth.address });
                if (res) {
                    toast.success("Success!", toastOptions);
                } else {
                    toast.error("Some went wrong!", toastOptions);
                }
                setIsClickedBuyItem(false);
            } catch (error) {
                console.log(error, "===error");
                toast.info(error, toastOptions);
                setIsClickedBuyItem(false);
            }
        } else {
            toast.info("There are no NFTs to buy in this collection!", toastOptions);
        }
    };

    return (
        <>
            <div className={cn(styles.card, className)}>
                {/* <div className={styles.preview}> */}
                <div className={styles.card_body}>
                    <div
                        style={{ backgroundImage: `url(${process.env.REACT_APP_API_URL}/${item.url})` }}
                        className={styles.card_image}
                        onClick={() => setOpen(true)}
                    />
                </div>
                <div className={styles.line}>
                    {
                        item.onSale
                            ?
                            isClickedBuyItem ?
                                <button
                                    disabled
                                    className={cn("button", styles.button)}
                                    type="button"
                                >
                                    <Loader className={styles.loader}  />
                                </button>
                                :
                                <button className={cn("button-small btn-font btn-buy")} onClick={() => buyNFT(item)}>Buy</button>
                            :
                            <button className={cn("button-stroke button-small disabled btn-font btn-sold")}>Sold</button>
                    }
                </div>
                <ToastContainer />
                {/* </div> */}
            </div>
            {
                open ? (
                    <div className={styles.img_modal} ref={scrollRef}>
                        <span className={styles.x_close} onClick={() => setOpen(false)}>&times;</span>
                        <div className={styles.modal_body}>
                            <div className={styles.slideItem}>
                                <SlickArrow 
                                    className={styles.btn_prev}
                                    onClick={
                                        () => setOpenedMediaIndex(openedMediaIndex <= 0 ? data.length-1 : openedMediaIndex - 1)
                                    }    
                                >
                                    <Icon name="arrow-prev" size="30" />
                                </SlickArrow>
                                
                                <img className={styles.modal_content} src={`${process.env.REACT_APP_API_URL}/${data[openedMediaIndex].url}`} />
                                
                                <SlickArrow 
                                    className={styles.btn_next}
                                    onClick={
                                        () => setOpenedMediaIndex(openedMediaIndex >= data.length-1 ? 0 : openedMediaIndex + 1)
                                    }
                                >
                                    <Icon name="arrow-next" size="30" />
                                </SlickArrow>
                                
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </>
    );
};

export default Card;
