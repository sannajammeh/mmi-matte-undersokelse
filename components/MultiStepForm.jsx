import {
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  createStore,
  StateMachineProvider,
  useStateMachine,
} from "little-state-machine";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  addition,
  division,
  multiplication,
  subtraction,
} from "../constants/questions";
import EmojiRating from "./EmojiRating";
import { auth, firebase } from "../utils/firebase.utils";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Timer from "easytimer.js";
import ReactConfetti from "react-confetti";

const db = getFirestore(firebase);

const initialState = {
  step: 0,
  complete: false,
};

createStore(initialState);

const submit = (globalState, payload) => {
  return {
    ...globalState,
    step: (globalState.step + 1) % 4,
    context: {
      ...globalState.context,
      ...payload,
    },
    complete: false,
  };
};

const finalSubmit = (globalState, payload) => {
  return {
    ...globalState,
    step: 3,
    context: {
      ...globalState.context,
      ...payload,
    },
    complete: true,
  };
};

const steps = [
  { label: "Addisjon", questions: addition },
  { label: "Subtraksjon", questions: subtraction },
  { label: "Multiplikasjon", questions: multiplication },
  { label: "Divisjon", questions: division },
];

const MultiStepForm = () => {
  const [finalRating, setFinalRating] = useState(3);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef(null);
  const { state, actions } = useStateMachine({
    reset: () => initialState,
  });

  useLayoutEffect(() => {
    actions.reset();
  }, []);

  const { label, questions } = steps[state.step] || {};

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    const ref = doc(db, "multi-step", auth.currentUser.uid);

    console.log(timerRef.current.getTimeValues());
    setLoading(true);
    await setDoc(ref, {
      uid: auth.currentUser.uid,
      results: state,
      completeTime: { ...timerRef.current.getTimeValues() },
      finalRating,
      createdAt: new Date(),
    });
    setLoading(false);

    setCompleted(true);

    timerRef.current = null;
    actions.reset();
  };

  const initTimer = () => {
    if (timerRef.current) return;
    timerRef.current = new Timer();
    timerRef.current.start();
  };

  if (completed)
    return (
      <div>
        <Typography variant="h4">Takk!</Typography>
        <ReactConfetti tweenDuration={1000} />
      </div>
    );

  if (state.complete)
    return (
      <div>
        <Typography variant="h4">Bra jobba!</Typography>
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
      </div>
    );

  return (
    <div>
      <Progress progress={(state.step / 4) * 100} />
      <Box sx={{ my: 2 }} />
      {questions && (
        <FormStep
          onFocus={() => initTimer()}
          onClick={() => initTimer()}
          label={label}
          questions={questions}
          final={state.step === 3}
        />
      )}
    </div>
  );
};

const withStateMachine = (WrappedComponent) => {
  const hocComponent = ({ ...props }) => (
    <StateMachineProvider>
      <WrappedComponent {...props} />
    </StateMachineProvider>
  );

  return hocComponent;
};

export default withStateMachine(MultiStepForm);

const FormStep = ({ questions, label, final = false, ...rest }) => {
  const { actions } = useStateMachine({
    submit: submit,
    finalSubmit,
  });

  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    const answers = Object.entries(data)
      .filter(([, answer]) => answer)
      .map(([question, answer]) => ({
        question,
        answer,
        correct: eval(question) === Number(answer),
      }))
      .reduce((acc, value) => ({ ...acc, [value.question]: value }), {});

    actions[final ? "finalSubmit" : "submit"](answers);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...rest} id={label}>
      <Typography sx={{ my: 2 }} variant="h5">
        {label}
      </Typography>
      <Grid container spacing={4}>
        {questions.map((question) => (
          <Grid key={question} item xs={6} sm={4} md={3}>
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
      <Button
        type="submit"
        variant="contained"
        sx={{ mx: "auto", display: "block", mt: 4 }}
        size="large"
      >
        {!final ? "Neste" : "Fullfør"}
      </Button>
    </form>
  );
};

const Progress = ({ progress = 0 }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          sx={{ height: 10, borderRadius: 100 }}
          variant="determinate"
          value={progress}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          progress
        )}%`}</Typography>
      </Box>
    </Box>
  );
};
