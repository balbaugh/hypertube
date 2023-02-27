import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axiosStuff from "../services/axiosStuff";
import InfoText from './infoText';

function useGetProfileInfo() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState(null);
    const [passwordReg, setPasswordReg] = useState("");
    const [passwordCReg, setCPasswordReg] = useState('');

    useEffect(() => {
        axiosStuff
            .profileInfo()
            .then((response) => {
                setUsername(response.username)
                setEmail(response.email)
            })
    }, [])

    const handlePasswordReg = (event) => {
        setPasswordReg(event.target.value);
    };

    const handleCPasswordReg = (event) => {
        setCPasswordReg(event.target.value);
    };

    const submitChangePassword = (event) => {
        event.preventDefault();
        const newPw = {
            password: passwordReg,
            confPasswd: passwordCReg,
            user: username
        }
        // console.log('username, password:', username, passwordReg)
        axiosStuff
            .changePw(newPw).then((response) => {
            setMessage(response.message)
        })
        setTimeout(() => {
            setMessage(null);
        }, 5000);
        event.target.reset()
    }

    return {
        email, username, message,
        handlePasswordReg, handleCPasswordReg,
        submitChangePassword
    };
}

function ChangePassword() {
    const {
        email, username, message, handlePasswordReg,
        handleCPasswordReg, submitChangePassword
    } = useGetProfileInfo();
    return (
        <section className="flex-grow py-10">
            <div className="container px-4 py-10 mx-auto">
                <div className="max-w-lg mx-auto">
                    <div className="mb-8 text-center">
                        <Link className="inline-block mx-auto mb-6" to="/">
                            <img src={require('../images/hypertubeText.png')} alt=""/>
                        </Link>
                        <h2 className="mb-2 text-3xl font-extrabold md:text-4xl">
                            Change your password
                        </h2>
                    </div>
                    <InfoText message={message}/>
                    <form onSubmit={submitChangePassword}>
                        <div className="mb-6">
                            <label
                                className="block mb-2 font-extrabold"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                className="text-black inline-block w-full rounded-xl p-4 text-lg font-extrabold leading-6 bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                type="password"
                                placeholder="Password..."
                                id="password"
                                required autoComplete="off"
                                onChange={handlePasswordReg}
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block mb-2 font-extrabold"
                                htmlFor="password"
                            >
                                Confirm Password
                            </label>
                            <input
                                className="text-black inline-block w-full rounded-xl p-4 text-lg font-extrabold leading-6 bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                type="password"
                                placeholder="Confirm Password..."
                                id="confirmPassword"
                                required autoComplete="off"
                                onChange={handleCPasswordReg}
                            />
                        </div>
                        <button
                            type="submit"
                            className="mb-6 inline-block w-full rounded-xl bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ChangePassword;
