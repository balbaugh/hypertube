import React, { useState } from 'react';
import axios from 'axios';
import { Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Nav = ({ itsMe }) => {
	const [isFormVisible, setFormVisible] = useState(false);

	axios.defaults.withCredentials = true; // For the sessions the work


	console.log('ITSMEEE', itsMe.username);


	console.log('ITSMEEE.username || ITSMEE.login', itsMe.username, itsMe.login)


	return (
		<Navbar
			className="bg-zinc-900 border-b-[3px] border-zinc-700"
			fluid={true}
			id="navbar"
			style={{ backgroundColor: '#19191c', borderColor: '#3F3F46' }}
		>
			<Navbar.Brand as={Link} to="/">
				<img
					src={require('../images/hypertubeLogo.png')}
					className="h-12 mr-3 sm:h-9"
					alt="Hypertube Logo"
				/>
			</Navbar.Brand>
			{itsMe.username || itsMe.login ? (
				<>
					<div className="flex">
						{/* Logout Button */}
						<Link className="mr-2 mt-2" to="/logout">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
								stroke="#f05252" className="w-8 h-8">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
							</svg>
						</Link>
						<Navbar.Link href="/profile">
							Welcome, {itsMe.username}
						</Navbar.Link>

						{/* Menu Toggle */}
						<Navbar.Toggle className="mb-1 ml-5 border-2 border-red-500 hover:bg-transparent text-red-500 hover:text-red-500 focus:text-red-500 focus:bg-transparent focus:border-red-500" />

						<Navbar.Collapse>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/homepage"
								style={{ color: "#f05252" }}
							// active={true}
							>
								Home
							</Navbar.Link>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/landing"
								style={{ color: "#f05252" }}
							>
								Landing
							</Navbar.Link>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/login"
								style={{ color: "#f05252" }}
							>
								Login
							</Navbar.Link>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/registration"
								style={{ color: "#f05252" }}
							>
								Registration
							</Navbar.Link>
							<Navbar.Link
								className="bg-zinc-900 font-medium text-red-600 hover:bg-zinc-800 hover:text-red-600"
								href="/profile"
							>
								Profile
							</Navbar.Link>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/forgot"
								style={{ color: "#f05252" }}
							>
								Forgot
							</Navbar.Link>
						</Navbar.Collapse>
					</div >
				</>
			) : (
				<>
					<div className="flex">
						{/* Logout Button */}
						<Link className="mr-2 mt-2" to="/logout">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
								stroke="#f05252" className="w-8 h-8">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
							</svg>
						</Link>


						{/* Menu Toggle */}
						<Navbar.Toggle className="mb-1 ml-1 border-2 border-red-500 hover:bg-transparent text-red-500 hover:text-red-500 focus:text-red-500 focus:bg-transparent focus:border-red-500" />

						<Navbar.Collapse>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/homepage"
								style={{ color: "#f05252" }}
							>
								Home
							</Navbar.Link>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/landing"
								style={{ color: "#f05252" }}
							>
								Landing
							</Navbar.Link>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/login"
								style={{ color: "#f05252" }}
							>
								Login
							</Navbar.Link>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/registration"
								style={{ color: "#f05252" }}
							>
								Registration
							</Navbar.Link>
							<Navbar.Link
								className="font-medium hover:bg-zinc-800 hover:text-red-600"
								href="/forgot"
								style={{ color: "#f05252" }}
							>
								Forgot
							</Navbar.Link>
						</Navbar.Collapse>
					</div >
				</>
			)}
		</Navbar >
	);
};
export default Nav;


{/*<div className="flex-1">*/ }
{/*	{isFormVisible && (*/ }
{/*		<form className="search-form text-gray-600">*/ }
{/*			<label*/ }
{/*				htmlFor="default-search"*/ }
{/*				className="mb-2 text-sm font-medium text-gray-900 sr-only "*/ }
{/*			>*/ }
{/*				Search*/ }
{/*			</label>*/ }
{/*			<div className="relative">*/ }
{/*				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">*/ }
{/*					<svg*/ }
{/*						aria-hidden="true"*/ }
{/*						className="w-5 h-5 text-gray-500"*/ }
{/*						fill="none"*/ }
{/*						stroke="currentColor"*/ }
{/*						viewBox="0 0 24 24"*/ }
{/*						xmlns="http://www.w3.org/2000/svg"*/ }
{/*					>*/ }
{/*						<path*/ }
{/*							strokeLinecap="round"*/ }
{/*							strokeLinejoin="round"*/ }
{/*							strokeWidth="2"*/ }
{/*							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"*/ }
{/*						></path>*/ }
{/*					</svg>*/ }
{/*				</div>*/ }
{/*				<input*/ }
{/*					type="search"*/ }
{/*					id="default-search"*/ }
{/*					className="block w-full p-4 pl-10 text-sm text-gray-900 rounded-lg bg-gray-50 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"*/ }
{/*					placeholder="Search for a stream..."*/ }
{/*					required*/ }
{/*				/>*/ }
{/*				<button*/ }
{/*					type="submit"*/ }
{/*					className="absolute right-2.5 bottom-2.5 rounded-lg text-sm px-4 pb-1"*/ }
{/*				>*/ }
{/*					<svg*/ }
{/*						aria-hidden="true"*/ }
{/*						className=""*/ }
{/*						width="24"*/ }
{/*						height="24"*/ }
{/*						viewBox="0 0 24 24"*/ }
{/*					>*/ }
{/*						<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />*/ }
{/*						<path*/ }
{/*							fill="none"*/ }
{/*							d="M0 0h24v24H0V0z"*/ }
{/*						/>*/ }
{/*					</svg>*/ }
{/*				</button>*/ }
{/*			</div>*/ }
{/*		</form>*/ }
{/*	)}*/ }
{/*</div>*/ }
{/*<div onClick={() => setFormVisible(!isFormVisible)}>*/ }
{/*	<svg*/ }
{/*		aria-hidden="true"*/ }
{/*		className="w-7 h-7 text-red-500 justify-self-end"*/ }
{/*		fill="none"*/ }
{/*		stroke="currentColor"*/ }
{/*		viewBox="0 0 24 24"*/ }
{/*		xmlns="http://www.w3.org/2000/svg"*/ }
{/*	>*/ }
{/*		<path*/ }
{/*			strokeLinecap="round"*/ }
{/*			strokeLinejoin="round"*/ }
{/*			strokeWidth="2"*/ }
{/*			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"*/ }
{/*		></path>*/ }
{/*	</svg>*/ }
{/*</div>*/ }