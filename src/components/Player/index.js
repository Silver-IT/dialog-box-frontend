import React from "react";
import cn from "classnames";
import styles from "./Player.module.sass";
import { REACT_APP_API_URL }from "../../utils/constants"

const Player = ({ className, item }) => {

  return (
    <div className={cn(styles.player, className)}>
      <div style={{ backgroundImage: `url(${REACT_APP_API_URL}/${item.init_logo_uri})`}} className={styles.player_img}></div>
    </div>
  );
};

export default Player;
