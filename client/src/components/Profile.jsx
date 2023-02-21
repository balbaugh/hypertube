import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axiosStuff from "../services/axiosStuff";
import axios from 'axios';
import InfoText from "./infoText";
// import Loader from "./Loader";

//const GITHUB_CLIENT_ID = 'dc9f41e6c78388a47b7c';
//const UID_42 = 'u-s4t2ud-faaf276d86ee3fc2e9ce4eb0498f051d356bf43b5c85848feb0eddd31f9a18e0';

function useProfile() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState('');

    axios.defaults.withCredentials = true; // sessionit toimii nyt

    // Get profile infos
    useEffect(() => {
        axiosStuff
            .profileInfo()
            .then((response) => {
                setUserId(response.id)
                setUsername(response.username)
                setFirstName(response.firstname)
                setLastName(response.lastname)
                setEmail(response.email)
                setProfilePic(response.path)
            })
    }, [])

    return {
        username, firstName, lastName, email
    }
}

const Profile = ({ itsMe, setItsMe, selectedAvatar, setSelectedAvatar }) => {
    const [message, setMessage] = useState(null);

    const { username, firstName, lastName, email } = useProfile();

    const setProfilePicture = async (event) => {
        const image = event.target.files[0]
        if (image.size > 5242880) {
            setMessage("The maximum size for uploaded images is 5 megabytes.")
        } else {
            let formData = new FormData()
            formData.append('file', image)
            axiosStuff.setProfilePic(formData)
                .then((response) => {
                    if (response.success === true) {
                        setMessage('Profile picture successfully changed!')
                        console.log('response.path:', response.path)
                        setSelectedAvatar(response.path)
                        setItsMe({ path: response.path, ...itsMe })
                    } else {
                        setMessage(response.message);
                    }
                })
            setTimeout(() => {
                setMessage(null);
            }, 8000);
        }
        event.target.value = ''
    }

    const { t } = useTranslation();
    console.log()

    return (
        <div>
            {/* {loading ? (
                <div className="py-20">
                    <Loader/>
                </div>
            ) : ( */}
            <section className="flex-grow py-10">
                <div className="container px-4 py-10 mx-auto">
                    <div className="max-w-lg mx-auto">
                        <div className="mb-8 text-center">
                            <Link className="inline-block mx-auto mb-6" to="/">
                                <img src={require("../images/hypertubeText.png")} alt="" />
                            </Link>
                            <h2 className="mb-2 text-3xl font-extrabold text-slate-300 hover:text-red-500 md:text-4xl">
                                {t('Profile.your_profile')}
                            </h2>
                            <div className="inline-block mx-auto mt-6 mb-6 w-60 h-60">
                                <img className="rounded rounded-full" src={selectedAvatar} alt="" />
                            </div>
                        </div>
                        {/* OAUTH STUFF */}
                        <InfoText message={message} />
                        <div className="pt-2 mb-6">
                            <div className="block mb-2">
                                <p className="block mb-2 text-xl font-semibold text-red-500">{t('Profile.username')}:</p>
                                <p className="block pl-3 mb-2 text-lg font-semibold text-gray-200">{username ? username : "{t('Profile.username_not_found')}"}</p>

                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2">
                                <p className="block mb-2 text-xl font-semibold text-red-500">{t('Profile.first_name')}:</p>
                                <p className="block pl-3 mb-2 text-lg font-semibold text-gray-200">{firstName ? firstName : "{t('Profile.first_name_not_found')}"}</p>

                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2">
                                <p className="block mb-2 text-xl font-semibold text-red-500">{t('Profile.last_name')}:</p>
                                <p className="block pl-3 mb-2 text-lg font-semibold text-gray-200">{lastName ? lastName : "{t('Profile.last_name_not_found')}')}"}</p>

                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2">
                                <p className="block mb-2 text-xl font-semibold text-red-500">{t('Profile.email')}:</p>
                                <p className="block pl-3 mb-2 text-lg font-semibold text-gray-200">{email ? email : "{t('Profile.email_not_found')}')}"}</p>

                            </div>
                        </div>
                        <div className="rounded-md">
                            <label className="block pb-1 text-lg font-semibold text-red-500">{t('Profile.profile_picture')}:</label>
                            <div className="pb-6 mt-1">
                                <button
                                    type="button"
                                    className="inline-block w-full py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <input className="rounded" type="file" name="file" id="set_profilepic" accept="image/jpeg, image/png, image/jpg" onChange={setProfilePicture}></input>
                                </button>
                            </div>
                        </div>
                        <div className="mb-6 border-t divide-y divide-gray-200" />
                        <Link to="/profileEdit">
                            <button
                                type="button"
                                className="inline-block w-full px-6 py-4 mb-6 text-lg font-semibold leading-6 text-center bg-red-500 rounded text-slate-200"
                            >
                                {t('Profile.edit_profile')}
                            </button>
                        </Link>
                        <Link to="/changePassword">
                            <button
                                type="button"
                                className="inline-block w-full px-6 py-4 mb-6 text-lg font-semibold leading-6 text-center bg-red-500 rounded text-slate-200"
                            >
                                {t('Profile.change_password')}
                            </button>
                        </Link>
                        {/*<button*/}
                        {/*    className="inline-block w-full px-6 py-4 mb-6 text-lg font-semibold leading-6 text-center border-2 border-red-500 rounded text-slate-200"*/}
                        {/*>*/}
                        {/*    <label>{t('Profile.profile_picture')}</label>*/}
                        {/*    <br />*/}
                        {/*    <input type="file" name="file" id="set_profilepic" accept="image/jpeg, image/png, image/jpg" onChange={setProfilePicture}></input>*/}
                        {/*</button>*/}

                    </div>
                </div>
            </section>
            {/* )} */}
        </div>
    )
}

export default Profile;
