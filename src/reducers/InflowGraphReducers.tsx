import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface graphState {
  inflowgraphData: any;
}

const initialState: graphState = {
  inflowgraphData: {},
};

const inflowGraphSlice = createSlice({
  name: 'inflowgraphReducer', // ✅ this is just a name — not state key
  initialState,
  reducers: {
    setinflowGraphData: (state, action: PayloadAction<any>) => {
      state.inflowgraphData = action.payload;
    },
  },
});


export const { setinflowGraphData } = inflowGraphSlice.actions;
export default inflowGraphSlice.reducer;