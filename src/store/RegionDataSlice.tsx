import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegionDataState {
    selectedRegion: string | null;
}

const initialState: RegionDataState = {
    selectedRegion: null,
};

const regionDataSlice = createSlice({
    name: "regionData",
    initialState,
    reducers: {
        setSelectedRegion: (state, action: PayloadAction<string | null>) => {
            state.selectedRegion = action.payload;
        }
    }
});

export const { setSelectedRegion } = regionDataSlice.actions;
export default regionDataSlice.reducer;