import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
    user: {
        id: number;
        email: string;
        name: string;
        role?: string;
        avatarUrl?: string | null;
    } | null;
    token: string | null;
}

const initialState: UserState = {
    user: null,
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<Partial<UserState>>) => {
            if (action.payload.user !== undefined) {
                state.user = action.payload.user;
            }
            if (action.payload.token !== undefined) {
                state.token = action.payload.token;
            }
        },
        setUserData: (state, action: PayloadAction<UserState['user']>) => {
            state.user = action.payload;
        },
        clearAuthData: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setAuthData, setUserData, clearAuthData } = userSlice.actions;
export default userSlice.reducer;
