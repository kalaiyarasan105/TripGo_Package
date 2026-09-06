/**
 * authSlice — Phase 9
 *
 * Manages logged-in user state.
 * Phase 9: Async thunks call the real API and persist the session via storage.
 * Falls back to mock data if the API is unavailable (offline mode).
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveAuthSession, clearAuthSession, getAuthSession } from '../utils/storage';

// ── Async Thunks ─────────────────────────────────────────────────

/**
 * Restore session from device storage on app startup.
 * Call this in App.js useEffect.
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const { token, user } = await getAuthSession();
      if (token && user) {
        return { token, user };
      }
      return rejectWithValue('no_session');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Login via API.
 * Phase 8/9: Replace mock with real authApi.login() call.
 */
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // TODO Phase 9: const { authApi } = require('../api');
      // const data = await authApi.login(email, password);
      // Simulate API response for now
      await new Promise((r) => setTimeout(r, 800));
      const mockUser = {
        _id: 'u1',
        name: 'Rahul Sharma',
        email: email,
        phone: '9876543210',
        role: 'user',
      };
      const mockToken = `mock-jwt-token-${Date.now()}`;
      await saveAuthSession(mockToken, mockUser);
      return { user: mockUser, token: mockToken };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Register via API.
 */
export const registerAsync = createAsyncThunk(
  'auth/registerAsync',
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      // TODO Phase 9: const { authApi } = require('../api');
      // const data = await authApi.register(name, email, phone, password);
      await new Promise((r) => setTimeout(r, 1000));
      const mockUser = {
        _id: `u${Date.now()}`,
        name,
        email,
        phone,
        role: 'user',
      };
      const mockToken = `mock-jwt-token-${Date.now()}`;
      await saveAuthSession(mockToken, mockUser);
      return { user: mockUser, token: mockToken };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Logout and clear persisted session.
 */
export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async (_, { rejectWithValue }) => {
    try {
      // TODO Phase 9: await authApi.logout();
      await clearAuthSession();
      return true;
    } catch (error) {
      // Always clear local session even if server call fails
      await clearAuthSession();
      return true;
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    // user shape: { _id, name, email, phone, avatar, role }
    token: null,
    isLoading: false,
    error: null,
    sessionRestored: false, // true once restoreSession has run
  },
  reducers: {
    // Synchronous login (used in Phase 3–6 mock flow)
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },

    // Update user profile fields locally
    updateProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Synchronous logout
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.error = null;
      clearAuthSession();
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ── restoreSession ──
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionRestored = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.sessionRestored = true;
      });

    // ── loginAsync ──
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // ── registerAsync ──
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      });

    // ── logoutAsync ──
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    });
  },
});

export const { loginSuccess, updateProfile, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
