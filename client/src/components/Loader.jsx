// import { CSSProperties } from 'react';
import ClipLoader from 'react-spinners/CircleLoader';

const override = {
	display: 'block',
	margin: '0 auto',
	// borderColor: 'red'
}

const Loader = () => {
	return (
		<ClipLoader
			color='red'
			size={150}
			cssOverride={override}
			aria-label='Loading spinner'
			data-testid='loader'
		/>
	)

}

export default Loader;