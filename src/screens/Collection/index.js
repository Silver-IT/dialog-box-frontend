import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import cn from "classnames";
import styles from "./Collection.module.sass";
import Card from "../../components/Card";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../store/actions";
import { toastOptions } from "../../utils/toast";
import { ToastContainer, toast } from "react-toastify";
import { SAVE_NEW_NFT, GET_NFTS } from "../../store/types";

const Collection = () => {

  const [collection, setCollection] = useState(null);

  const collectionAddress = useParams().id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nftArray = useSelector((state) => state.nftReducer.data);
  const collectionArray = useSelector(state => state.collectionReducer.collections);

  useEffect(() => {
    if (checkAddressValidate(collectionAddress) || collectionArray.length == 0){
      const collection = collectionArray.find(collection => collection.address == collectionAddress);
      setCollection(collection);
    }else{
      navigate('/404');
    }
      
  }, [collectionAddress, collectionArray]);

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

  const checkAddressValidate = (addr) => {
    let addressArray = [];
    for(let index in collectionArray){
      addressArray.push(collectionArray[index].address);
    }
    return addressArray.includes(addr)
  }

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
                      collection={collection}
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
