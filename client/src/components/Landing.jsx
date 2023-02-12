// import {useEffect, useState} from "react";
// import axiosStuff from "../services/axiosStuff";
// import Loader from "./Loader";

const Landing = () => {
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 5000)
    // }, [])

    return (
        <div>
            {/* {loading ? (
                <div className="py-20">
                    <Loader/>
                </div>
            ) : ( */}
                <section>
                    <div className="h-screen bg-center bg-cover"
                         style={{backgroundImage: `url(${require("../images/landingPage.png")})`}}
                    >
                        <div
                            className="h-screen"
                            style={{
                                background: "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <div
                                className="w-full max-w-lg p-2"
                            >
                                <div className="mb-8 text-center">
                                    <div className="inline-block mx-auto mb-6">
                                        <img src={require("../images/hypertubeLogoSm.png")} alt=""/>
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-slate-300 md:text-4xl">
                                        Limitless Streaming
                                    </h2>
                                    <p className="text-2xl font-semibold text-red-500">
                                        Why rent when you can torRent?
                                    </p>
                                </div>
                                <form>

                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="w-6 h-6 mt-1 text-gray-500 dark:text-gray-400"
                                                fill="gray" stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                <path
                                                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                            </svg>

                                        </div>
                                        <input type="search" id="default-search"
                                               className="block w-full p-4 pl-10 border border-gray-300 rounded-lg text-md text-slate-200 bg-gray-50 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                               placeholder="Email address" required/>
                                        <button type="submit"
                                                className="font-semibold leading-6 text-slate-200 absolute right-2.5 bottom-2.5 bg-red-500 rounded-lg text-sm px-4 py-2">Get
                                            Started
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div
                        className="border-t-[3px] border-zinc-700"
                        style={{background: "linear-gradient(#000103, #262629)"}}
                    >
                        <div className="container items-center px-4 pt-8 pb-8 mx-auto">
                            <div className="flex flex-wrap items-center">
                                <div className="w-full mb-8 md:mb-0">
                                    <div className="flex items-center w-full flex-column">
                                        <div className="flex flex-row w-full pt-8 text-center landing-div">
                                            <div className="w-1/2 pb-6 mt-4 text-center">
                                                <h1 className="text-4xl font-extrabold text-slate-300 hover:text-red-500">
                                                    Enjoy...
                                                </h1>
                                                <br/>
                                                <p className="text-xl font-semibold text-red-500">
                                                    Only the best on Hypertube.
                                                </p>
                                            </div>
                                            <div className="w-1/2">
                                                <img
                                                    className="h-3/4 rounded-2xl"
                                                    src={require("../images/collageLanding.png")}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

            {/* )} */}
        </div>
    )
}

export default Landing;

// <section className="flex-grow">
//     <div className="=text-center">
//         <img
//             className="w-max h-max"
//             src={require("../images/landingPage.png")} alt=""
//         />
//     </div>
//     <div className="container px-4 py-10 mx-auto">
//
//         <div
//             className="max-w-lg mx-auto"
//         >
//
//             <div className="mb-8 text-center">
//                 <h2 className="mb-2 text-3xl font-extrabold text-slate-300 hover:text-red-500 md:text-4xl">
//                     Sign In
//                 </h2>
//                 <p className="text-lg font-semibold leading-7 text-red-500">
//                     Find your perfect match
//                 </p>
//             </div>
//             <form>
//                 <div className="mb-6">
//                     <label className="block mb-2 font-semibold text-slate-300" htmlFor="username">
//                         Username
//                     </label>
//                     <input
//                         className="inline-block w-full p-4 font-semibold leading-6 placeholder-black rounded text-md bg-slate-200"
//                         type="text"
//                         placeholder="Username"
//                     />
//                 </div>
//                 {/*<button*/}
//                 {/*    type="submit"*/}
//                 {/*    className="inline-block w-full px-6 py-4 mb-6 text-lg font-semibold leading-6 text-center bg-red-500 rounded text-slate-200"*/}
//                 {/*    // style={{backgroundColor: "#71d343"}}*/}
//                 {/*>*/}
//                 {/*    Sign in*/}
//                 {/*</button>*/}
//             </form>
//         </div>
//     </div>
// </section>