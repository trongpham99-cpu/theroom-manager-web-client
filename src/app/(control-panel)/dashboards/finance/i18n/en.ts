const locale = {
	HEADER: {
		TITLE: 'Finance dashboard',
		SUBTITLE: 'Keep track of your financial status'
	},
	PREVIOUS_STATEMENT: {
		TITLE: 'Previous Statement',
		STATUS_PAID: 'Paid on {{date}}',
		STATUS_PENDING: 'Must be paid before {{date}}',
		CARD_LIMIT: 'Card Limit',
		SPENT: 'Spent',
		MINIMUM: 'Minimum'
	},
	CURRENT_STATEMENT: {
		TITLE: 'Current Statement',
		STATUS_PAID: 'Paid on {{date}}',
		STATUS_PENDING: 'Must be paid before {{date}}',
		CARD_LIMIT: 'Card Limit',
		SPENT: 'Spent',
		MINIMUM: 'Minimum'
	},
	ACCOUNT_BALANCE: {
		TITLE: 'Account Balance',
		SUBTITLE: 'Monthly balance growth and avg. monthly income',
		PERIOD: '12 months',
		AVG_GROWTH: 'Average Monthly Growth',
		AVG_INCOME: 'Average Monthly Income'
	},
	RECENT_TRANSACTIONS: {
		TITLE: 'Recent transactions',
		SUBTITLE: '{{pending}} pending, {{completed}} completed',
		COLUMNS: {
			TRANSACTION_ID: 'Transaction ID',
			DATE: 'Date',
			NAME: 'Name',
			AMOUNT: 'Amount',
			STATUS: 'Status'
		},
		SEE_ALL: 'See all transactions',
		STATUS_PENDING: 'Pending',
		STATUS_COMPLETED: 'Completed'
	},
	BUDGET: {
		TITLE: 'Budget',
		SUBTITLE: 'Monthly budget summary',
		LAST_MONTH_SUMMARY:
			'Last month; you had <strong>{{expensesCount}}</strong> expense transactions, <strong>{{savingsCount}}</strong> savings entries and <strong>{{billsCount}}</strong> bills.',
		EXPENSES: 'Expenses',
		SAVINGS: 'Savings',
		BILLS: 'Bills',
		OVER_LIMIT_NOTE: 'Exceeded your personal limit! Be careful next month.',
		DOWNLOAD_SUMMARY: 'Download Summary'
	}
};

export default locale;
