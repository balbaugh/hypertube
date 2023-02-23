import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import axiosStuff from '../services/axiosStuff';
import InfoText from './infoText';

const GITHUB_CLIENT_ID = 'dc9f41e6c78388a47b7c';
const UID_42 =
    'u-s4t2ud-faaf276d86ee3fc2e9ce4eb0498f051d356bf43b5c85848feb0eddd31f9a18e0';

const Login = () => {
    const [message, setMessage] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginsStatus] = useState('');

    const loginWith42 = () => {
        window.location.assign(
            `https://api.intra.42.fr/oauth/authorize?client_id=${UID_42}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhomepage&response_type=code`
        );
    };

    const loginWithGitHub = () => {
        window.location.assign(
            `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`
        );
    };

    const handleUsername = (event) => {
        setUsername(event.target.value.toLowerCase());
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const login = (event) => {
        event.preventDefault();
        const login2 = {
            username,
            password,
        };
        axiosStuff.login(login2).then((response) => {
            if (response.message) setMessage(response.message);
            if (response.result) {
                setLoginsStatus(response.result.rows[0].username);
                setTimeout(() => {
                    window.location.replace('/homepage');
                }, 1000);
            }
        });
        setTimeout(() => {
            setMessage(null);
        }, 8000);
        event.target.reset();
    };

    console.log('loginssttats', loginStatus);

    const {t} = useTranslation();

    return (
        <div>
            <section className="flex-grow py-10">
                <div className="container px-4 py-10 mx-auto">
                    <div className="max-w-lg mx-auto">
                        <div className="mb-8 text-center">
                            <Link className="inline-block mx-auto mb-6" to="/">
                                <img
                                    src={require('../images/hypertubeLogoSm.png')}
                                    alt=""
                                />
                            </Link>
                            <h2 className="mb-2 text-3xl font-extrabold text-slate-300 hover:text-red-500 md:text-4xl">
                                {t('Login.signIn')}
                            </h2>
                            <p className="text-lg font-semibold leading-7 text-red-500">
                                {t('Login.enterHypertubes')}
                            </p>
                        </div>
                        {/* OAUTH STUFF */}
                        <div className="mt-8">
                            <div>
                                <div>
                                    <p className="pb-2 font-semibold text-md text-slate-300">
                                        {t('Login.signInWith')}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        <div>
                                            <button
                                                type="button"
                                                onClick={loginWith42}
                                                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                            >
												<span className="sr-only">
													{t('Login.signInWith42')}
												</span>
                                                <img
                                                    className="w-5 h-5"
                                                    src={require('../images/42.png')}
                                                    alt=""
                                                />
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                type="button"
                                                onClick={loginWithGitHub}
                                                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                            >
												<span className="sr-only">
													{t('Login.signInWithGitHub')}
												</span>
                                                <svg
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative mt-6">
                                <div
                                    className="absolute inset-0 flex items-center"
                                    aria-hidden="true"
                                >
                                    <div className="w-full border-t border-gray-300"/>
                                </div>
                                <div className="relative flex justify-center text-sm">
									<span className="px-2 bg-zinc-900 text-slate-300">
										{t('Login.orContinueWith')}
									</span>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={login}>
                            <InfoText message={message}/>
                            <div className="pt-2 mb-6">
                                <label
                                    className="block mb-2 font-semibold text-slate-300"
                                    htmlFor="username"
                                >
                                    {t('Login.username')}
                                </label>
                                <input
                                    className="inline-block w-full p-4 font-semibold leading-6 text-black rounded-lg text-md placeholder-slate-500 bg-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                    type="text"
                                    placeholder={t('Login.username')}
                                    required
                                    onChange={handleUsername}
                                />
                            </div>
                            <div className="mb-6">
                                <label
                                    className="block mb-2 font-semibold text-slate-300"
                                    htmlFor="password"
                                >
                                    {t('Login.password')}
                                </label>
                                <input
                                    className="inline-block w-full p-4 font-semibold leading-6 text-black rounded-lg text-md placeholder-slate-500 bg-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                    type="password"
                                    placeholder={t('Login.password')}
                                    autoComplete="off"
                                    required
                                    onChange={handlePassword}
                                />
                            </div>
                            <div className="flex flex-wrap justify-center w-full px-4 mb-6 -mx-4 lg:w-auto">
                                <p className="font-semibold text-center text-slate-300">
                                    {t('Login.forgotPassword')}{'  '}
                                    <Link
                                        className="text-red-500 hover:underline"
                                        to="/forgot"
                                    >
                                        {t('Login.clickHere')}
                                    </Link>
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="inline-block w-full px-6 py-4 mb-6 text-lg font-semibold leading-6 text-center bg-red-500 rounded text-slate-200"
                            >
                                {t('Login.signIn')}
                            </button>

                            <div className="flex flex-wrap justify-center w-full px-4 mb-6 -mx-4 lg:w-auto">
                                <p className="font-semibold text-center text-slate-300">
                                    {t('Login.dontHaveAccount')}{'  '}
                                    <Link
                                        className="text-red-500 hover:underline"
                                        to="/registration"
                                    >
                                        {t('Login.signUp')}
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
