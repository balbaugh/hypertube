import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosStuff from "../services/axiosStuff";
import InfoText from './infoText';

function useGetProfileInfo() {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
	const [message, setMessage] = useState(null);

    useEffect(() => {
        axiosStuff
            .profileInfo()
            .then((response) => {
                setUsername(response.username)
                setFirstname(response.firstname)
                setLastname(response.lastname)
                setEmail(response.email)
            })
    }, [])

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handleFirstnameChange = (event) => {
		setFirstname(event.target.value);
	};
    const handleLastnameChange = (event) => {
		setLastname(event.target.value);
	};

	const submitEditProfile = (event) => {
		event.preventDefault();
		const entries = {
			username: username,
			firstname: firstname,
			lastname: lastname
		}
		axiosStuff
			.updateProfile(entries).then((response) => {
				setMessage(response.message)
			})
		setTimeout(() => {
			setMessage(null);
		}, 5000);
		event.target.reset()
	}

	return {
		email, username, firstname, lastname, message,
		handleUsernameChange, handleFirstnameChange, handleLastnameChange,
		submitEditProfile
	};
}


function ProfileEdit () {

	const { t } = useTranslation();

	const { username, firstname, lastname, message,
        handleUsernameChange, handleFirstnameChange, handleLastnameChange,
		submitEditProfile } = useGetProfileInfo();

	return (
		<section className="flex-grow py-10">
			<div className="container px-4 py-10 mx-auto">
				<div className="max-w-lg mx-auto">
					<div className="mb-8 text-center">
						<Link className="inline-block mx-auto mb-6" to="/">
							<img src={require("../images/hypertubeText.png")} alt="" />
						</Link>
						<h2 className="mb-2 text-3xl font-extrabold md:text-4xl">
							{t('ProfileEdit.update_profile')}
						</h2>
					</div>
					<InfoText message={message} />
					<form onSubmit={submitEditProfile} >
						<div className="mb-6">
							<label
								className="block mb-2 font-extrabold"
								htmlFor="username"
							>
								{t('ProfileEdit.username')}
							</label>
							<input
								className="text-black inline-block w-full p-4 text-lg font-extrabold leading-6 placeholder-indigo-900 bg-white border-2 border-indigo-900 rounded shadow"
								type="text"
								placeholder="Your username here"
								id="username"
                                value={username}
								required autoComplete="off"
								onChange={handleUsernameChange}
							/>
						</div>
						<div className="mb-6">
							<label
								className="block mb-2 font-extrabold"
								htmlFor="firstname"
							>
								{t('ProfileEdit.first_name')}
							</label>
							<input
								className="text-black inline-block w-full p-4 text-lg font-extrabold leading-6 placeholder-indigo-900 bg-white border-2 border-indigo-900 rounded shadow"
								type="text"
								placeholder="Your first name here"
								id="firstname"
                                value={firstname}
								required autoComplete="off"
								onChange={handleFirstnameChange}
							/>
						</div>
                        <div className="mb-6">
							<label
								className="block mb-2 font-extrabold"
								htmlFor="lastname"
							>
								{t('ProfileEdit.last_name')}
							</label>
							<input
								className="text-black inline-block w-full p-4 text-lg font-extrabold leading-6 placeholder-indigo-900 bg-white border-2 border-indigo-900 rounded shadow"
								type="text"
								placeholder="Your last name here"
								id="lastname"
                                value={lastname}
								required autoComplete="off"
								onChange={handleLastnameChange}
							/>
						</div>
						<button
							type="submit"
							className="mb-6 inline-block w-full rounded bg-red-500 py-4 px-6 text-center text-lg font-semibold leading-6 text-slate-200"
						>
							{t('ProfileEdit.save_changes')}
						</button>
					</form>
				</div>
			</div>
		</section>
	)
}

export default ProfileEdit;
