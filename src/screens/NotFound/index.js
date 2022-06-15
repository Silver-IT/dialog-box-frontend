import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styles from "./Notfound.module.sass";

const NotFound = () => {

    return (

        <div className={styles.body}>
            <h1>404 - Not Found!</h1>
            <Link to="/" className={styles.go_home}><h4>Go Home</h4></Link>
         </div>
    )
  };

export default NotFound;