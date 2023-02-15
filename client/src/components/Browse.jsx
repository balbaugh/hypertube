import {Fragment, useEffect, useState} from 'react'
import {Dialog, Disclosure, Menu, Popover, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import axiosStuff from "../services/axiosStuff";
import Loader from "./Loader";

const sortOptions = [
    {name: 'Most Popular', href: '/popular', current: true},
    {name: 'Best Rating', href: '/best', current: false},
    {name: 'Newest', href: '/newest', current: false},
    {name: 'Rating: High to Low', href: '/high', current: false},
    {name: 'Rating: Low to High', href: '/low', current: false},

]
const filters = [
    {
        id: 'category',
        name: 'Category',
        options: [
            {value: 'New-Arrivals', label: 'New Arrivals', checked: false},
            {value: 'Action', label: 'Action', checked: true},
            {value: 'Animation', label: 'Animation', checked: false},
            {value: 'Comedy', label: 'Comedy', checked: false},
            {value: 'Drama', label: 'Drama', checked: false},
        ],
    },
    {
        id: 'rating',
        name: 'Rating',
        options: [
            {value: '5 Stars', label: 'Five Stars', checked: true},
            {value: '4 Stars', label: 'Four Stars', checked: false},
            {value: '3 Stars', label: 'Three Stars', checked: false},
            {value: '2 Stars', label: 'Two Stars', checked: false},
            {value: '1 Star', label: 'One Star', checked: false},
        ],
    },
    {
        id: 'release',
        name: 'Release Date',
        options: [
            {value: '1990s', label: '1990s', checked: true},
            {value: '2000s', label: '2000s', checked: false},
            {value: '2010w', label: '2010s', checked: false},
            {value: '2020s', label: '2020s', checked: false},
        ],
    },
]
const activeFilters = [{value: 'Action', label: 'Action', key: 'category'}, {value: '5 Stars', label: 'Five Stars', key: 'rating'}, {value: '1990s', label: '1990s', key: 'release'}]
const films = [
    {
        id: 1,
        name: 'Face/Off',
        href: '/film/1',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
    {
        id: 2,
        name: 'Face/Off',
        href: 'film/2',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
    {
        id: 3,
        name: 'Face/Off',
        href: 'film/3',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
    {
        id: 4,
        name: 'Face/Off',
        href: 'film/4',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
    {
        id: 5,
        name: 'Face/Off',
        href: 'film/2',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
    {
        id: 6,
        name: 'Face/Off',
        href: 'film/3',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
    {
        id: 7,
        name: 'Face/Off',
        href: 'film/4',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
    {
        id: 8,
        name: 'Face/Off',
        href: 'film/4',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
    {
        id: 9,
        name: 'Face/Off',
        href: 'film/2',
        release: '(1997)',
        imageSrc: 'https://i.redd.it/e8h59iazf7a41.jpg',
        imageAlt: 'Face/Off Cover Image.',
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Browse = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosStuff
            .movieTest().then((response) => {
            console.log('oikee', response)
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
                <section>
                    <div className="">
                        <div className="relative">
                            <div>
                                {/* Mobile filter dialog */}
                                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                                    <Dialog as="div" className="relative z-40 sm:hidden" onClose={setMobileFiltersOpen}>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="transition-opacity ease-linear duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="transition-opacity ease-linear duration-300"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="fixed inset-0 bg-black bg-opacity-25"/>
                                        </Transition.Child>

                                        <div className="fixed inset-0 z-40 flex">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="transition ease-in-out duration-300 transform"
                                                enterFrom="translate-x-full"
                                                enterTo="translate-x-0"
                                                leave="transition ease-in-out duration-300 transform"
                                                leaveFrom="translate-x-0"
                                                leaveTo="translate-x-full"
                                            >
                                                <Dialog.Panel
                                                    className="relative flex flex-col w-full h-full max-w-xs py-4 pb-12 ml-auto overflow-y-auto bg-white shadow-xl">
                                                    <div className="flex items-center justify-between px-4">
                                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                                        <button
                                                            type="button"
                                                            className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
                                                            onClick={() => setMobileFiltersOpen(false)}
                                                        >
                                                            <span className="sr-only">Close menu</span>
                                                            <XMarkIcon className="w-6 h-6" aria-hidden="true"/>
                                                        </button>
                                                    </div>

                                                    {/* Filters */}
                                                    <form className="mt-4">
                                                        {filters.map((section) => (
                                                            <Disclosure as="div" key={section.name}
                                                                        className="px-4 py-6 border-t border-gray-200">
                                                                {({open}) => (
                                                                    <>
                                                                        <h3 className="flow-root -mx-2 -my-3">
                                                                            <Disclosure.Button
                                                                                className="flex items-center justify-between w-full px-2 py-3 text-sm text-gray-400 bg-white">
                                                                    <span
                                                                        className="font-medium text-gray-900">{section.name}</span>
                                                                                <span
                                                                                    className="flex items-center ml-6">
                                  <ChevronDownIcon
                                      className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                      aria-hidden="true"
                                  />
                                </span>
                                                                            </Disclosure.Button>
                                                                        </h3>
                                                                        <Disclosure.Panel className="pt-6">
                                                                            <div className="space-y-6">
                                                                                {section.options.map((option, optionIdx) => (
                                                                                    <div key={option.value}
                                                                                         className="flex items-center">
                                                                                        <input
                                                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                                            name={`${section.id}[]`}
                                                                                            defaultValue={option.value}
                                                                                            type="checkbox"
                                                                                            defaultChecked={option.checked}
                                                                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                                            className="ml-3 text-sm text-gray-500"
                                                                                        >
                                                                                            {option.label}
                                                                                        </label>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </Disclosure.Panel>
                                                                    </>
                                                                )}
                                                            </Disclosure>
                                                        ))}
                                                    </form>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </Dialog>
                                </Transition.Root>

                                <main>
                                    <div className="bg-blueGray-100">
                                        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                            <h1 className="text-3xl font-bold tracking-tight text-gray-200">Browse Films</h1>
                                            <p className="max-w-xl mt-4 text-sm text-gray-200">
                                                Our thoughtfully curated collection of films, hand-picked for you.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Filters */}
                                    <section aria-labelledby="filter-heading">
                                        <h2 id="filter-heading" className="text-gray-200 sr-only">
                                            Filters
                                        </h2>

                                        <div className="border-b-[3px] border-zinc-700 bg-blueGray-100 pb-4">
                                            <div
                                                className="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                                <Menu as="div" className="relative inline-block text-left">
                                                    <div>
                                                        <Menu.Button
                                                            className="inline-flex justify-center text-sm font-medium text-gray-200 group hover:text-gray-300">
                                                            Sort
                                                            <ChevronDownIcon
                                                                className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-200 group-hover:text-gray-300"
                                                                aria-hidden="true"
                                                            />
                                                        </Menu.Button>
                                                    </div>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items
                                                            className="absolute left-0 z-10 w-40 mt-2 origin-top-left rounded-md shadow-2xl bg-blueGray-400 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <div className="py-1">
                                                                {sortOptions.map((option) => (
                                                                    <Menu.Item key={option.name}>
                                                                        {({active}) => (
                                                                            <a
                                                                                href={option.href}
                                                                                className={classNames(
                                                                                    option.current ? 'font-medium text-gray-200' : 'text-gray-200',
                                                                                    active ? 'bg-blueGray-400' : '',
                                                                                    'block px-4 py-2 text-sm'
                                                                                )}
                                                                            >
                                                                                {option.name}
                                                                            </a>
                                                                        )}
                                                                    </Menu.Item>
                                                                ))}
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>

                                                <button
                                                    type="button"
                                                    className="inline-block text-sm font-medium text-gray-200 hover:text-gray-300 sm:hidden"
                                                    onClick={() => setMobileFiltersOpen(true)}
                                                >
                                                    Filter Options
                                                </button>

                                                <div className="hidden sm:block">
                                                    <div className="flow-root">
                                                        <Popover.Group
                                                            className="flex items-center -mx-4 divide-x divide-zinc-700">
                                                            {filters.map((section, sectionIdx) => (
                                                                <Popover key={section.name}
                                                                         className="relative inline-block px-4 text-left">
                                                                    <Popover.Button
                                                                        className="inline-flex justify-center text-sm font-medium text-gray-200 group hover:text-gray-300">
                                                                        <span>{section.name}</span>
                                                                        {sectionIdx === 0 ? (
                                                                            <span
                                                                                className="ml-1.5 rounded bg-blueGray-100 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-200">
                                                                1
                                                              </span>
                                                                        ) : null}
                                                                        <ChevronDownIcon
                                                                            className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </Popover.Button>

                                                                    <Transition
                                                                        as={Fragment}
                                                                        enter="transition ease-out duration-100"
                                                                        enterFrom="transform opacity-0 scale-95"
                                                                        enterTo="transform opacity-100 scale-100"
                                                                        leave="transition ease-in duration-75"
                                                                        leaveFrom="transform opacity-100 scale-100"
                                                                        leaveTo="transform opacity-0 scale-95"
                                                                    >
                                                                        <Popover.Panel
                                                                            className="absolute right-0 z-10 p-4 mt-2 origin-top-right bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                            <form className="space-y-4">
                                                                                {section.options.map((option, optionIdx) => (
                                                                                    <div key={option.value}
                                                                                         className="flex items-center">
                                                                                        <input
                                                                                            id={`filter-${section.id}-${optionIdx}`}
                                                                                            name={`${section.id}[]`}
                                                                                            defaultValue={option.value}
                                                                                            type="checkbox"
                                                                                            defaultChecked={option.checked}
                                                                                            className="w-4 h-4 text-gray-200 border-gray-300 rounded focus:ring-gray-500"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                                            className="pr-6 ml-3 text-sm font-medium text-gray-200 whitespace-nowrap"
                                                                                        >
                                                                                            {option.label}
                                                                                        </label>
                                                                                    </div>
                                                                                ))}
                                                                            </form>
                                                                        </Popover.Panel>
                                                                    </Transition>
                                                                </Popover>
                                                            ))}
                                                        </Popover.Group>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Active filters */}
                                        <div className="bg-blueGray-100 border-b-[3px] border-zinc-700">
                                            <div
                                                className="px-4 py-3 mx-auto max-w-7xl sm:flex sm:items-center sm:px-6 lg:px-8">
                                                <h3 className="text-sm font-medium text-gray-200">
                                                    Active Filters
                                                    <span className="sr-only">, active</span>
                                                </h3>

                                                <div aria-hidden="true"
                                                     className="hidden w-px h-5 bg-gray-400 sm:ml-4 sm:block"/>

                                                <div className="mt-2 sm:mt-0 sm:ml-4">
                                                    <div className="flex flex-wrap items-center -m-1">
                                                        {activeFilters.map((activeFilter) => (
                                                            <span
                                                                key={activeFilter.value}
                                                                className="m-1 inline-flex items-center rounded-full bg-gray-200 py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                                                            >
                                                <span>{activeFilter.label}</span>
                                                <button
                                                    type="button"
                                                    className="inline-flex flex-shrink-0 w-4 h-4 p-1 ml-1 text-gray-800 rounded-full hover:bg-gray-200 hover:text-gray-900"
                                                >
                                                  <span
                                                      className="sr-only">Remove filter for {activeFilter.label}</span>
                                                  <svg className="w-2 h-2" stroke="currentColor" fill="none"
                                                       viewBox="0 0 8 8">
                                                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7"/>
                                                  </svg>
                                                </button>
                                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Film grid */}
                                    <section
                                        aria-labelledby="films-heading"
                                        className="max-w-2xl px-4 pt-12 pb-16 mx-auto sm:px-6 sm:pt-16 sm:pb-24 lg:max-w-7xl lg:px-8"
                                    >
                                        <h2 id="films-heading" className="sr-only">
                                            Films
                                        </h2>

                                        <div
                                            className="grid grid-cols-3 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                            {films.map((film) => (
                                                <a key={film.id} href={film.href} className="group">
                                                    <div
                                                        className="w-full overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
                                                        <img
                                                            src={film.imageSrc}
                                                            alt={film.imageAlt}
                                                            className="object-center w-full h-full object-fit group-hover:opacity-75"
                                                        />
                                                    </div>
                                                    <h3 className="mt-4 text-sm text-gray-200">{film.name}</h3>
                                                    <p className="mt-1 text-lg font-medium text-gray-300">{film.release}</p>
                                                </a>
                                            ))}
                                        </div>
                                    </section>
                                </main>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Browse
