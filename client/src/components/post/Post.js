import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getSinglePost } from "../../actions/postAction";
import PostItem from "../posts/PostItem";
import CommentForm from "../post/CommentForm";
import CommentItem from "./CommentItem";
import AlertLayout from "../layout/AlertLayout";

const Post = ({ getSinglePost, postProps: { post, loading }, match }) => {
  useEffect(() => {
    getSinglePost(match.params.post_id);
  }, [getSinglePost, match.params.post_id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <div className="bg-primary p">
        <h3>Leave a Comment...</h3>
      </div>
      <div className="comments">
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} post_id={post._id} />
        ))}
        <AlertLayout />
        <CommentForm post_id={post._id} />
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getSinglePost: PropTypes.func.isRequired,
  postProps: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  postProps: state.postReducer
});

export default connect(mapStateToProps, { getSinglePost })(Post);

// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import Spinner from "../layout/Spinner";
// import PostItem from "../posts/PostItem";
// import { getSinglePost } from "../../actions/postAction";
// import CommentForm from "../post/CommentForm";
// import CommentItem from "../post/CommentItem";

// const Post = ({ getSinglePost, post: { post, loading }, match }) => {
//   useEffect(() => {
//     getSinglePost(match.params.post_id);
//   }, [getSinglePost, match.params.post_id]);
//   return loading || post === null ? (
//     <Spinner />
//   ) : (
//     <>
//       <Link to="/posts" className="btn">
//         Back to Posts
//       </Link>
//       <PostItem post={post} showActions={false} />
//       <CommentForm post_id={post._id} />
//       <div className="comments">
//         {post.comments.map((comment) => (
//           <CommentItem key={comment._id} comment={comment} post_id={post._id} />
//         ))}
//       </div>
//     </>
//   );
// };

// Post.propTypes = {
//   getSinglePost: PropTypes.func.isRequired,
//   post: PropTypes.object.isRequired
// };

// const mapStateToProps = (state) => ({
//   post: state.postReducer
// });

// export default connect(mapStateToProps, { getSinglePost })(Post);
