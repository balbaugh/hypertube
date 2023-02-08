import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axiosStuff from "../services/axiosStuff";
import Loader from "./Loader";

const RegForm = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosStuff
            .movieTest().then((response) => {
            console.log('oikee', response)
        })
        axiosStuff
            .test().then((response1) => {
            console.log('testi', response1)
        })
        setTimeout(() => {
            setLoading(false);
        }, 5000)
    }, [])

    return (
        <div>
            {loading ? (
                <div className="py-20">
                    <Loader/>
                </div>
            ) : (
                <section className="flex-grow py-10">
                    <div className="container px-4 py-10 mx-auto">
                        <div className="max-w-lg mx-auto">
                            <div className="mb-8 text-center">
                                <Link className="inline-block mx-auto mb-6" to="/">
                                    <img src={require("../images/hypertubeLogoSm.png")} alt=""/>
                                </Link>
                                <h2 className="mb-2 text-3xl text-slate-300 hover:text-red-500 font-extrabold md:text-4xl">
                                    Sign Up
                                </h2>
                                <p className="text-lg font-semibold leading-7 text-red-500">
                                    Enter the Hypertubes
                                </p>
                            </div>
                            <form>
                                <div className="mb-6">
                                    <label className="block mb-2 font-semibold text-slate-300" htmlFor="username">
                                        Email
                                    </label>
                                    <input
                                        className="inline-block w-full p-4 text-md font-semibold leading-6 placeholder-slate-500 bg-slate-200 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                        type="email"
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block mb-2 font-semibold text-slate-300" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        className="inline-block w-full p-4 text-md font-semibold leading-6 placeholder-slate-500 bg-slate-200 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                        type="password"
                                        placeholder="Password..."
                                        autoComplete='off'
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mb-6 inline-block w-full rounded bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                                >
                                    Sign Up
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
            )}
        </div>
    )
}

export default RegForm;
