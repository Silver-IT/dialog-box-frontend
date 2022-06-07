import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../store/actions";
import cn from "classnames";
import styles from "./Terms.module.sass";
import parse from "html-react-parser";

const Terms = () => {

    const dispatch = useDispatch();

    const data = useSelector(state => state.articleReducer.data);

    useEffect(() => {
        dispatch(Actions.getTerms());
    }, []);

    return (
        <div className={cn("container", styles.container)}>
            <div className={cn("content")}>
                {data.length > 0 && parse(data[0].content)}
            </div>
        </div>
    )
}

export default Terms;