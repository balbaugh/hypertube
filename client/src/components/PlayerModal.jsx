{/* PLAYER MODAL */}
<Transition.Root show={!open} as={Fragment}>
                                    <Dialog as="div" className="relative z-10" onClose={setOpen}>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                                        </Transition.Child>

                                        <div className="fixed inset-0 z-10 overflow-y-auto">
                                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-out duration-300"
                                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                                    leave="ease-in duration-200"
                                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                >
                                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                                        <div
                                                            className="container p-0 mx-auto"
                                                            style={{ minWidth: '720px', maxHeight: '80vh' }}
                                                        >
                                                {/* *** PLAYER *** */}
                                                            <ReactPlayer
                                                            ref={playerRef}
                                                            url={playMovie}
                                                            playing={true}
                                                            controls={true}
                                                            onError={onError}
                                                            muted={true}
                                                            />
                                                        </div>
                                                        <div className="mt-5 sm:mt-6">
                                                            <button
                                                                type="button"
                                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:text-sm"
                                                                onClick={() => setOpen(!open)}
                                                            >
                                                                Back to Details
                                                            </button>
                                                        </div>
                                                    </Dialog.Panel>
                                                </Transition.Child>
                                            </div>
                                        </div>
                                    </Dialog>
                                </Transition.Root> */}

                                <form className="mt-6">
                                {!watch ? (
                                    <div className="sm:flex-col1 mt-10 flex">
                                        <button
                                            type="button"
                                            className="mx-2 flex max-w-xs flex-1 items-center justify-center rounded-md bg-lime-600 py-3 px-3 text-base font-medium text-white hover:bg-lime-800 sm:w-full"
                                            onClick={startMovie}
                                            // onClick={() => setOpen(!open)}
                                        >
                                            Stream
                                        </button>

                                        {/* <button
                                                                                                                        type="submit"
                                                                                                                        className="mx-2 flex max-w-xs flex-1 items-center justify-center rounded-md bg-red-500 py-3 px-3 text-base font-medium text-white hover:bg-red-700 sm:w-full"
                                                                                                                >
                                                                                                                        Queue
                                                                                                                </button> */}

                                        <button
                                            type="button"
                                            className="ml-4 flex items-center justify-center rounded-md py-3 px-3 text-gray-200 hover:text-red-500"
                                        >
                                            <HeartIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true"/>
                                            <span className="sr-only">Add to favorites</span>
                                        </button>
                                    </div>
                                ) : (null)}
                                </form>