import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useCustomers } from '../../api/hooks/useCustomers';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import { useSearch } from '../../hooks/useSearch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useApartments } from '../../../room-management/api/hooks/useApartments';
import { useTranslation } from 'react-i18next';
import i18n from '@i18n';
import customersI18n from '../../i18n';

i18n.addResourceBundle('en', 'customersApp', customersI18n.en);
i18n.addResourceBundle('vi', 'customersApp', customersI18n.vi);

type CustomersHeaderProps = {
	onAddClick: () => void;
	selectedApartment: string;
	onApartmentChange: (apartmentId: string) => void;
};

function CustomersHeader({ onAddClick, selectedApartment, onApartmentChange }: CustomersHeaderProps) {
	const { t } = useTranslation('customersApp');
	const { data } = useCustomers({ page: 1, limit: 1 });
	const { searchText, setSearchText } = useSearch();
	const { data: apartments } = useApartments();

	return (
		<div className="w-full px-4 py-4 md:px-6">
			<PageBreadcrumb className="mb-2" />

			<div className="flex items-center gap-1 sm:flex-row md:items-start">
				<div className="flex flex-auto flex-col gap-1">
					<motion.span
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
					>
						<Typography className="text-4xl leading-none font-extrabold tracking-tight">
							{t('APP_TITLE')}
						</Typography>
					</motion.span>
					<motion.span
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					>
						<Typography
							component={motion.span}
							className="ml-0.5 text-base font-medium"
							color="text.secondary"
						>
							{data?.total || 0} {t('CUSTOMERS')}
						</Typography>
					</motion.span>
				</div>
				<div className="flex flex-1 items-center justify-end gap-2">
					<Box
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex h-9 min-w-40 items-center gap-2 rounded-lg border-1 px-3 sm:w-auto"
					>
						<FuseSvgIcon color="action">lucide:search</FuseSvgIcon>

						<Input
							placeholder={t('SEARCH_PLACEHOLDER')}
							className="flex flex-1"
							disableUnderline
							fullWidth
							value={searchText}
							slotProps={{
								input: {
									'aria-label': 'Search'
								}
							}}
							onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setSearchText(ev.target.value)}
						/>
					</Box>
					<Button
						variant="contained"
						color="secondary"
						onClick={onAddClick}
						startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
					>
						{t('ADD_CUSTOMER')}
					</Button>
				</div>
			</div>

			<div className="mt-4 flex w-full overflow-x-auto">
				<FormControl size="small" className="min-w-48">
					<Select
						value={selectedApartment}
						onChange={(e) => onApartmentChange(e.target.value)}
						displayEmpty
						startAdornment={<FuseSvgIcon className="mr-2" size={20}>lucide:building-2</FuseSvgIcon>}
					>
						<MenuItem value="all">{t('ALL_APARTMENTS')}</MenuItem>
						{apartments?.rows?.map((apartment) => (
							<MenuItem key={apartment._id} value={apartment._id}>
								{apartment.code}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
		</div>
	);
}

export default CustomersHeader;

