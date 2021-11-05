import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { questions } from "../constants/questions";
import EmojiRating from "./EmojiRating";

import { getFirestore, doc, setDoc } from "firebase/firestore";
import Timer from "easytimer.js";
import ReactConfetti from "react-confetti";
import { auth, firebase } from "../utils/firebase.utils";
const db = getFirestore(firebase);

const SingleStepForm = () => {
  const { control, handleSubmit } = useForm();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [finalRating, setFinalRating] = useState(3);
  const timerRef = useRef(null);
  const [state, setState] = useState({});

  const onSubmit = (data) => {
    setCompleted(true);
    const answers = Object.entries(data)
      .filter(([, answer]) => answer)
      .map(([question, answer]) => ({
        question,
        answer,
        correct: eval(question) === Number(answer),
      }))
      .reduce((acc, value) => ({ ...acc, [value.question]: value }), {});

    setState(answers);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const ref = doc(db, "single-step", auth.currentUser.uid);
    setLoading(true);
    await setDoc(ref, {
      uid: auth.currentUser.uid,
      results: {
        complete: true,
        context: state,
      },
      completeTime: { ...timerRef.current.getTimeValues() },
      finalRating,
      createdAt: new Date(),
    });
    setLoading(false);

    setLoading(false);

    setSubmitted(true);

    timerRef.current = null;
  };

  const initTimer = () => {
    if (timerRef.current) return;
    timerRef.current = new Timer();
    timerRef.current.start();
  };

  if (submitted)
    return (
      <div>
        <Typography variant="h4">Takk!</Typography>
        <ReactConfetti tweenDuration={1000} />
      </div>
    );

  if (completed)
    return (
      <form onSubmit={handleFinalSubmit}>
        <Typography variant="h5">Var dette enkelt å fylle ut?</Typography>
        <EmojiRating
          onChange={(e, value) => setFinalRating(value)}
          value={finalRating}
        />
        <br />
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <Button type="submit" variant="contained">
            Ferdig
          </Button>
        )}
      </form>
    );
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={initTimer}
      onClick={initTimer}
    >
      <Grid container spacing={2}>
        {questions.map((question) => (
          <Grid key={question} item xs={12} sm={6} md={6}>
            <Controller
              control={control}
              name={question}
              render={({ field: { value, ref, onChange, ...field } }) => (
                <TextField
                  fullWidth
                  label={question}
                  type="number"
                  onChange={onChange}
                  value={value}
                  {...field}
                  inputRef={ref}
                />
              )}
            />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" size="large" type="submit" sx={{ my: 2 }}>
        Lever
      </Button>
    </form>
  );
};

export default SingleStepForm;
