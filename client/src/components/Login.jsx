import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosStuff from '../services/axiosStuff';
import InfoText from './infoText';
// import Loader from "./Loader";

const Login = () => {
	// const [loading, setLoading] = useState(true);

	// useEffect(() => {
	//     setTimeout(() => {
	//         setLoading(false);
	//     }, 5000)
	// }, [])
	const [message, setMessage] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginStatus, setLoginsStatus] = useState('');

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
								<img
									src={require('../images/hypertubeLogoSm.png')}
									alt=""
								/>
							</Link>
							<h2 className="mb-2 text-3xl font-extrabold text-slate-300 hover:text-red-500 md:text-4xl">
								Sign In
							</h2>
							<p className="text-lg font-semibold leading-7 text-red-500">
								Enter the Hypertubes
							</p>
						</div>
						{/* OAUTH STUFF */}
						<div className="mt-8">
							<div>
								<div>
									<p className="pb-2 font-semibold text-md text-slate-300">
										Sign in with
									</p>

									<div className="grid grid-cols-3 gap-3 mt-1">
										<div>
											<a
												href="/auth/facebook"
												className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
											>
												<span className="sr-only">
													Sign in with Facebook
												</span>
												<svg
													className="w-5 h-5"
													aria-hidden="true"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
														clipRule="evenodd"
													/>
												</svg>
											</a>
										</div>

										<div>
											<a
												href="auth/twitter"
												className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
											>
												<span className="sr-only">
													Sign in with Twitter
												</span>
												<svg
													className="w-5 h-5"
													aria-hidden="true"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
												</svg>
											</a>
										</div>

										<div>
											<a
												href="/auth/github"
												className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
											>
												<span className="sr-only">
													Sign in with GitHub
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
											</a>
										</div>
									</div>
								</div>
							</div>
							<div className="relative mt-6">
								<div
									className="absolute inset-0 flex items-center"
									aria-hidden="true"
								>
									<div className="w-full border-t border-gray-300" />
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-2 bg-zinc-900 text-slate-300">
										Or continue with
									</span>
								</div>
							</div>
						</div>
						<form onSubmit={login}>
							<InfoText message={message} />
							<div className="pt-2 mb-6">
								<label
									className="block mb-2 font-semibold text-slate-300"
									htmlFor="username"
								>
									Username
								</label>
								<input
									className="inline-block w-full p-4 font-semibold leading-6 text-black rounded-lg text-md placeholder-slate-500 bg-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
									type="text"
									placeholder="Username"
									required
									onChange={handleUsername}
								/>
							</div>
							<div className="mb-6">
								<label
									className="block mb-2 font-semibold text-slate-300"
									htmlFor="password"
								>
									Password
								</label>
								<input
									className="inline-block w-full p-4 font-semibold leading-6 text-black rounded-lg text-md placeholder-slate-500 bg-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
									type="password"
									placeholder="Password..."
									autoComplete="off"
									required
									onChange={handlePassword}
								/>
							</div>
							<div className="flex flex-wrap justify-center w-full px-4 mb-6 -mx-4 lg:w-auto">
								<p className="font-semibold text-center text-slate-300">
									Forgot your password?{'  '}
									<Link
										className="text-red-500 hover:underline"
										to="/forgot"
									>
										Click Here
									</Link>
								</p>
							</div>
							<button
								type="submit"
								className="inline-block w-full px-6 py-4 mb-6 text-lg font-semibold leading-6 text-center bg-red-500 rounded text-slate-200"
							>
								Sign in
							</button>

							<div className="flex flex-wrap justify-center w-full px-4 mb-6 -mx-4 lg:w-auto">
								<p className="font-semibold text-center text-slate-300">
									Don’t have an account?{'  '}
									<Link
										className="text-red-500 hover:underline"
										to="/registration"
									>
										Sign Up
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
			</section>
			{/* )} */}
		</div>
	);
};

export default Login;
