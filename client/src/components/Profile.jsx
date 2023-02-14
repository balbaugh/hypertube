import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

    axios.defaults.withCredentials = true; // sessionit toimii nyt

    // Get profile infos
    useEffect(() => {
        axiosStuff
            .profileEdit()
            .then((response) => {
                setUserId(response.id)
                setUsername(response.username)
                setFirstName(response.firstname);
                setLastName(response.lastname);
                setEmail(response.email);
            })
    }, [])

    return {
        userId, username, firstName, lastName, email
    }
}


const Profile = () => {
    const [message, setMessage] = useState(null);

    const { userId, username, firstName, lastName, email } = useProfile();

    console.log('Went to profile!!!!')
    console.log('userId in profile', userId)
    console.log('username in profile', username)

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
                                Your profile
                            </h2>
                        </div>
                        {/* OAUTH STUFF */}
                        <InfoText message={message} />
                        <div className="mb-6 pt-2">
                            <div className="block mb-2 font-semibold text-slate-300">
                                Username: {username ? username : "username not found!"}
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2 font-semibold text-slate-300">
                                First name: {firstName ? firstName : "firstName not found!"}
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2 font-semibold text-slate-300">
                                Last name: {lastName ? lastName : "lastName not found!"}
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="block mb-2 font-semibold text-slate-300">
                                Email: {email ? email : "email not found!"}
                            </div>
                        </div>
                        <form action="http://localhost:3000/profileEdit">
                            <button
                                // type="submit"
                                className="mb-6 inline-block w-full rounded bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                            >
                                Edit your profile (Doesn't work yet!)
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            {/* )} */}
        </div>
    )
}

export default Profile;
