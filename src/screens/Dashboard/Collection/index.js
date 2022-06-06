import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../../store/actions";
import TextInput from "../../../components/TextInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../../utils/toast";
import cn from "classnames";
import Dropzone from "react-dropzone";
import Icon from "../../../components/Icon";
import styles from "./Collection.module.sass";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Web3 from "web3";
import tokenManagerContractABI from "../../../config/abis/artTokenManager.json";
import { API_URL } from "../../../utils/constants";
import Loader from "../../../components/Loader";
import { Toast } from "react-bootstrap";
import { UPDATE_COLLECTION } from "../../../store/types";

const Collection = () => {
  const dispatch = useDispatch();

  const dropRef = useRef();
  const scrollRef = useRef();

  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [visibleUpdateModal, setVisibleUpdateModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);

  const [title, setTitle] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initBaseURI, setInitBaseURI] = useState(
    API_URL + "/collection/token/"
  );
  const [maxSupply, setMaxSupply] = useState("");
  const [mintPrice, setMintPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [updatingCollection, setUpdatingCollection] = useState(null);

  const auth = useSelector((state) => state.authReducer);
  const collections = useSelector(
    (state) => state.collectionReducer.collections
  );

  useEffect(() => {
    Actions.getCollections(dispatch);
  }, []);

  const onDrop = async (files) => {
    try {
      if (files.length > 0 && files[0].type.slice(0, 6) === "image/") {
        const uploadedFile = files[0];
        var formData = new FormData();
        formData.append("file", uploadedFile);

        Actions.uploadCollectionImage(formData)
          .then((response) => {
            let url = response.data.file;
            setImageUrl(url);
            setFile(uploadedFile);
          })
          .catch((error) => {
            toast.error(error.message, toastOptions);
          });
      } else {
        toast.warn(
          "This is not image. Please upload only image!",
          toastOptions
        );
      }
    } catch (error) {
      toast.error(error.message, toastOptions);
    }
  };

  const removeImage = () => {
    // Actions.removeImage(imageUrl);
    setImageUrl("");
    setFile(null);
  };

  const save = async () => {
    if (
      !imageUrl ||
      !title ||
      !symbol ||
      !initBaseURI ||
      !maxSupply ||
      !mintPrice
    ) {
      toast.error("Please input all fields!", toastOptions);
      return;
    }

    setIsSaving(true);

    const web3 = new Web3(Web3.givenProvider);
    web3.eth.transactionBlockTimeout = 1000;

    const _Contract = new web3.eth.Contract(
      tokenManagerContractABI.abi,
      process.env.REACT_APP_TOKENMANAGER_CONTRACT_ADDRESS
    );

    let collection = {
      title: title,
      symbol: symbol,
      init_logo_uri: imageUrl,
      init_base_uri: initBaseURI,
      mint_price: mintPrice,
      max_supply: maxSupply,
    };

    Actions.deployCollection(collection, auth)
      .then((response) => {
        toast.success("Collection saved successfully", toastOptions);
        resetInputFields();
      })
      .catch((error) => {
        resetInputFields();
        toast.error(error.message, toastOptions);
      });
  };

  const updateItem = (collection) => {
    setImageUrl(collection.init_logo_uri);
    setUpdatingCollection(collection);
    setVisibleUpdateModal(true);
  };

  const updateCollection = () => {
    if (imageUrl && updatingCollection.init_logo_uri != imageUrl) {
      setIsUpdating(true);
      let tempCollection = { ...updatingCollection, init_logo_uri: imageUrl };

      Actions.updateCollection(tempCollection, auth)
        .then((response) => {
          dispatch({
            type: UPDATE_COLLECTION,
            payload: {
              address: tempCollection.address,
              new_logo_uri: tempCollection.init_logo_uri
            },
          });
          toast.success("Updated successfully", toastOptions);
          resetUpdateModal();
        })
        .catch((error) => {
          toast.error(error.message, toastOptions);
          resetUpdateModal();
        });
    }
  };

  const resetUpdateModal = () => {
    setVisibleUpdateModal(false);
    setIsUpdating(false);
    setFile(null);
    setImageUrl("");
  };

  const resetInputFields = () => {
    setVisibleAddModal(false);
    setIsSaving(false);
    setFile(null);
    setImageUrl("");
    setTitle("");
    setTitle("");
    setSymbol("");
    setMaxSupply("");
    setMintPrice("");
  };

  const cancelAdd = () => {
    setVisibleAddModal(false);

    setFile(null);
    setImageUrl("");
    setTitle("");
    setTitle("");
    setSymbol("");
    setMaxSupply("");
    setMintPrice("");
  };

  const cancelUpdate = () => {
    setVisibleUpdateModal(false);
  };

  return (
    <div className={styles.table_container}>
      <div className={styles.btn_position}>
        <button
          className={cn("button-small")}
          onClick={() => setVisibleAddModal(true)}
        >
          Add
        </button>
      </div>
      {collections.map((item, index) => (
        <div className={styles.collection_card} key={index}>
          <div className={styles.column}>
            <img
              src={`${API_URL}/${item.init_logo_uri}`}
              className={styles.collection_img}
            />
          </div>
          <div className={styles.column}>
            <div className={cn("h4", styles.title_size)}>{item.title}</div>
            <div className={styles.car_btns}>
              <button
                className={cn("button-small button-stroke")}
                onClick={() => updateItem(item)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ))}
      <div></div>
      {visibleAddModal && (
        <div className={styles.add_modal} ref={scrollRef}>
          <div className={styles.add_modal_content}>
            <div className={styles.list}>
              <div className={styles.category}>Collection Details</div>
              <div className={styles.note}>
                Drag or choose your file to upload
              </div>
              <div>
                {imageUrl ? (
                  <div className={styles.preview_}>
                    <div
                      className={styles.preview_img}
                      style={{ backgroundImage: `url(${API_URL}/${imageUrl})` }}
                    >
                      <div className={styles.close_img} onClick={removeImage}>
                        <Icon name="close" size="25" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Dropzone onDrop={onDrop} accept="image/*">
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps({ className: "drop-zone" })}
                        ref={dropRef}
                        className={styles.file}
                      >
                        <input {...getInputProps()} className={styles.load} />
                        <div className={styles.icon}>
                          <Icon name="upload-file" size="24" />
                        </div>
                        <div className={styles.format}>
                          PNG, JPG, JPEG, GIF, WEBP
                        </div>
                        {file && (
                          <div>
                            <strong>Selected file:</strong> {file.name}
                          </div>
                        )}
                      </div>
                    )}
                  </Dropzone>
                )}
              </div>
              <div className={styles.fieldset}>
                <TextInput
                  className={styles.field}
                  label="Name"
                  name="Name"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  required
                />
                <TextInput
                  className={styles.field}
                  label="Symbol"
                  name="Symbol"
                  type="text"
                  onChange={(e) => setSymbol(e.target.value)}
                  value={symbol}
                  required
                />
                <TextInput
                  className={styles.field}
                  label="initBaseURI"
                  name="initBaseURI"
                  type="text"
                  onChange={(e) => setInitBaseURI(e.target.value)}
                  value={initBaseURI}
                  required
                />
                <TextInput
                  className={styles.field}
                  label="max Supply"
                  name="max Supply"
                  type="text"
                  onChange={(e) => setMaxSupply(e.target.value)}
                  value={maxSupply}
                  required
                />
                <TextInput
                  className={styles.field}
                  label="mint Price"
                  name="mint Price"
                  type="text"
                  onChange={(e) => setMintPrice(e.target.value)}
                  value={mintPrice}
                  required
                />
                <div className={styles.modal_btns}>
                  {isSaving ? (
                    <button
                      disabled={true}
                      className={cn("button-small", styles.update_btn)}
                    >
                      <span>Saving...</span>
                    </button>
                  ) : (
                    <button
                      className={cn("button-small", styles.update_btn)}
                      onClick={save}
                    >
                      Save
                    </button>
                  )}

                  <button
                    className={cn("button-small button-stroke")}
                    onClick={cancelAdd}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {visibleUpdateModal && (
        <div className={styles.add_modal} ref={scrollRef}>
          <div className={styles.add_modal_content}>
            <div className={styles.list}>
              <div className={styles.category}>Collection Details</div>
              <div className={styles.note}>
                Drag or choose your file to upload
              </div>
              <div>
                {imageUrl ? (
                  <div className={styles.preview_}>
                    <div
                      className={styles.preview_img}
                      style={{ backgroundImage: `url(${API_URL}/${imageUrl})` }}
                    >
                      <div className={styles.close_img} onClick={removeImage}>
                        <Icon name="close" size="25" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Dropzone onDrop={onDrop} accept="image/*">
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps({ className: "drop-zone" })}
                        ref={dropRef}
                        className={styles.file}
                      >
                        <input {...getInputProps()} className={styles.load} />
                        <div className={styles.icon}>
                          <Icon name="upload-file" size="24" />
                        </div>
                        <div className={styles.format}>
                          PNG, JPG, JPEG, GIF, WEBP
                        </div>
                        {file && (
                          <div>
                            <strong>Selected file:</strong> {file.name}
                          </div>
                        )}
                      </div>
                    )}
                  </Dropzone>
                )}
              </div>

              <div className={styles.fieldset}>
                <div className={styles.modal_btns}>
                  {isUpdating ? (
                    <button
                      disabled={true}
                      className={cn("button-small", styles.update_btn)}
                    >
                      <span>Updating...</span>
                    </button>
                  ) : (
                    <button
                      className={cn("button-small", styles.update_btn)}
                      onClick={updateCollection}
                    >
                      Update
                    </button>
                  )}

                  <button
                    className={cn("button-small button-stroke")}
                    onClick={cancelUpdate}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Collection;
