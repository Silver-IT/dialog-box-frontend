import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import cn from "classnames";
import styles from "./Collection.module.sass";
import Card from "../../components/Card";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../store/actions";

const Collection = () => {

    const collectionAddress = useParams().id;
    const dispatch = useDispatch();

    const data = useSelector(state => state.nftReducer.data);

    useEffect(() => {
        if (collectionAddress) {
            dispatch(Actions.getNFTs(collectionAddress));
        }
    }, [collectionAddress]);

    return (
        <div className={cn("section", styles.section)} >
            <div className={cn("container", styles.container)}>
                <div className={styles.list}>
                    <div className={styles.grid}>
                        {
                            collectionAddress && data.length > 0 && data[0].collection_address === collectionAddress ? 
                            data.map((item, index) => {
                                return <Card 
                                    key={index}
                                    className={styles.card} 
                                    item={item} 
                                    data={data} 
                                    index={index}
                                />
                            })
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Collection;