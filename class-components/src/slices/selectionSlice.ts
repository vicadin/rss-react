import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectionState {
  selectedItems: string[];
}

const initialState: SelectionState = {
  selectedItems: [],
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<string>) => {
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
      }
    },
    deselectItem: (state, action: PayloadAction<string>) => {
      state.selectedItems = state.selectedItems.filter((item) => item !== action.payload);
    },
  },
});

export const { selectItem, deselectItem } = selectionSlice.actions;

export default selectionSlice.reducer;
