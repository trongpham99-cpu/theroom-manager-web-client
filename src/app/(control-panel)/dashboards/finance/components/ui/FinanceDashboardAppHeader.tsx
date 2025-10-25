import Typography from '@mui/material/Typography';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useTranslation } from 'react-i18next';

/**
 * The FinanceDashboardAppHeader component.
 */
function FinanceDashboardAppHeader() {
	const { t } = useTranslation('financeDashboard');

	return (
		<div className="container flex w-full">
			<div className="flex flex-auto flex-col p-4 pb-0 md:px-8 md:pb-0">
				<PageBreadcrumb className="mb-2" />
				<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center md:gap-0">
					<div className="flex flex-auto flex-col">
						<Typography className="text-3xl font-semibold tracking-tight">{t('HEADER.TITLE')}</Typography>
						<Typography
							className="font-medium tracking-tight"
							color="text.secondary"
						>
							{t('HEADER.SUBTITLE')}
						</Typography>
					</div>
					{/* Tắt tất cả buttons trong Finance Dashboard Header */}
					{/* <div className="flex items-center gap-2">
						<Button
							className="whitespace-nowrap"
							startIcon={<FuseSvgIcon>lucide:chart-area</FuseSvgIcon>}
							variant="contained"
							color="primary"
						>
							Reports
						</Button>
						<Button
							className="whitespace-nowrap"
							startIcon={<FuseSvgIcon>lucide:settings</FuseSvgIcon>}
							variant="contained"
							color="primary"
						>
							Settings
						</Button>
						<Button
							className="whitespace-nowrap"
							variant="contained"
							color="secondary"
							startIcon={<FuseSvgIcon>lucide:upload</FuseSvgIcon>}
						>
							Export
						</Button>
					</div> */}
				</div>
			</div>
		</div>
	);
}

export default FinanceDashboardAppHeader;
