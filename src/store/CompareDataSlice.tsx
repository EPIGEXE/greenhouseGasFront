import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./store";

interface CompareDataState {
    compareYear1: string;
    compareYear2: string;
    compareData: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CompareDataState = {
    compareYear1: "",
    compareYear2: "",
    compareData: [],
    status: 'idle',
    error: null
};

export const fetchCompareData = createAsyncThunk(
    'compareData/fetchCompareData',
    async (years: { year1: string, year2: string }) => {
        const requestBody = {
            year1: years.year1,
            year2: years.year2
        };
        
        const response = await fetch('http://localhost:8080/api/v1/greenhouseGas/getGreenhouseGasInventoryTreeCompare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        return data.data;
    }
);

const compareDataSlice = createSlice({
    name: "compareData",
    initialState,
    reducers: {
        setCompareYear: (state, action: PayloadAction<{ section: string, year: string }>) => {
            if (action.payload.section === 'first') {
                state.compareYear1 = action.payload.year;
            } else {
                state.compareYear2 = action.payload.year;
            }
        },
        setCompareData: (state, action: PayloadAction<any[]>) => {
            state.compareData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompareData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCompareData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.compareData = action.payload;
            })
            .addCase(fetchCompareData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    },
});

export const { setCompareYear, setCompareData } = compareDataSlice.actions;

export default compareDataSlice.reducer;

// Thunks
export const calculateCompareData = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { compareYear1, compareYear2 } = getState().compareData;
    
    if (!compareYear1.trim() || !compareYear2.trim() || compareYear1 === compareYear2) {
        dispatch(setCompareData([]));
        return;
    }
    
    await dispatch(fetchCompareData({ year1: compareYear1, year2: compareYear2 }));
};
