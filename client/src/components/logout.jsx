import axios from "axios";
import PropTypes from 'prop-types';
import {useEffect} from "react";
import {useTranslation} from 'react-i18next';

function useLogout(loggedIn, setLoggedIn) {

    axios.defaults.withCredentials = true // For the sessions the work

    useEffect(() => {
        axios.get('http://localhost:3001/logout')
        // .then(() => {
        setLoggedIn(false)
        // })
        setTimeout(() => {
            window.location.replace('/');
        }, 2000)
    }, [setLoggedIn, loggedIn])
}

function Logout({loggedIn, setLoggedIn}) {
    useLogout(loggedIn, setLoggedIn);

    const {t} = useTranslation();

    return (
        <div className="font-semibold text-xl text-red-500">{t('logout.Logged_Out')}</div>
    )
}

Logout.propTypes = {
    setLoggedIn: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired

}

export default Logout;
