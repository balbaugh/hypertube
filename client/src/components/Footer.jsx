import {useTranslation} from 'react-i18next';

export const Footer = () => {
    const {t} = useTranslation();

    return (
        <div className="zinc-800 style={{ height: '80px' }}">
            <div className="border-t-[3px] border-zinc-700 pt-8 ">
                <div className="container px-4 pt-8 pb-8 mx-auto">
                    <p className="my-8 text-lg font-semibold text-center text-slate-300 hover:text-red-500">
                        {t('Footer.copyright')}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Footer;