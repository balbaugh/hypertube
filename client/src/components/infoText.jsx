import { ExclamationIcon } from '@heroicons/react/solid'

// const Notification = ({ message }) => {
function InfoText({ message }) {
  if (message === null) {
    return null;
  }
  return <div className="rounded-md border border-4 border-red-500 bg-yellow-50 p-4 my-4">
    <div className="flex">
      <div className="ml-3">
        <h3 className="text-sm font-medium text-yellow-800">ATTENTION</h3>
        <div className="mt-2 text-sm text-yellow-700">
          <p>
            {message}
          </p>
        </div>
      </div>
    </div>
  </div>;
}

export default InfoText;
