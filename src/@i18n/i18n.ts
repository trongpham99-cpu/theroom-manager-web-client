import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * resources is an object that contains all the translations for the different languages.
 */
const resources = {
	en: {
		translation: {
			'Welcome to React': 'Welcome to React and react-i18next'
		}
	},
	vi: {
		translation: {
			'Welcome to React': 'Chào mừng đến với React và react-i18next'
		}
	}
};

/**
 * i18n is initialized with the resources object and the language to use.
 * The keySeparator option is set to false because we do not use keys in form messages.welcome.
 * The interpolation option is set to false because we do not use interpolation in form messages.welcome.
 */

// Get saved language from localStorage or default to English
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: savedLanguage,
		fallbackLng: 'en',

		keySeparator: false, // we do not use keys in form messages.welcome

		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

// Save language preference to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
	localStorage.setItem('i18nextLng', lng);
});

export default i18n;
