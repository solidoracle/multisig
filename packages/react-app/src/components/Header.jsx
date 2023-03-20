import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/solidoracle/multisig.git" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🔮solid-multisig"
        subTitle="Multisig Challenge from SpeedRunEthereum"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
