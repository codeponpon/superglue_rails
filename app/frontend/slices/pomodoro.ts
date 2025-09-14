import { createSlice } from "@reduxjs/toolkit";
import { saveResponse, beforeVisit } from "@thoughtbot/superglue";

const initialState = {
  completedPomodoros: 0,
};

export type PomodoroState = typeof initialState;

export const pomodoroSlice = createSlice({
  name: "pomodoro",
  initialState: initialState,
  reducers: {
    increment(state) {
      state.completedPomodoros += 1;
    },

    setCount(state, { payload }) {
      state.completedPomodoros = payload;
    },

    resetCount(state) {
      state.completedPomodoros = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(beforeVisit, (state, _action) => {
      return state;
    });
    builder.addCase(saveResponse, (state, action) => {
      const { page } = action.payload;

      if (page.slices.pomodoro) {
        return {
          ...state,
          ...(page.slices.pomodoro as PomodoroState),
        };
      }

      return state;
    });
  },
});

export const { increment, setCount, resetCount } = pomodoroSlice.actions;

export const selectPomodoroCount = (state: { pomodoro: PomodoroState }) =>
  state.pomodoro.completedPomodoros;
export default pomodoroSlice.reducer;
