import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import axiosStuff from '../services/axiosStuff';
import InfoText from './infoText';

function useForgot2() {
	const { token } = useParams();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [message, setMessage] = useState(null);
	const [passwordReg, setPasswordReg] = useState('');
	const [passwordCReg, setCPasswordReg] = useState('');

	useEffect(() => {
		axiosStuff.getForgot(token).then((response) => {
			// console.log('ta', response)
			if (response.message) setMessage(response.message);
			if (response.rowCount === 1) {
				setEmail(response.rows[0].email);
				setUsername(response.rows[0].username);
			} else {
				setTimeout(() => {
					window.location.replace('/');
				}, 1000);
			}
		});
	}, [token]);

	const handlePasswordReg = (event) => {
		setPasswordReg(event.target.value);
	};

	const handleCPasswordReg = (event) => {
		setCPasswordReg(event.target.value);
	};

	const changePasswd = (event) => {
		event.preventDefault();
		const newPw = {
			password: passwordReg,
			confPasswd: passwordCReg,
			user: username,
		};
		axiosStuff.newPw(newPw).then((response) => {
			setMessage(response.message);
		});
		setTimeout(() => {
			setMessage(null);
		}, 5000);
		event.target.reset();
	};

	return {
		email,
		username,
		message,
		handlePasswordReg,
		handleCPasswordReg,
		changePasswd,
	};
}

function Forgot2({ token }) {
	const {
		email,
		username,
		message,
		handlePasswordReg,
		handleCPasswordReg,
		changePasswd,
	} = useForgot2(token);
	return (
		<section className="flex-grow py-10">
			<div className="container px-4 py-10 mx-auto">
				<div className="max-w-lg mx-auto">
					<div className="mb-8 text-center">
						<Link className="inline-block mx-auto mb-6" to="/">
							<img
								src="nigodo-assets/logo-icon-nigodo.svg"
								alt=""
							/>
						</Link>
						<h2 className="mb-2 text-3xl font-extrabold md:text-4xl">
							New Password
						</h2>
						<p className="text-lg font-extrabold leading-7 text-red-500">
							Username: {username}
						</p>
						<p className="text-lg font-extrabold leading-7 text-red-500">
							Email: {email}
						</p>
					</div>
					<InfoText message={message} />
					<form onSubmit={changePasswd}>
						<div className="mb-6">
							<label
								className="block mb-2 font-extrabold"
								htmlFor="password"
							>
								Password
							</label>
							<input
								className="inline-block w-full p-4 text-lg font-extrabold leading-6 text-black placeholder-indigo-900 bg-white border-2 border-indigo-900 rounded shadow"
								type="password"
								placeholder="Password..."
								id="password"
								required
								autoComplete="off"
								onChange={handlePasswordReg}
							/>
						</div>
						<div className="mb-6">
							<label
								className="block mb-2 font-extrabold"
								htmlFor="password"
							>
								Confirm Password
							</label>
							<input
								className="inline-block w-full p-4 text-lg font-extrabold leading-6 text-black placeholder-indigo-900 bg-white border-2 border-indigo-900 rounded shadow"
								type="password"
								placeholder="Confirm Password..."
								id="confirmPassword"
								required
								autoComplete="off"
								onChange={handleCPasswordReg}
							/>
						</div>
						<button
							type="submit"
							className="inline-block w-full px-6 py-4 mb-6 text-lg font-semibold leading-6 text-center bg-red-500 rounded text-slate-200"
						>
							Change Password
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}

Forgot2.propTypes = {
	token: PropTypes.string,
};

Forgot2.defaultProps = {
	token: '',
};

export default Forgot2;
