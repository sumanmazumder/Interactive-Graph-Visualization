import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface graphState {
  outflowgraphData: any;
}

const initialState: graphState = {
  outflowgraphData: {},
};

const outflowGraphSlice = createSlice({
  name: 'outflowGraphReducer', // ✅ this is just a name — not state key
  initialState,
  reducers: {
    setoutflowGraphData: (state, action: PayloadAction<any>) => {
      state.outflowgraphData = action.payload;
    },
  },
});


export const { setoutflowGraphData } = outflowGraphSlice.actions;
export default outflowGraphSlice.reducer;
