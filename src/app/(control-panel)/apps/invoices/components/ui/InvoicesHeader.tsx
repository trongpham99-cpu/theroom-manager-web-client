import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useState } from 'react';
import { useInvoices } from '../../api/hooks/useInvoices';
import { useTranslation } from 'react-i18next';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SyntheticEvent } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useApartments } from 'src/app/(control-panel)/apps/room-management/api/hooks/useApartments';

type InvoicesHeaderProps = {
	onAddClick: () => void;
	onSendManyClick: (invoiceIds: string[]) => void;
	selectedInvoiceIds: string[];
	selectedPeriod: string;
	onPeriodChange: (period: string) => void;
	selectedApartment: string;
	onApartmentChange: (apartmentId: string) => void;
};

function InvoicesHeader({ onAddClick, onSendManyClick, selectedInvoiceIds, selectedPeriod, onPeriodChange, selectedApartment, onApartmentChange }: InvoicesHeaderProps) {
	const { t } = useTranslation('invoicesApp');
	const { data } = useInvoices({ page: 1, limit: 1 });
	const { data: apartmentsData } = useApartments({ page: 1, limit: 100 });

	// Generate 3 tabs: This Month, Last Month, Older Months
	const getPeriodTabs = () => {
		const now = new Date();
		const currentMonth = now.getMonth() + 1;
		const currentYear = now.getFullYear();

		// Calculate last month
		const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const lastMonth = lastMonthDate.getMonth() + 1;
		const lastYear = lastMonthDate.getFullYear();

		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		return [
			{
				value: `${currentYear}-${currentMonth}`,
				label: 'This Month',
				month: currentMonth,
				year: currentYear
			},
			{
				value: `${lastYear}-${lastMonth}`,
				label: `Last Month (${monthNames[lastMonthDate.getMonth()]})`,
				month: lastMonth,
				year: lastYear
			},
			{
				value: 'older',
				label: 'Older Months',
				month: undefined,
				year: undefined
			}
		];
	};

	const periodTabs = getPeriodTabs();

	const handleTabChange = (event: SyntheticEvent, value: string) => {
		onPeriodChange(value);
	};

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
							{data?.total || 0} {t('INVOICES').toLowerCase()}
						</Typography>
					</motion.span>
				</div>
				<div className="flex flex-1 items-center justify-end gap-2">
					{selectedInvoiceIds.length > 0 && (
						<Button
							variant="outlined"
							color="primary"
							onClick={() => onSendManyClick(selectedInvoiceIds)}
							startIcon={<FuseSvgIcon>lucide:send</FuseSvgIcon>}
						>
							{t('SEND')} {selectedInvoiceIds.length} {t('INVOICES')}
						</Button>
					)}
					<FormControl size="small" className="min-w-48">
						<Select
							value={selectedApartment}
							onChange={(e) => onApartmentChange(e.target.value)}
							displayEmpty
						>
							<MenuItem value="all">Tất cả toà nhà</MenuItem>
							{apartmentsData?.rows?.map((apartment) => (
								<MenuItem key={apartment._id} value={apartment._id}>
									{apartment.name || apartment.code}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button
						variant="contained"
						color="secondary"
						onClick={onAddClick}
						startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
					>
						{t('ADD_INVOICE')}
					</Button>
				</div>
			</div>

			<div className="mt-4 flex w-full overflow-x-auto">
				<Tabs
					value={selectedPeriod}
					onChange={handleTabChange}
					indicatorColor="secondary"
					textColor="inherit"
					variant="scrollable"
					scrollButtons="auto"
					className="min-h-10"
				>
					{periodTabs.map((tab) => (
						<Tab
							key={tab.value}
							className="min-h-10 text-base"
							label={tab.label}
							value={tab.value}
						/>
					))}
				</Tabs>
			</div>
		</div>
	);
}

export default InvoicesHeader;

