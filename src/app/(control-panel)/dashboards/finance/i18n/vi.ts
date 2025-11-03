const locale = {
	HEADER: {
		TITLE: 'Bảng điều khiển tài chính',
		SUBTITLE: 'Theo dõi tình trạng tài chính của bạn'
	},
	PREVIOUS_STATEMENT: {
		TITLE: 'Sao kê kỳ trước',
		STATUS_PAID: 'Đã thanh toán ngày {{date}}',
		STATUS_PENDING: 'Cần thanh toán trước ngày {{date}}',
		CARD_LIMIT: 'Hạn mức thẻ',
		SPENT: 'Đã chi',
		MINIMUM: 'Tối thiểu'
	},
	CURRENT_STATEMENT: {
		TITLE: 'Sao kê hiện tại',
		STATUS_PAID: 'Đã thanh toán ngày {{date}}',
		STATUS_PENDING: 'Cần thanh toán trước ngày {{date}}',
		CARD_LIMIT: 'Hạn mức thẻ',
		SPENT: 'Đã chi',
		MINIMUM: 'Tối thiểu'
	},
	ACCOUNT_BALANCE: {
		TITLE: 'Số dư tài khoản',
		SUBTITLE: 'Tăng trưởng số dư hàng tháng và thu nhập trung bình',
		PERIOD: '12 tháng',
		AVG_GROWTH: 'Tăng trưởng trung bình hàng tháng',
		AVG_INCOME: 'Thu nhập trung bình hàng tháng'
	},
	RECENT_TRANSACTIONS: {
		TITLE: 'Giao dịch gần đây',
		SUBTITLE: '{{pending}} đang chờ, {{completed}} đã hoàn tất',
		COLUMNS: {
			TRANSACTION_ID: 'Mã giao dịch',
			DATE: 'Ngày',
			NAME: 'Tên',
			AMOUNT: 'Số tiền',
			STATUS: 'Trạng thái'
		},
		SEE_ALL: 'Xem tất cả giao dịch',
		STATUS_PENDING: 'Đang chờ',
		STATUS_COMPLETED: 'Đã hoàn tất'
	},
	BUDGET: {
		TITLE: 'Ngân sách',
		SUBTITLE: 'Tổng quan ngân sách hàng tháng',
		LAST_MONTH_SUMMARY:
			'Tháng trước bạn có <strong>{{expensesCount}}</strong> giao dịch chi tiêu, <strong>{{savingsCount}}</strong> mục tiết kiệm và <strong>{{billsCount}}</strong> hóa đơn.',
		EXPENSES: 'Chi tiêu',
		SAVINGS: 'Tiết kiệm',
		BILLS: 'Hóa đơn',
		OVER_LIMIT_NOTE: 'Vượt quá giới hạn cá nhân! Hãy chú ý cho tháng sau.',
		DOWNLOAD_SUMMARY: 'Tải báo cáo'
	}
};

export default locale;
