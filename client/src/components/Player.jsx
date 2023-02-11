// import React, { useCallback, useEffect, useRef, useState} from "react";
// import ReactPlayer from 'react-player'
// import { Link } from "react-router-dom";
// import axiosStuff from "../services/axiosStuff";
// import Loader from "./Loader";

// interface Subtitles {
//     kind: string;
//     label: string;
//     src: string;
//     srcLang: string;
// }

// const Player = ({ movieUrl, subtitles}: { movieUrl: string, subtitles: Subtitles[] | any }) => {
// // const Player = (props: any) => {
//     const [loading, setLoading] = useState(true);
//     const playerRef: any = useRef(null);

//     const onError = useCallback(() => {
//         if(playerRef.current !== null) {
//             playerRef.current.seekTo(0, 'seconds');
//         }
//     }, [playerRef.current])


//     useEffect(() => {
//         axiosStuff
//             .movieTest().then((response) => {
//             console.log('oikee', response)
//         })
//         axiosStuff
//             .test().then((response1) => {
//             console.log('testi', response1)
//         })
//         setTimeout(() => {
//             setLoading(false);
//         }, 5000)
//     }, [])



//     return (
//         <div>
//             {loading ? (
//                 <div className="py-20">
//                     <Loader/>
//                 </div>
//             ) : (
//                 <section className="flex-grow py-10">
//                     <div className="container px-4 py-10 mx-auto">
//                         <div className="max-w-lg mx-auto">
//                             <div className="mb-8 text-center">
//                                 <Link className="inline-block mx-auto mb-6" to="/">
//                                     <img src={require("../images/hypertubeText.png")} alt=""/>
//                                 </Link>
//                             </div>
//                             <div
//                                 className="container p-0 mx-auto"
//                                 style={{ minHeight: '720px', maxHeight: '60vh' }}
//                             >
//                                 <ReactPlayer
//                                     ref={playerRef}
//                                     // url={props.movieUrl}
//                                     url={"https://www.youtube.com/watch?v=oUFJJNQGwhk"}
//                                     controls={true}
//                                     playing={true}
//                                     width="100%"
//                                     onError={onError}
//                                     style={{
//                                         objectFit: 'cover',
//                                         minHeight: '720px',
//                                         maxHeight: '60vh',
//                                         zIndex: '10',
//                                     }}
//                                     config={{
//                                         file: {
//                                             tracks: subtitles,
//                                         },
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             )}
//         </div>
//     )
// }

// export default Player;
