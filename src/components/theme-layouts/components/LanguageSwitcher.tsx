import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

const languages = [
	{
		code: 'en',
		label: 'English',
		flag: '🇺🇸'
	},
	{
		code: 'vi',
		label: 'Tiếng Việt',
		flag: '🇻🇳'
	}
];

function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLanguageChange = (languageCode: string) => {
		i18n.changeLanguage(languageCode);
		handleClose();
	};

	return (
		<>
			<IconButton
				onClick={handleClick}
				size="large"
				aria-label="change language"
				aria-controls={open ? 'language-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
			>
				<span className="text-2xl">{currentLanguage.flag}</span>
			</IconButton>
			<Menu
				id="language-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'language-button'
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
			>
				{languages.map((language) => (
					<MenuItem
						key={language.code}
						onClick={() => handleLanguageChange(language.code)}
						selected={language.code === i18n.language}
					>
						<ListItemIcon>
							<span className="text-2xl">{language.flag}</span>
						</ListItemIcon>
						<ListItemText>{language.label}</ListItemText>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default LanguageSwitcher;
