// context/AuthContext.js
import { createContext, useReducer, useEffect, useContext } from "react";

// Initial state with localStorage persistence
const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token") || null,
};

// Create the context
const AuthContext = createContext(initialState);

// Reducer to handle login/logout
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Keep localStorage in sync with state
  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [state]);

  // Auth actions
  const login = (user, token) => {
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
