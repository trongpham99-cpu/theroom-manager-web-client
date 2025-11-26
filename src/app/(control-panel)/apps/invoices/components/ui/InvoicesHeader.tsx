import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useState } from 'react';
import { useInvoices } from '../../api/hooks/useInvoices';
import { useTranslation } from 'react-i18next';

type InvoicesHeaderProps = {
	onAddClick: () => void;
	onSendManyClick: (invoiceIds: string[]) => void;
	selectedInvoiceIds: string[];
};

function InvoicesHeader({ onAddClick, onSendManyClick, selectedInvoiceIds }: InvoicesHeaderProps) {
	const { t } = useTranslation('invoicesApp');
	const { data } = useInvoices({ page: 1, limit: 1 });

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
		</div>
	);
}

export default InvoicesHeader;

