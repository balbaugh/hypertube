import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axiosStuff from "../services/axiosStuff";
// import Loader from "./Loader";
import InfoText from "./infoText";

const Forgot = () => {
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 5000)
    // }, [])

		const [message, setMessage] = useState(null);
		const [email, setEmail] = useState('');

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
                                    <img src={require("../images/hypertubeLogoSm.png")} alt=""/>
                                </Link>
                                <h2 className="mb-2 text-3xl text-slate-300 hover:text-red-500 font-extrabold md:text-4xl">
                                    Forgot Password
                                </h2>
                                <p className="text-lg font-semibold leading-7 text-red-500">
                                    Renter the Hypertubes
                                </p>
                            </div>
															<InfoText message={message} />
                                <div className="mb-6">
                                    <label className="block mb-2 font-semibold text-slate-300" htmlFor="username">
                                        Email
                                    </label>
                                    <input
                                      className="text-black inline-block w-full p-4 text-md font-semibold leading-6 placeholder-slate-500 bg-slate-200 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                      type="email"
                                      placeholder="Email"
                                      required
																			onChange={handleEmail}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mb-6 inline-block w-full rounded bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
																	onClick={forgotEmail}
																>
                                    Reset Password
                                </button>
                                <div className="flex flex-wrap justify-center w-full px-4 mb-6 -mx-4 lg:w-auto">
                                    <p className="font-semibold text-center text-slate-300">
                                        Have an account?{"  "}
                                        <Link className="text-red-500 hover:underline" to="/login">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            {/* )} */}
        </div>
    )
}

export default Forgot;
