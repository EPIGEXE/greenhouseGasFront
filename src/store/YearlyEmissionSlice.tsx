import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./store";

interface EmissionState {
    yearlyData: any[];
    totalEmission: {
        data: Array<{ year: string; totalEmission: number; lulucf: number }>;
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | null;
    };
    selectedYear: string;
    selectedYearData: any[];
    selectedCategoryData: any[];
}

const initialState: EmissionState = {
    yearlyData: [],
    totalEmission: {
        data: [],
        status: 'idle',
        error: null
    },
    selectedYear: "",
    selectedYearData: [],
    selectedCategoryData: [],
};

export const fetchEmissionData = createAsyncThunk(
    'emission/fetchEmissionData',
    async () => {
        const response = await fetch('http://localhost:8080/api/v1/greenhouseGas/getAllGreenhouseGas');
        const data = await response.json();
        return data.data;
    }
);

export const fetchTotalEmissionByYear = createAsyncThunk(
    'emission/fetchTotalEmissionByYear',
    async (year: string) => {
        const response = await fetch(`http://localhost:8080/api/v1/greenhouseGas/getGreenhouseGasInventoryTreeByTitle?title=${encodeURIComponent("총배출량(Gg CO2eq)")}`);
        const data = await response.json();
        return { year, data: data.data };
    }
);

export const fetchCategoryData = createAsyncThunk(
    'emission/fetchCategoryData',
    async (category: string) => {
        const response = await fetch(`http://localhost:8080/api/v1/greenhouseGas/getGreenhouseGasInventoryTreeByTitle?title=${encodeURIComponent(category)}`);
        const data = await response.json();
        return data.data;
    }
);

const yearlyEmissionSlice = createSlice({
    name: "yearlyEmission",
    initialState,
    reducers: {
        setSelectedYear: (state, action: PayloadAction<string>) => {
            state.selectedYear = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmissionData.pending, (state) => {
                state.totalEmission.status = 'loading';
            })
            .addCase(fetchEmissionData.fulfilled, (state, action) => {
                state.totalEmission.status = 'succeeded';
                state.yearlyData = action.payload;
                const totalEmissionData = action.payload.find((item: any) => item.title === "총배출량(Gg CO2eq)").yearlyEmission;
                const lulucfData = action.payload.find((item: any) => item.title === "LULUCF")?.yearlyEmission || {};

                state.totalEmission.data = Object.entries(totalEmissionData).map(([year, value]) => ({
                    year,
                    totalEmission: Math.round(parseFloat(value as string)) || 0,
                    lulucf: Math.round(parseFloat(lulucfData[year] as string)) || 0
                }));
            })
            .addCase(fetchEmissionData.rejected, (state, action) => {
                state.totalEmission.status = 'failed';
                state.totalEmission.error = action.error.message || null;
            })
            .addCase(fetchTotalEmissionByYear.fulfilled, (state, action) => {
                const { year, data } = action.payload;
                const childData = data.map((item: any) => ({
                    title: item.title,
                    emission: parseFloat(item.yearlyEmission[year]) || 0
                }));

                const totalEmissionForYear = childData.reduce((total: number, item: any) => total + item.emission, 0);

                state.selectedYearData = childData.map((item: any) => ({
                    title: item.title,
                    [year]: item.emission,
                    percentage: parseFloat(((item.emission / totalEmissionForYear) * 100).toFixed(0))
                }));
                state.selectedYear = year;
            })
            .addCase(fetchCategoryData.fulfilled, (state, action) => {
                state.selectedCategoryData = action.payload;
            });
    },
});

export const { setSelectedYear } = yearlyEmissionSlice.actions;

export default yearlyEmissionSlice.reducer;

// Thunks
export const fetchAllData = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    await dispatch(fetchEmissionData());
    const state = getState() as RootState;
    if (state.yearlyEmission.totalEmission.data.length > 0) {
        dispatch(fetchTotalEmissionByYear(state.yearlyEmission.totalEmission.data[0].year));
    }
};

export const handleTotalEmissionClick = (year: string) => (dispatch: AppDispatch) => {
    dispatch(fetchTotalEmissionByYear(year));
};

export const handleCategoryClick = (category: string) => (dispatch: AppDispatch) => {
    dispatch(fetchCategoryData(category));
};