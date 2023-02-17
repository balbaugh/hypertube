import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axiosStuff from "../services/axiosStuff";
import axios from 'axios';
import InfoText from "./infoText";
// import Loader from "./Loader";

const GITHUB_CLIENT_ID = 'dc9f41e6c78388a47b7c';
const UID_42 = 'u-s4t2ud-faaf276d86ee3fc2e9ce4eb0498f051d356bf43b5c85848feb0eddd31f9a18e0';

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
        userId, username, firstName, lastName, email, profilePic
    }
}

const Profile = ({ itsMe, setItsMe, setSelectedAvatar }) => {
    const [message, setMessage] = useState(null);

    const { userId, username, firstName, lastName, email, profilePic } = useProfile();

    // if (isLoading) {
    //     return (
    //         <h2 className="mb-2 text-3xl text-slate-300 hover:text-red-500 font-extrabold md:text-4xl">
    //             Loading profile information...
    //         </h2>
    //     )
    // }

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

    // const login = (event) => {
    //     event.preventDefault();
    //     const login2 = {
    //         username,
    //         password,
    //     };
    //     axiosStuff.login(login2)
    //         .then((response) => {
    //             if (response.message)
    //                 setMessage(response.message);
    //             if (response.result) {
    //                 setLoginsStatus(response.result.rows[0].username)
    //                 setTimeout(() => {
    //                     window.location.replace('/homepage')
    //                 }, 1000)
    //             }
    //         });
    //     setTimeout(() => {
    //         setMessage(null);
    //     }, 8000);
    //     event.target.reset();
    // };

    const { t } = useTranslation();

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
                                <img src={require("../images/hypertubeLogoSm.png")} alt="" />
                            </Link>
                            <h2 className="mb-2 text-3xl text-slate-300 hover:text-red-500 font-extrabold md:text-4xl">
                                {t('Profile.your_profile')}
                            </h2>
                        </div>
                        {/* OAUTH STUFF */}
                        <InfoText message={message} />
                        <div className="mb-6 pt-2">
                            <div className="block mb-2 font-semibold text-slate-300">
                                {t('Profile.username')}: {username ? username : "{t('Profile.username_not_found')}"}
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2 font-semibold text-slate-300">
                                {t('Profile.first_name')}: {firstName ? firstName : "{t('Profile.first_name_not_found')}')}"}
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2 font-semibold text-slate-300">
                                {t('Profile.last_name')}: {lastName ? lastName : "{t('Profile.last_name_not_found')}')}"}
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2 font-semibold text-slate-300">
                                {t('Profile.email')}: {email ? email : "email not found! Expected if you're using OAuth."}
                            </div>
                        </div>
                        <Link to="/profileEdit">
                            <button
                                type="button"
                                className="mb-6 inline-block w-full rounded bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                            >
                                {t('Profile.edit_profile')}
                            </button>
                        </Link>
                        <Link to="/changePassword">
                            <button
                                type="button"
                                className="mb-6 inline-block w-full rounded bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                            >
                                Change Password
                            </button>
                        </Link>
                        <Link to="/changeEmail">
                            <button
                                type="button"
                                className="mb-6 inline-block w-full rounded bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                            >
                                Change Email (Doesn't work yet!)
                            </button>
                        </Link>
                        <button
                            className="mb-6 inline-block w-full rounded border-2 border-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                        >
                            <label>Profile Picture</label>
                            <br />
                            <input type="file" name="file" id="set_profilepic" accept="image/jpeg, image/png, image/jpg" onChange={setProfilePicture}></input>
                        </button>
                    </div>
                </div>
            </section>
            {/* )} */}
        </div>
    )
}

export default Profile;
