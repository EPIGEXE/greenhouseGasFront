import { configureStore } from "@reduxjs/toolkit";
import yearlyEmissionReducer from "./YearlyEmissionSlice";
import compareDataReducer from "./CompareDataSlice";
import regionDataReducer from "./RegionDataSlice";

export const store = configureStore({
    reducer: {
        yearlyEmission: yearlyEmissionReducer,
        compareData: compareDataReducer,
        regionData: regionDataReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;