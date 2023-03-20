import React from "react";
import { Card, Divider, Row } from "antd";
import { useContractLoader } from "eth-hooks";
import Address from "./Address";
import Balance from "./Balance";
import AddSigner from "./AddSigner";
import RemoveSigner from "./RemoveSigner";
import proposeTx from "../helpers/propseTx";
import AddSignatures from "./AddSignatures";
import SendEth from "./SendEth";
import AddCustomCall from "./AddCustomCall";
import { useState } from "react";
import { useEffect } from "react";
import Members from "./Members";
import ChangeRole from "./ChangeRole";

const Multisig = ({
  provider,
  apiBaseUrl,
  price,
  mainnetProvider,
  neededSigns,
  blockExplorer,
  members,
  roles,
  memberRole,
  multiSigAdd,
  address,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
      <Card style={{ width: "450px" }}>
        <Row title="Header" style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 style={{ margin: "0px" }}> 🔮solid-multisig </h1>{" "}
          <span>
            <Address address={multiSigAdd} />{" "}
            <Balance address={multiSigAdd} provider={provider} dollarMultiplier={price} />
          </span>
        </Row>
        <Divider />
        <Row title="Signers" style={{ display: "flex", justifyContent: "center" }}>
          <Members
            members={members}
            roles={roles}
            multiSigAdd={multiSigAdd}
            neededSigns={neededSigns}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            memberRole={memberRole}
            address={address}
          />
        </Row>
        <Divider />
        <Row title="Add a member" style={{ display: "flex", justifyContent: "center" }}>
          <AddSigner
            members={members}
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
            blockExplorer={blockExplorer}
          />
        </Row>
        <Divider />
        <Row title="Add a member" style={{ display: "flex", justifyContent: "center" }}>
          <RemoveSigner
            members={members}
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
            blockExplorer={blockExplorer}
          />
        </Row>
        <Divider />
        {/* <Row title="Change member role" style={{ display: "flex", justifyContent: "center" }}>
        <ChangeRole 
          members = {members} 
          multiSigAdd = {multiSigAdd}
          mainnetProvider={mainnetProvider}
          apiBaseUrl = {apiBaseUrl}
          neededSigns = {neededSigns}
          blockExplorer = {blockExplorer}
          />
        </Row>
        <Divider /> */}
        <Row title="Add Sigantures" style={{ display: "flex", justifyContent: "center" }}>
          <AddSignatures
            members={members}
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
          />
        </Row>
        <Divider />
        {/* <Row title="Send Eth" style={{ display: "flex", justifyContent: "center" }}>
          <SendEth
            members={members}
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
            price={price}
          />
        </Row>
        <Divider /> */}
        <Row title="Send Eth" style={{ display: "flex", justifyContent: "center" }}>
          <AddCustomCall
            members={members}
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
            price={price}
          />
        </Row>
      </Card>
    </div>
  );
};

export default Multisig;
