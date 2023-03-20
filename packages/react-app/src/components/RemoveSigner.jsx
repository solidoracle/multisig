import React, { useState } from "react";
import { Form, Button } from "antd";
import { ethers } from "ethers";
import Blockies from "react-blockies";
import proposeTx from "../helpers/propseTx";
import AddressInput from "./AddressInput";
import { useHistory } from "react-router-dom";

const RemoveSigner = ({ members, multiSigAdd, mainnetProvider, apiBaseUrl, neededSigns }) => {
  const [oldSigner, setOldSigner] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const history = useHistory();

  async function handlePropose() {
    try {
      setLoading(true);
      await proposeTx(apiBaseUrl, "removeSigner(address)", [["address"], [oldSigner]], multiSigAdd, 0, neededSigns);
      setOldSigner("");
      setActive(false);
      setLoading(false);
      history.push("/transactions");
    } catch (err) {
      alert(err);
      console.log(err);
      setActive(false);
      setLoading(false);
    }
  }

  return (
    <div>
      <Form title="Add a Signer" style={{ width: "350px" }}>
        {" "}
        Remove Owner
        <AddressInput
          autoFocus
          ensProvider={mainnetProvider}
          placeholder={"Remove owner address"}
          value={oldSigner}
          onChange={e => {
            setActive(false);
            console.log(e);
            setOldSigner(e);
            if (ethers.utils.isAddress(e)) setActive(true);
          }}
        />
        {oldSigner.length > 0 && !ethers.utils.isAddress(oldSigner) ? <p>Add a valid address</p> : null}
        {!active && ethers.utils.isAddress(oldSigner) ? (
          <p style={{ color: "red" }}>You can't add a signer that's already a member</p>
        ) : null}
        <Button
          title="Propose"
          disabled={!active}
          onClick={() => handlePropose()}
          loading={loading}
          style={{ marginTop: "15px" }}
        >
          Propose
        </Button>
      </Form>
    </div>
  );
};

export default RemoveSigner;
