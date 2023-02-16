import { useTranslation } from 'react-i18next';


export const Footer = () => {

    const { t } = useTranslation();

    return (
        <div className="pb-8 zinc-800">
            <div className="border-[3px] border-l-0 border-r-0 border-b-0 border-zinc-700 pt-8">
                <div className="container px-4 pt-8 pb-8 mx-auto">
                    <p className="text-lg font-semibold text-center text-slate-300 hover:text-red-500">
                        {t('Footer.copyright')}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Footer;