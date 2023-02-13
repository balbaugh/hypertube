import {Fragment, useEffect, useState} from 'react'
import searchTorrents from "../services/searchTorrents";
import Loader from "./Loader";
import axiosStuff from "../services/axiosStuff";

const List = () => {
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const results = await searchTorrents(query);

        searchTorrents().then(results => setSearchResults(results));
    };

    return (
        <div>
            {loading ? (
                <div className="py-20">
                    <Loader/>
                </div>
            ) : (
        <section>
            <div className="relative">
                <main>
                    <div className="">
                        <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-200">Browse Films</h1>
                            <p className="mt-4 max-w-xl text-sm text-gray-200">
                                Our thoughtfully curated collection of films, hand-picked for you.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <form className="search-form text-gray-600" onSubmit={handleSubmit}>
                            <label htmlFor="default-search"
                                   className="mb-2 text-sm font-medium text-gray-900 sr-only ">Search</label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500"
                                         fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <input type="search" id="default-search"
                                       className="block w-full p-4 pl-10 text-sm text-gray-900 rounded-lg bg-gray-50 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                                       placeholder="Search for a stream..." value={query} onChange={(event) => setQuery(event.target.value)} required />
                                <button type="submit"
                                        className="absolute right-2.5 bottom-2.5 rounded-lg text-sm px-4 pb-1">
                                    <svg aria-hidden="true" className="" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                        <path fill="none" d="M0 0h24v24H0V0z"/>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>

                {/* Film grid */}
                        <section
                            aria-labelledby="films-heading"
                            className="mx-auto max-w-2xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:max-w-7xl lg:px-8"
                        >
                            <h2 id="products-heading" className="sr-only">
                                Films
                            </h2>

                            <div className="grid grid-cols-3 gap-4">
                                {searchResults.map((result, index) => (
                                    <div key={index} className="relative bg-cover bg-center" style={{backgroundImage: `url(${result.thumbnailUrl})`}}>
                                        <div className="p-4 absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 text-white text-sm">
                                            <p className="font-medium">{result.title}</p>
                                            <p className="font-medium">{result.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                </main>
            </div>
        </section>
            )}
        </div>
    )
}

export default List




