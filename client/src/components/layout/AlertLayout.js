import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

const AlertLayout = ({ alertProps }) => {
    return(
        alertProps !== null && alertProps.length > 0 && alertProps.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            { alert.msg }
        </div>
    ))
    )
}

AlertLayout.propTypes = {
    alertProps: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    alertProps: state.alertReducer
})
export default connect(mapStateToProps)(AlertLayout);
