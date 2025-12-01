const locale = {
	HEADER: {
		TITLE: 'Người dùng',
		SUBTITLE: '{{count}} người dùng',
		SEARCH_PLACEHOLDER: 'Tìm kiếm người dùng',
		ADD_BUTTON: 'Thêm'
	},
	COLUMNS: {
		AVATAR: 'Ảnh đại diện',
		NAME: 'Tên',
		EMAIL: 'Email',
		ROLE: 'Vai trò',
		EMAIL_VERIFIED: 'Email đã xác minh',
		ID: 'ID',
		VERIFIED: 'Đã xác minh',
		NOT_VERIFIED: 'Chưa xác minh'
	},
	ROLES: {
		ADMIN: 'Quản trị viên',
		USER: 'Người dùng'
	},
	DIALOGS: {
		CREATE: {
			TITLE: 'Tạo người dùng mới',
			NAME_LABEL: 'Tên',
			NAME_PLACEHOLDER: 'Họ và tên',
			EMAIL_LABEL: 'Email',
			EMAIL_PLACEHOLDER: 'email@example.com',
			ROLE_LABEL: 'Vai trò',
			PASSWORD_LABEL: 'Mật khẩu',
			PASSWORD_PLACEHOLDER: 'Mật khẩu',
			PASSWORD_HELPER: 'Để trống để tự động tạo',
			CANCEL: 'Hủy',
			CREATE: 'Tạo người dùng',
			CREATING: 'Đang tạo...'
		},
		EDIT: {
			TITLE: 'Sửa người dùng',
			NAME_LABEL: 'Tên',
			NAME_PLACEHOLDER: 'Họ và tên',
			EMAIL_LABEL: 'Email',
			EMAIL_PLACEHOLDER: 'email@example.com',
			CANCEL: 'Hủy',
			UPDATE: 'Cập nhật người dùng',
			UPDATING: 'Đang cập nhật...'
		},
		DELETE: {
			TITLE: 'Xóa người dùng',
			MESSAGE: 'Bạn có chắc chắn muốn xóa người dùng',
			WARNING: 'Hành động này không thể hoàn tác.',
			CANCEL: 'Hủy',
			DELETE: 'Xóa',
			DELETING: 'Đang xóa...'
		}
	},
	FORM: {
		NAME_LABEL: 'Tên',
		NAME_PLACEHOLDER: 'Tên',
		NAME_REQUIRED: 'Tên là bắt buộc',
		EMAIL_LABEL: 'Email',
		EMAIL_PLACEHOLDER: 'Email',
		EMAIL_REQUIRED: 'Địa chỉ email không hợp lệ',
		ROLE_LABEL: 'Vai trò',
		ROLE_REQUIRED: 'Vai trò là bắt buộc',
		PASSWORD_LABEL: 'Mật khẩu',
		PASSWORD_PLACEHOLDER: 'Mật khẩu',
		PASSWORD_HELPER: 'Để trống để tự động tạo',
		DELETE: 'Xóa',
		CANCEL: 'Hủy',
		SAVE: 'Lưu'
	},
	VIEW: {
		DELETE: 'Xóa',
		EDIT: 'Sửa',
		EMAIL_VERIFIED: 'Email đã xác minh',
		EMAIL_NOT_VERIFIED: 'Email chưa xác minh',
		USER_SETTINGS: 'Cài đặt người dùng'
	},
	MESSAGES: {
		CREATE_SUCCESS: 'Tạo người dùng thành công',
		CREATE_ERROR: 'Không thể tạo người dùng',
		UPDATE_SUCCESS: 'Cập nhật người dùng thành công',
		UPDATE_ERROR: 'Không thể cập nhật người dùng',
		DELETE_SUCCESS: 'Xóa người dùng thành công',
		DELETE_ERROR: 'Không thể xóa người dùng',
		NOT_FOUND: 'Không tìm thấy người dùng'
	}
};

export default locale;
