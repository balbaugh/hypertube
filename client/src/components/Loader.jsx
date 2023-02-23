import ClipLoader from 'react-spinners/CircleLoader';

const override = {
    display: 'block',
    margin: '0 auto',
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