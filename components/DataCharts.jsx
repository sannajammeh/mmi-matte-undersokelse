import React, { useMemo } from "react";

const DataCharts = ({ data: { singleStep, multiStep } }) => {
  const results = useMemo(() => {
    const singleSum = singleStep.reduce((acc, r) => r.answerCount + acc, 0);
    const multiSum = multiStep.reduce((acc, r) => r.answerCount + acc, 0);

    return {
      singleSum,
      multiSum,
      singleAverage: singleSum / singleStep.length,
      multiAverage: multiSum / multiStep.length,
    };
  }, [singleStep, multiStep]);

  const formatSingle = singleStep.map(
    ({ answerCount, timeCompletedSeconds }) => ({
      answers: answerCount,
      seconds: timeCompletedSeconds,
    })
  );
  const formatMulti = multiStep.map(
    ({ answerCount, timeCompletedSeconds }) => ({
      answers: answerCount,
      seconds: timeCompletedSeconds,
    })
  );
  return (
    <div>
      <h1>Results</h1>
      {/* <Bar /> */}

      <div style={{ display: "flex", gap: "4rem" }}>
        <code>
          <h2>Single</h2>
          <pre>
            <pre>{JSON.stringify(formatSingle, null, 4)}</pre>
          </pre>
        </code>
        <code>
          <h2>Multi</h2>
          <pre>
            <pre>{JSON.stringify(formatMulti, null, 4)}</pre>
          </pre>
        </code>
      </div>
    </div>
  );
};

export default DataCharts;
