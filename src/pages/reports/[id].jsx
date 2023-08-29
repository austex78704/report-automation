import { useRouter } from "next/router";
import React from "react";
import GenerateReport from "../../components/GenerateReport";
import PageTemplate from "../../components/PageTemplate";

export default function Index() {
  const router = useRouter();

  return (
    <PageTemplate heading="Report">
      <GenerateReport id={router.query.id} />
    </PageTemplate>
  );
}
