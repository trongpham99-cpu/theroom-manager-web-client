import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import FuseLoading from '@fuse/core/FuseLoading';
import BudgetWidgetType from '../../../api/types/BudgetWidgetType';
import { useGetWidget } from '../../../api/hooks/widgets/useGetWidget';
import { Trans, useTranslation } from 'react-i18next';

/**
 * The BudgetWidget widget.
 */
function BudgetWidget() {
	const { data: widget, isLoading } = useGetWidget<BudgetWidgetType>('budget');
	const { t } = useTranslation('financeDashboard');

	const expenses = widget?.expenses;
	const expensesLimit = widget?.expensesLimit;
	const savings = widget?.savings;
	const savingsGoal = widget?.savingsGoal;
	const bills = widget?.bills;
	const billsLimit = widget?.billsLimit;

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	function calcProgressVal(val: number, limit: number) {
		const percentage = (val * 100) / limit;

		return percentage > 100 ? 100 : percentage;
	}

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl p-6 shadow-sm">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<Typography className="mr-4 truncate text-lg leading-6 font-medium tracking-tight">
						{t('BUDGET.TITLE')}
					</Typography>
					<Typography
						className="font-medium"
						color="text.secondary"
					>
						{t('BUDGET.SUBTITLE')}
					</Typography>
				</div>
				<div className="-mt-2">
					<IconButton aria-label="more">
						<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
					</IconButton>
				</div>
			</div>

			<Typography className="mt-6">
				<Trans
					i18nKey="BUDGET.LAST_MONTH_SUMMARY"
					ns="financeDashboard"
					values={{ expensesCount: 223, savingsCount: 12, billsCount: 4 }}
					components={{ strong: <strong /> }}
				/>
			</Typography>

			<div className="my-8 flex flex-col gap-8">
				<div className="flex flex-col">
					<div className="flex items-center gap-4">
						<div className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50">
							<FuseSvgIcon className="text-current">lucide:credit-card</FuseSvgIcon>
						</div>
						<div className="flex-auto leading-none">
							<Typography
								className="text-md font-medium"
								color="text.secondary"
							>
								{t('BUDGET.EXPENSES')}
							</Typography>
							<Typography className="text-2xl font-medium">
								{expenses.toLocaleString('en-US', {
									style: 'currency',
									currency: 'USD'
								})}
							</Typography>
							<LinearProgress
								variant="determinate"
								className="mt-1"
								color="warning"
								value={calcProgressVal(expenses, expensesLimit)}
							/>
						</div>
						<div className="mt-auto ml-6 flex min-w-18 items-end justify-end">
							<div className="text-lg leading-none">2.6%</div>
							<FuseSvgIcon
								size={16}
								className="text-green-600"
							>
								lucide:arrow-down
							</FuseSvgIcon>
						</div>
					</div>
				</div>
				<div className="flex flex-col">
					<div className="flex items-center gap-4">
						<div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-50">
							<FuseSvgIcon className="text-current">lucide:banknote</FuseSvgIcon>
						</div>
						<div className="flex-auto leading-none">
							<Typography
								className="text-md font-medium"
								color="text.secondary"
							>
								{t('BUDGET.SAVINGS')}
							</Typography>
							<Typography className="text-2xl font-medium">
								{savings.toLocaleString('en-US', {
									style: 'currency',
									currency: 'USD'
								})}
							</Typography>
							<LinearProgress
								variant="determinate"
								className="mt-1"
								color="primary"
								value={calcProgressVal(savings, savingsGoal)}
							/>
						</div>
						<div className="mt-auto flex min-w-18 items-end justify-end">
							<div className="text-lg leading-none">12.7%</div>
							<FuseSvgIcon
								size={16}
								className="ml-1 text-red-600"
							>
								lucide:arrow-up
							</FuseSvgIcon>
						</div>
					</div>
				</div>
				<div className="flex flex-col">
					<div className="flex items-center gap-4">
						<div className="flex h-14 w-14 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-600 dark:text-teal-50">
							<FuseSvgIcon className="text-current">lucide:lightbulb</FuseSvgIcon>
						</div>
						<div className="flex-auto leading-none">
							<Typography
								className="text-md font-medium"
								color="text.secondary"
							>
								{t('BUDGET.BILLS')}
							</Typography>
							<Typography className="text-2xl font-medium">
								{bills.toLocaleString('en-US', {
									style: 'currency',
									currency: 'USD'
								})}
							</Typography>
							<LinearProgress
								variant="determinate"
								className="mt-1"
								color="secondary"
								value={calcProgressVal(bills, billsLimit)}
							/>
						</div>
						<div className="mt-auto flex min-w-18 items-end justify-end">
							<div className="text-lg leading-none">105.7%</div>
							<FuseSvgIcon
								size={16}
								className="ml-1 text-red-600"
							>
								lucide:arrow-up
							</FuseSvgIcon>
						</div>
					</div>

					<Typography
						className="text-md mt-3"
						color="text.secondary"
					>
						{t('BUDGET.OVER_LIMIT_NOTE')}
					</Typography>
				</div>
			</div>

			<div>
				<Button variant="outlined">{t('BUDGET.DOWNLOAD_SUMMARY')}</Button>
			</div>
		</Paper>
	);
}

export default memo(BudgetWidget);
