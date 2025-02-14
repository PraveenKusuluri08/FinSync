import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    data: {
        loading: boolean;
        error: object | null;
        token: string | null;
        data: any | null;
    };
}

// Initial State
const initialState: AuthState = {
    data: {
        loading: false,
        error: null,
        token: null,
        data: null,
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Login reducers
        loginRequest: (state: AuthState) => {
            state.data.loading = true;
            state.data.error = null;
            state.data.token = null;
        },
        loginSuccess: (state: AuthState, action: PayloadAction<string>) => {
            state.data.loading = false;
            state.data.token = action.payload;
        },
        loginFailure: (state: AuthState, action: PayloadAction<object | null>) => {
            state.data.loading = false;
            state.data.error = action.payload;
            state.data.token = null;
        },

        // Register reducers
        registerRequest: (state: AuthState) => {
            state.data.loading = true;
            state.data.error = null;
            state.data.data = null;
        },
        registerSuccess: (state: AuthState, action: PayloadAction<any>) => {
            state.data.loading = false;
            state.data.token = action.payload.token ?? null
            state.data.data = action.payload.user;
        },
        registerFailure: (state: AuthState, action: PayloadAction<object | null>) => {
            state.data.loading = false;
            state.data.error = action.payload;
            state.data.data = null;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    registerRequest,
    registerSuccess,
    registerFailure,
} = authSlice.actions;

export default authSlice.reducer;