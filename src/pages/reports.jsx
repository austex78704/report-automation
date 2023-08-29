import React from "react";
import PageTemplate from "../components/PageTemplate";
import PastReports from "../components/PastReports";

export default function Index() {
  return (
    <PageTemplate heading="Past Reports">
      <PastReports />
    </PageTemplate>
  );
}
