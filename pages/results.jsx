import React from "react";
import { getFirestore } from "firebase-admin/firestore";
import { admin } from "../utils/firebase.server";
import dynamic from "next/dynamic";
import { Container } from "@mui/material";

const DataCharts = dynamic(() => import("../components/DataCharts"), {
  ssr: false,
});

const Results = ({ data }) => {
  return (
    <Container>
      <DataCharts data={data} />
    </Container>
  );
};

export default Results;

export const getServerSideProps = async (ctx) => {
  const db = getFirestore(admin);

  const singleStep = (await db.collection("single-step").get()).docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    })
    .map(transformData);

  const multiStep = (await db.collection("multi-step").get()).docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    })
    .map(transformData);

  return {
    props: {
      data: {
        singleStep,
        multiStep,
      },
    },
  };
};

const transformData = ({ results: { context }, completeTime }) => ({
  answers: context,
  answerCount: Object.values(context).length,
  timeCompletedSeconds: completeTime.seconds + completeTime.minutes * 60,
});
