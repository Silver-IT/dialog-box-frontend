import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import cn from "classnames";
import styles from "./Collection.module.sass";
import Card from "../../components/Card";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../store/actions";
import { toastOptions } from "../../utils/toast";
import { ToastContainer, toast } from "react-toastify";
import { SAVE_NEW_NFT, GET_NFTS } from "../../store/types";

const Collection = () => {
  const collectionAddress = useParams().id;
  const dispatch = useDispatch();

  const nftArray = useSelector((state) => state.nftReducer.data);

  useEffect(() => {
    if (collectionAddress) {
      Actions.getMintPrice(collectionAddress, dispatch);
    }
  }, []);

  useEffect(() => {
    if (collectionAddress) {
      Actions.getNFTs(collectionAddress)
        .then((response) => {
          dispatch({
            type: GET_NFTS,
            payload: {
              data: response.data.result,
            },
          });
        })
        .catch((error) => {
          if (error.response) {
            toast.error("Server Error", toastOptions);
          } else if (error.request) {
            toast.error("Server is not responding", toastOptions);
          } else {
            toast.error(error.message, toastOptions);
          }
        });
    }
  }, [collectionAddress]);

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.list}>
          <div className={styles.grid}>
            {collectionAddress &&
            nftArray.length > 0 &&
            nftArray[0].collection_address === collectionAddress
              ? nftArray.map((item, index) => {
                  return (
                    <Card
                      key={index}
                      className={styles.card}
                      item={item}
                      data={nftArray}
                      index={index}
                    />
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
