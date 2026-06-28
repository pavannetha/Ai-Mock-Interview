import axios from "axios";
import React, { useEffect, useReducer } from "react";

export default function Reducer() {
  const STAGES = {
    FETCH_START: "fatch_start",
    FETCH_SECCESSFULL: "fecth_successfull",
    FECTH_FAILED: "fetch_failed",
  };
  const intialState = {
    users: {},
    isLoading: false,
    err: null,
  };
  function reducer(state, action) {
    switch (action.type) {
      case STAGES.FETCH_START:
        return { ...state, isLoading: true };
      case STAGES.FETCH_SECCESSFULL:
        return { ...state, isLoading: false, users: action.payload };
      case STAGES.FECTH_FAILED:
        return { ...state, isLoading: false, err: action.err };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, intialState);

  async function getUsers() {
    dispatch({ type: STAGES.FETCH_START });
    try {
      setTimeout(async () => {
        const data = await axios.get(`https://dummyjson.com/users`);
        const usersData = data.data.users;
        console.log(usersData);
        dispatch({ type: STAGES.FETCH_SECCESSFULL, payload: usersData });
      }, 2000);
    } catch (err) {
      console.log(err.message);
      dispatch({
        type: STAGES.FECTH_FAILED,
        err: "Failed to load Data...........",
      });
    }
  }
  useEffect(() => {
    getUsers();
  }, []);
  console.log(state);
  return <div></div>;
}
