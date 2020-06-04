import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profileAction';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';



const Profile = ({ getProfileById, profileProps: { profile, loading }, authProps, match }) => {

    useEffect(() => {
        getProfileById(match.params.profile_id);
        
    }, [getProfileById, match.params.profile_id])

    return (
        <Fragment>
            {profile === null || loading ? <Spinner /> : <Fragment>
                <Link to='/profiles' className='btn btn-light'>Back to Profiles</Link>
                {authProps.isAuthenticated && authProps.loading === false && authProps.user._id === profile.user._id &&
                    <Link to='/edit-profile' className='btn btn-dark'>Edit Profile</Link>}
                
            
            <div className="profile-grid my-1">
                <ProfileTop profileProps={profile} />
                <ProfileAbout profileProps={profile} />
                <div className="profile-exp bg-white p-2">
                    <h2 className="text-primary">Experience</h2>
                    {profile.experience.length > 0 ? <Fragment>
                        {profile.experience.map((exp) => (
                            <ProfileExperience key={exp._id} experienceProps={exp} />
                        ))}
                    </Fragment> : <h4>No experience credentials...</h4>}
                </div>

                <div className="profile-edu bg-white p-2">
                    <h2 className="text-primary">Education</h2>
                    {profile.education.length > 0 ? <Fragment>
                        {profile.education.map((edu) => (
                            <ProfileEducation key={edu._id} educationProps={edu} />
                        ))}
                    </Fragment> : <h4>No education credentials...</h4>}
                </div>

                {profile.githubusername && 
                    <ProfileGithub usernameProps={profile.githubusername} />
                }
            </div>
            </Fragment>}
        </Fragment>

    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profileProps: PropTypes.object.isRequired,
    authProps: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
    profileProps: state.profileReducer,
    authProps: state.authReducer
})


export default connect(mapStateToProps, { getProfileById })(Profile);