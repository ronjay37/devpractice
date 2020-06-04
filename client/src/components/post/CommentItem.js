import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteComment } from "../../actions/postAction";

const CommentItem = ({
  deleteComment,
  post_id,
  comment: { _id, text, name, avatar, user, date },
  authProps
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>
        {!authProps.loading && user === authProps.user._id && (
          <button
            className="btn btn-danger"
            onClick={(e) => deleteComment(post_id, _id)}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  post_id: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  authProps: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  authProps: state.authReducer
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
