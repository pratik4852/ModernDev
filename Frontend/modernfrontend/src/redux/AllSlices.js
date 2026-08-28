import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  ""
);

const postAuthRequest = async (endpoint, payload, rejectWithValue) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data.message || "Request failed");
    }

    return data;
  } catch (err) {
    return rejectWithValue(err.message || "Network error");
  }
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (body, { rejectWithValue }) => {
    return postAuthRequest("/api/auth/signup", body, rejectWithValue);
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (body, { rejectWithValue }) => {
    return postAuthRequest("/api/auth/signin", body, rejectWithValue);
  }
);

const getTokenFromResponse = (payload) =>
  payload?.token || payload?.data?.token || payload?.accessToken || null;

const getUserFromResponse = (payload) =>
  payload?.user || payload?.data?.user || payload?.data || payload?.result || null;

const loadPersistedAuth = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  try {
    const auth = JSON.parse(window.localStorage.getItem("auth") || "{}");

    return {
      token: auth.token || null,
      user: auth.user || null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const persistAuth = (token, user) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    "auth",
    JSON.stringify({
      token,
      user,
    })
  );
};

const clearPersistedAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("auth");
};

const persistedAuth = loadPersistedAuth();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: persistedAuth.token,
    user: persistedAuth.user,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.success = false;
      clearPersistedAuth();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        const token = getTokenFromResponse(action.payload);
        const user = getUserFromResponse(action.payload);

        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = user;
        state.token = token;
        persistAuth(token, user);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Signup failed";
        state.success = false;
      })
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signin.fulfilled, (state, action) => {
        const token = getTokenFromResponse(action.payload);
        const user = getUserFromResponse(action.payload);

        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = user;
        state.token = token;
        persistAuth(token, user);
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Signin failed";
        state.success = false;
      });
  },
});

export const { logout, clearAuthError, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
