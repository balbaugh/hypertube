import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import axiosStuff from "../services/axiosStuff";
import axios from 'axios';
//import InfoText from "./infoText";

//const GITHUB_CLIENT_ID = 'dc9f41e6c78388a47b7c';
//const UID_42 = 'u-s4t2ud-faaf276d86ee3fc2e9ce4eb0498f051d356bf43b5c85848feb0eddd31f9a18e0';

function useProfile() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const params = useParams()

    axios.defaults.withCredentials = true;

    // Get profile infos
    useEffect(() => {
        console.log('params.id:', params.id)
        axiosStuff
            .getUserProfileInfo(params.id)
            .then((response) => {
                setUserId(response.id)
                setUsername(response.username)
                setFirstName(response.firstname)
                setLastName(response.lastname)
                setProfilePic(response.path)
            })
    }, [params.id])

    return {
        userId, username, firstName, lastName, profilePic
    }
}

const UserProfile = () => {
    //const [message, setMessage] = useState(null);
    const {username, firstName, lastName, profilePic} = useProfile();
    const {t} = useTranslation();

    return (
        <div>
            <section className="flex-grow py-10">
                <div className="container px-4 py-10 mx-auto">
                    <div className="max-w-lg mx-auto">
                        <div className="mb-8 text-center">
                            <Link className="inline-block mx-auto mb-6" to="/">
                                <img src={require("../images/hypertubeText.png")} alt=""/>
                            </Link>
                            <div className="inline-block mx-auto mb-6 w-60 h-60">
                                <img src={profilePic} alt=""/>
                            </div>
                        </div>
                        {/* OAUTH STUFF */}
                        {/*<InfoText message={message}/>*/}
                        <div className="pt-2 mb-6">
                            <div className="block mb-2">
                                <p className="block mb-2 text-xl font-semibold text-red-500">{t('UserProfile.username')}:</p>
                                <p className="block pl-3 mb-2 text-lg font-semibold text-gray-200">{username ? username : "{t('UserProfile.username_not_found')}"}</p>

                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2">
                                <p className="block mb-2 text-xl font-semibold text-red-500">{t('UserProfile.first_name')}:</p>
                                <p className="block pl-3 mb-2 text-lg font-semibold text-gray-200">{firstName ? firstName : "{t('UserProfile.first_name_not_found')}"}</p>

                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2">
                                <p className="block mb-2 text-xl font-semibold text-red-500">{t('UserProfile.last_name')}:</p>
                                <p className="block pl-3 mb-2 text-lg font-semibold text-gray-200">{lastName ? lastName : "{t('UserProfile.last_name_not_found')}')}"}</p>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default UserProfile;
