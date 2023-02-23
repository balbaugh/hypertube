import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const Landing = () => {
    const {t} = useTranslation();

    return (
        <div>
            <section>
                <div className="h-screen bg-cover bg-center"
                     style={{backgroundImage: `url(${require("../images/landingPosters.png")})`}}
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
                            <div className="text-center mb-8">
                                <div className="inline-block mx-auto mb-6">
                                    <img src={require("../images/hypertubeLogoSm.png")} alt=""/>
                                </div>
                                <h2 className="text-3xl text-slate-300 font-extrabold md:text-4xl">
                                    {t('Landing.landing_section_title')}
                                </h2>
                                <p className="pt-1 text-2xl font-semibold text-red-500">
                                    {t('Landing.landing_section_subtitle')}
                                </p>
                            </div>
                            <div className="items-center justify-center">
                                <Link to="/registration">
                                    <button
                                        type="button"
                                        className="mb-6 inline-block w-full rounded-2xl bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
                                    >
                                        {t('Landing.landing_section_button')}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="border-t-[3px] border-zinc-700"
                    style={{background: "linear-gradient(#000103, #262629)"}}
                >
                    <div className="container px-4 pt-8 pb-8 mx-auto items-center">
                        <div className="flex flex-wrap items-center">
                            <div className="w-full mb-8 md:mb-0">
                                <div className="flex flex-column items-center w-full">
                                    <div className="landing-div flex flex-row w-full text-center pt-8">
                                        <div className="w-1/2 text-center pb-6 mt-4">
                                            <h1 className="text-4xl font-extrabold text-slate-300 hover:text-red-500">
                                                {t('Landing.landing_section_header')}
                                            </h1>
                                            <br/>
                                            <p className="text-xl font-semibold text-red-500">
                                                {t('Landing.landing_section_description')}
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
        </div>
    )
}

export default Landing;
