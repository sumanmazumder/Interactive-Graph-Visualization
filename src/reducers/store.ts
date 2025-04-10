import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import inFlowGraphReducer from "./InflowGraphReducers";
import outFlowGraphReducer from "./OutflowGraphReducers";

export const store = configureStore({
    reducer:{
        inflowgraphReducer: inFlowGraphReducer,
        outflowGraphReducer: outFlowGraphReducer
    }
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// export default rootReducer;