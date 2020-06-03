import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profileAction';

const Profile = ({ match, getProfileById, profileProps: { profile, loading }, authProps }) => {

    useEffect(() => {
        getProfileById(match.params.profile_id);
        
    }, [getProfileById,match.params.profile_id])
    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> : <Fragment>
                <Link to='/profiles' className='btn btn-light'>Back to Profiles</Link>
                {authProps.isAuthenticated && authProps.loading === false && authProps.user._id === profile.user._id && (
                    <Link to='/edit-profile' className='btn btn-dark'>Edit Profile</Link>
                ) }
            </Fragment>}
        </Fragment>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profileProps: PropTypes.object.isRequired,
    authProps: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    profileProps: state.profileReducer,
    authProps: state.authReducer
})

export default connect(mapStateToProps, { getProfileById })(Profile);
