import React, { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, PowerIcon, XMarkIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const Nav = ({ itsMe, setItsMe, selectedAvatar }) => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('language', lng); // store selected language in local storage
	};

	useEffect(() => {
		const savedLanguage = localStorage.getItem('language');
		if (savedLanguage) {
			i18n.changeLanguage(savedLanguage);
		}
	}, [selectedAvatar]);

	axios.defaults.withCredentials = true; // For the sessions the work

	const { t } = useTranslation();

	const navigation = [
		{ name: t('Navbar.Home'), href: '/homepage', current: false },
		{ name: t('Navbar.Register'), href: '/registration', current: false },
		{ name: t('Navbar.Forgot'), href: '/forgot', current: false },
		{ name: t('Navbar.About'), href: '/landing', current: false },
	];

	// setItsMe({ ...itsMe, path: selectedAvatar })

	console.log('ITSMEEE.path', itsMe.path);
	console.log('ITSMEEE.username', itsMe.username)
	console.log('ITSMEE.login', itsMe.login)

	return (
		<Disclosure as="nav" className="">
			{({ open }) => (
				<>
					<div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
						<div className="relative flex items-center justify-between h-16">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">
										Open main menu
									</span>
									{open ? (
										<XMarkIcon
											className="block w-6 h-6"
											aria-hidden="true"
										/>
									) : (
										<Bars3Icon
											className="block w-6 h-6"
											aria-hidden="true"
										/>
									)}
								</Disclosure.Button>
							</div>
							<div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
								<div className="flex items-center flex-shrink-0">
									<img
										className="block w-auto h-8 tablet:hidden"
										src={require('../images/favicon64.ico')}
										alt="Hypertube Logo"
									/>
									<img
										className="hidden w-auto h-8 tablet:block"
										src={require('../images/hypertubeLogo.png')}
										alt="Hypertube Logo"
									/>
								</div>
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-4">
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												className={classNames(
													item.current
														? 'bg-gray-900 text-white'
														: 'text-gray-300 hover:bg-gray-700 hover:text-white',
													'px-3 py-2 rounded-md text-sm font-medium'
												)}
												aria-current={
													item.current
														? 'page'
														: undefined
												}
											>
												{item.name}
											</a>
										))}
									</div>
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-0 sm:pr-0">
								{itsMe.username || itsMe.login ? (
									<>
										<a
											href="/logout"
											className="p-1 text-gray-400 bg-gray-800 rounded-full hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
										>
											<span className="sr-only">
												{t('Navbar.SignOut')}
											</span>
											<PowerIcon
												className="w-6 h-6"
												aria-hidden="true"
											/>
										</a>

										{/* Language Dropdown */}
										<Menu
											as="div"
											className="relative ml-4"
										>
											<div>
												<Menu.Button className="flex text-sm text-gray-400 bg-gray-800 rounded-full hover:text-lime-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
													<span className="sr-only">
														Open language menu
													</span>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="w-8 h-8"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
														/>
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
												<Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<Menu.Item>
														{({ active }) => (
															<button
																// href="#"
																onClick={() =>
																	changeLanguage(
																		'en'
																	)
																}
																className={classNames(
																	active
																		? 'w-full bg-gray-100'
																		: '',
																	'w-full block px-4 py-2 text-sm text-gray-700'
																)}
															>
																{t(
																	'Navbar.English'
																)}
															</button>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<button
																// href="#"
																onClick={() =>
																	changeLanguage(
																		'fi'
																	)
																}
																className={classNames(
																	active
																		? 'w-full bg-gray-100'
																		: '',
																	'w-full block px-4 py-2 text-sm text-gray-700'
																)}
															>
																{t(
																	'Navbar.Finnish'
																)}
															</button>
														)}
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>

										{/* Profile dropdown */}
										<Menu
											as="div"
											className="relative ml-4"
										>
											<div>
												<Menu.Button className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-lime-500">
													<span className="sr-only">
														Open user menu
													</span>
													<img
														className="w-8 h-8 rounded-full"
														src={selectedAvatar}
														alt="PP"
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
												<Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<Menu.Item>
														{({ active }) => (
															<a
																href="/profile"
																className={classNames(
																	active
																		? 'bg-gray-100'
																		: '',
																	'block px-4 py-2 text-sm text-gray-700'
																)}
															>
																{t(
																	'Navbar.Profile'
																)}
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="/profileEdit"
																className={classNames(
																	active
																		? 'bg-gray-100'
																		: '',
																	'block px-4 py-2 text-sm text-gray-700'
																)}
															>
																{t(
																	'Navbar.Settings'
																)}
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="/logout"
																className={classNames(
																	active
																		? 'bg-gray-100'
																		: '',
																	'block px-4 py-2 text-sm text-gray-700'
																)}
															>
																{t(
																	'Navbar.SignOut'
																)}
															</a>
														)}
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
									</>
								) : (
									<>
										<Menu
											as="div"
											className="relative mr-1"
										>
											<div>
												<Menu.Button className="flex text-sm text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
													<span className="sr-only">
														Open language menu
													</span>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="w-8 h-8"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
														/>
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
												<Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<Menu.Item>
														{({ active }) => (
															<button
																// href="#"
																onClick={() =>
																	changeLanguage(
																		'en'
																	)
																}
																className={classNames(
																	active
																		? 'w-full bg-gray-100'
																		: '',
																	'w-full block px-4 py-2 text-sm text-gray-700'
																)}
															>
																{t(
																	'Navbar.English'
																)}
															</button>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<button
																// href="#"
																onClick={() =>
																	changeLanguage(
																		'fi'
																	)
																}
																className={classNames(
																	active
																		? 'w-full bg-gray-100'
																		: '',
																	'w-full block px-4 py-2 text-sm text-gray-700'
																)}
															>
																{t(
																	'Navbar.Finnish'
																)}
															</button>
														)}
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
										<a
											href="/login"
											className="inline-flex items-center justify-center px-4 py-2 ml-8 text-base font-medium text-gray-200 border border-transparent rounded-md shadow-sm bg-lime-600 hover:bg-lime-700"
										>
											{t('Navbar.SignIn')}
										</a>
									</>
								)}
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									href={item.href}
									className={classNames(
										item.current
											? 'bg-gray-900 text-white'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'block px-3 py-2 rounded-md text-base font-medium'
									)}
									aria-current={
										item.current ? 'page' : undefined
									}
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
