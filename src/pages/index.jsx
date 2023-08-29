import React from "react";
import { v4 as uuidv4 } from "uuid";
import GenerateReport from "../components/GenerateReport";
import PageTemplate from "../components/PageTemplate";

export default function Index() {
  return (
    <PageTemplate heading="Generate New Report">
      <GenerateReport id={uuidv4()} />
    </PageTemplate>
  );
}
