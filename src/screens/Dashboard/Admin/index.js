import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../../store/actions";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper
} from "@mui/material";
import TextInput from "../../../components/TextInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../../utils/toast";
import cn from "classnames";
import styles from "./Admin.module.sass";
import Modal from "../../../components/Modal";
import { ACCOUNT_TYPE } from "../../../utils/constants";

const Admin = () => {

    const dispatch = useDispatch();

    const [address, setAddress] = useState("");
    const [visibleModal, setVisibleModal] = useState(false);

    const admins = useSelector(state => state.adminReducer.data);
    const auth = useSelector(state => state.authReducer.data);
    
    useEffect(() => {
        Actions.getAllAdmins(dispatch);
    }, []);

    const addNewAddress = async () => {
        if (address) {
            let res = await Actions.addAdmin(auth, address);
            if (res instanceof Error) {
                toast.success(res.message, toastOptions);
            }else{
                toast.success("Saved successfully", toastOptions);
            }
            setVisibleModal(false);
        } else {
            toast.error("Please input admin address!", toastOptions);
        }
        setAddress("");
        Actions.getAllAdmins(dispatch);
    };

    const deleteAddress = async (address) => {
        let res = await Actions.delAdmin(auth, address);
        if (res instanceof Error) {
            toast.success(res.message, toastOptions);
        }else{
            toast.success("Deleted successfully", toastOptions);
        }
        Actions.getAllAdmins(dispatch);
    }

    return (
        <div className={styles.table_container}>
            {
                auth.accountType == ACCOUNT_TYPE.OWNER ?
                    <div className={styles.btn_position}>
                        <button
                            className={cn("button-small")}
                            onClick={() => setVisibleModal(true)}
                        >
                            Add
                        </button>
                    </div>
                : null
            }
            
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 450 }} aria-label="simple table">
                        <TableBody>
                            {admins.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">{row}</TableCell>
                                    {
                                    auth.accountType == ACCOUNT_TYPE.OWNER ? 
                                        <TableCell align="center">
                                            <p 
                                                className={styles.del_txt}
                                                onClick={() => deleteAddress(row)}
                                            >
                                                DELETE
                                            </p>
                                        </TableCell>
                                    : null
                                    }   
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Modal
                visible={visibleModal}
                onClose={() => setVisibleModal(false)}
            >
                <div className={styles.text_position}>
                    <TextInput
                        placeholder="Please input wallet address"
                        onChange={(e) => { setAddress(e.target.value) }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        className={cn("button-small")}
                        onClick={addNewAddress}
                    >
                        Add
                    </button>
                </div>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default Admin;