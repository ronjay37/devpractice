import axios from "axios";
import { setAlert } from "./alertAction";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  CLEAR_PROFILE,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from "../actions/types";

// Get posts
export const getPosts = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE
  });
  try {
    const res = await axios.get("/api/posts");

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });

    window.scrollTo(0, 0);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Add like

export const addLike = (post_id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${post_id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likesProp: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Remove like

export const removeLike = (post_id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${post_id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likesProp: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Remove post

export const deletePost = (post_id) => async (dispatch) => {
  if (window.confirm("Are you sure? This cannot be undone!")) {
    try {
      await axios.delete(`/api/posts/${post_id}`);

      dispatch({
        type: DELETE_POST,
        payload: post_id
      });
      // window.scrollTo(0, 0);
      alert("Post Removed!");
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

//Add post

export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post("/api/posts", formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });
    window.scrollTo(0, 0);
    dispatch(setAlert("Post Created!", "success", 3000));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get single post
export const getSinglePost = (post_id) => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE
  });
  try {
    const res = await axios.get(`/api/posts/${post_id}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
    window.scrollTo(0, 0);
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Add comment

export const addComment = (post_id, formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      `/api/posts/comment/${post_id}`,
      formData,
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });
    window.scrollTo(0, document.body.scrollHeight);
    dispatch(setAlert("Comment Added!", "success", 3000));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Delete comment

export const deleteComment = (post_id, comment_id) => async (dispatch) => {
  if (window.confirm("Are you sure? This cannot be undone!")) {
    try {
      await axios.delete(`/api/posts/comment/${post_id}/${comment_id}`);
      dispatch({
        type: REMOVE_COMMENT,
        payload: comment_id
      });
      alert("Comment Removed!");
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
