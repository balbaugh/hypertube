import {useState} from "react";
import {Link} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import axiosStuff from "../services/axiosStuff";
import InfoText from "./infoText";

const Forgot = () => {
    const [message, setMessage] = useState(null);
    const [email, setEmail] = useState('');
    const {t} = useTranslation();

    const handleEmail = (event) => {
        setEmail(event.target.value)
    }

    const forgotEmail = (event) => {
        event.preventDefault();
        const newEmail = {
            fEmail: email
        }
        axiosStuff
            .forgot(newEmail).then((response) => {
            if (response.message)
                setMessage(response.message)
        })
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    return (
        <div>
            <section className="flex-grow py-10">
                <div className="container px-4 py-10 mx-auto">
                    <div className="max-w-lg mx-auto">
                        <div className="mb-8 text-center">
                            <Link className="inline-block mx-auto mb-6" to="/">
                                <img src={require("../images/hypertubeLogoSm.png")} alt=""/>
                            </Link>
                            <h2 className="mb-2 text-3xl text-slate-300 hover:text-red-500 font-extrabold md:text-4xl">
                                {t('Forgot.title')}
                            </h2>
                            <p className="text-lg font-semibold leading-7 text-red-500">
                                {t('Forgot.subtitle')}
                            </p>
                        </div>
                        <InfoText message={message}/>
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold text-slate-300" htmlFor="username">
                                {t('Forgot.emailLabel')}
                            </label>
                            <input
                                className="text-black inline-block w-full rounded-xl p-4 text-md font-semibold leading-6 placeholder-slate-500 bg-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                type="email"
                                placeholder={t('Forgot.emailLabel')}
                                required
                                onChange={handleEmail}
                            />
                        </div>
                        <button
                            type="submit"
                            className="mb-6 inline-block w-full rounded-xl bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                            onClick={forgotEmail}
                        >
                            {t('Forgot.resetPasswordButton')}
                        </button>
                        <div className="flex flex-wrap justify-center w-full px-4 mb-6 -mx-4 lg:w-auto">
                            <p className="font-semibold text-center text-slate-300">
                                {t('Forgot.haveAccount')}{"  "}
                                <Link className="text-red-500 hover:underline" to="/login">
                                    {t('Forgot.signInLink')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Forgot;
