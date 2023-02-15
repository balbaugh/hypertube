import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, PowerIcon, XMarkIcon } from '@heroicons/react/24/outline'


const navigation = [
	{ name: 'Home', href: '/homepage', current: false },
	{ name: 'Register', href: '/registration', current: false },
	{ name: 'Forgot', href: '/forgot', current: false },
	{ name: 'About', href: '/about', current: false },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

const Nav = ({ itsMe }) => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	axios.defaults.withCredentials = true; // For the sessions the work

	console.log('ITSMEEE', itsMe.username);

	console.log('ITSMEEE.username || ITSMEE.login', itsMe.username, itsMe.login)

	return (
		<Disclosure as="nav" className="">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<img
										className="block h-8 w-auto lg:hidden"
										src={require('../images/hypertubeLogo.png')}
										alt="Your Company"
									/>
									<img
										className="hidden h-8 w-auto lg:block"
										src={require('../images/hypertubeLogo.png')}
										alt="Your Company"
									/>
								</div>
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-4">
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												className={classNames(
													item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
													'px-3 py-2 rounded-md text-sm font-medium'
												)}
												aria-current={item.current ? 'page' : undefined}
											>
												{item.name}
											</a>
										))}
									</div>
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								{itsMe.username || itsMe.login ? (
									<>
										<a
											href="/logout"
											className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
										>
											<span className="sr-only">Logout</span>
											<PowerIcon className="h-6 w-6" aria-hidden="true" />

										</a>

										{/* Language Dropdown */}
										<Menu as="div" className="relative ml-4">
											<div>
												<Menu.Button className="flex rounded-full text-gray-400 hover:text-white bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
													<span className="sr-only">Open language menu</span>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
														<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
													</svg>
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
												<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<Menu.Item>
														{({ active }) => (
															<a
																href="#"
																onClick={() => changeLanguage('en')}
																className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
															>
																English
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="#"
																onClick={() => changeLanguage('fi')}
																className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
															>
																Finnish
															</a>
														)}
													</Menu.Item>
													{/*<button onClick={() => changeLanguage('en')}>English</button>*/}
													{/*<button onClick={() => changeLanguage('fi')}>Suomi</button>*/}
												</Menu.Items>
											</Transition>
										</Menu>

										{/* Profile dropdown */}
										<Menu as="div" className="relative ml-4">
											<div>
												<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-lime-500">
													<span className="sr-only">Open user menu</span>
													<img
														className="h-8 w-8 rounded-full"
														src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
														alt=""
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
												<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<Menu.Item>
														{({ active }) => (
															<a
																href="/profile"
																className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
															>
																Your Profile
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="/settings"
																className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
															>
																Settings
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="/logout"
																className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
															>
																Sign Out
															</a>
														)}
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
									</>
								) : (
									<>
										<a
											href="/login"
											className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-200 bg-lime-600 hover:bg-lime-700"
										>
											Sign In
										</a>
									</>
								)}

							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 px-2 pt-2 pb-3">
							{navigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									href={item.href}
									className={classNames(
										item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'block px-3 py-2 rounded-md text-base font-medium'
									)}
									aria-current={item.current ? 'page' : undefined}
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};
export default Nav;


// <Navbar
// 	className="bg-zinc-900 border-b-[3px] border-zinc-700"
// 	fluid={true}
// 	id="navbar"
// 	style={{ backgroundColor: '#19191c', borderColor: '#3F3F46' }}
// >
// 	<Navbar.Brand as={Link} to="/">
// 		<img
// 			src={require('../images/hypertubeLogo.png')}
// 			className="h-12 mr-3 sm:h-9"
// 			alt="Hypertube Logo"
// 		/>
// 	</Navbar.Brand>
// 	{itsMe.username || itsMe.login ? (
// 		<>
// 			<div className="flex">
// 				{/* Logout Button */ }
// 				<Link className="mr-2 mt-2" to="/logout">
// 					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
// 						 stroke="#f05252" className="w-8 h-8">
// 						<path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/>
// 					</svg>
// 				</Link>
//
// 				{/* Menu Toggle */ }
// 				<Navbar.Toggle className="mb-1 ml-5 border-2 border-red-500 hover:bg-transparent text-red-500 hover:text-red-500 focus:text-red-500 focus:bg-transparent focus:border-red-500" />
//
// 				<Navbar.Collapse>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/homepage"
// 						style={{ color: "#f05252" }}
// 						// active={true}
// 					>
// 						Home
// 					</Navbar.Link>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/landing"
// 						style={{ color: "#f05252" }}
// 					>
// 						Landing
// 					</Navbar.Link>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/login"
// 						style={{ color: "#f05252" }}
// 					>
// 						Login
// 					</Navbar.Link>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/registration"
// 						style={{ color: "#f05252" }}
// 					>
// 						Registration
// 					</Navbar.Link>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/forgot"
// 						style={{ color: "#f05252" }}
// 					>
// 						Forgot
// 					</Navbar.Link>
// 				</Navbar.Collapse>
// 			</div>
// 		</>
// 	) : (
// 		<>
// 			<div className="flex">
// 				{/* Logout Button */ }
// 				<Link className="mr-2 mt-2" to="/logout">
// 					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
// 						 stroke="#f05252" className="w-8 h-8">
// 						<path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/>
// 					</svg>
// 				</Link>
// 			</div>
//
//
// 				{/* Menu Toggle */ }
// 				<Navbar.Toggle className="mb-1 ml-1 border-2 border-red-500 hover:bg-transparent text-red-500 hover:text-red-500 focus:text-red-500 focus:bg-transparent focus:border-red-500" />
//
// 				<Navbar.Collapse>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/homepage"
// 						style={{ color: "#f05252" }}
// 					>
// 						Home
// 					</Navbar.Link>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/landing"
// 						style={{ color: "#f05252" }}
// 					>
// 						Landing
// 					</Navbar.Link>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/login"
// 						style={{ color: "#f05252" }}
// 					>
// 						Login
// 					</Navbar.Link>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/registration"
// 						style={{ color: "#f05252" }}
// 					>
// 						Registration
// 					</Navbar.Link>
// 					<Navbar.Link
// 						className="font-medium hover:bg-zinc-800 hover:text-red-600"
// 						href="/forgot"
// 						style={{ color: "#f05252" }}
// 					>
// 						Forgot
// 					</Navbar.Link>
// 				</Navbar.Collapse>
//
// 		</>
// 	)}
// </Navbar>