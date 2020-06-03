import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profileAction';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import DashboardAction from './DashboardAction';
import ExperienceDashboard from './ExperienceDashboard';
import EducationDashboard from './EducationDashboard';


const Dashboard = ({ getCurrentProfile, authProps: { user }, profileProps: { profile, loading }, deleteAccount }) => {
    useEffect(() => {
        getCurrentProfile();
    },[getCurrentProfile])

    return (
        loading && profile === null ? (<Spinner />) : (<Fragment>
            <h1 className='large text-primary'>Dashboard</h1>
            <p className='lead'><i className='fas fa-user'></i>Welcome { user && user.name }</p>
            {profile !== null ? 
            (<Fragment>
                <DashboardAction />
                <ExperienceDashboard experience={profile.experience}  />
                <EducationDashboard education={profile.education}  />
                <div className="my-2">
                    <button onClick={(e) => deleteAccount()} className="btn btn-danger">
                        <i className="fas fa-user-minus"></i>Delete My Account
                    </button>
                </div>
            </Fragment>) : 
            (<Fragment>
                <p>You have not yet setup a profile, please add some information</p>
                <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
            </Fragment>)}
        </Fragment>)
        
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    authProps: PropTypes.object.isRequired,
    profileProps: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    authProps: state.authReducer,
    profileProps: state.profileReducer,
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount  })(Dashboard);
