import i18n from '@i18n';
import en from './en';
import vi from './vi';

const namespace = 'fileManagerApp';

if (!i18n.hasResourceBundle('en', namespace)) {
	i18n.addResourceBundle('en', namespace, en);
}

if (!i18n.hasResourceBundle('vi', namespace)) {
	i18n.addResourceBundle('vi', namespace, vi);
}

export default namespace;
