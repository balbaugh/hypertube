import {useTranslation} from 'react-i18next';

function InfoText({message}) {
    const {t} = useTranslation();

    if (message === null) {
        return null;
    }
    return <div className="rounded-md border border-4 border-red-500 bg-yellow-100 p-4 my-4">
        <div className="flex">
            <div className="ml-3">
                <h3 className="text-md font-medium text-yellow-800">{t('infoText.attention')}</h3>
                <div className="mt-2 text-md text-yellow-700">
                    <p>
                        {message}
                    </p>
                </div>
            </div>
        </div>
    </div>;
}

export default InfoText;
