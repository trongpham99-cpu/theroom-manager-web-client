const locale = {
	HEADER: {
		TITLE: 'Users',
		SUBTITLE: '{{count}} users',
		SEARCH_PLACEHOLDER: 'Search users',
		ADD_BUTTON: 'Add'
	},
	COLUMNS: {
		AVATAR: 'Avatar',
		NAME: 'Name',
		EMAIL: 'Email',
		ROLE: 'Role',
		EMAIL_VERIFIED: 'Email Verified',
		ID: 'ID',
		VERIFIED: 'Verified',
		NOT_VERIFIED: 'Not Verified'
	},
	ROLES: {
		ADMIN: 'Admin',
		USER: 'User'
	},
	DIALOGS: {
		CREATE: {
			TITLE: 'Create New User',
			NAME_LABEL: 'Name',
			NAME_PLACEHOLDER: 'Full name',
			EMAIL_LABEL: 'Email',
			EMAIL_PLACEHOLDER: 'email@example.com',
			ROLE_LABEL: 'Role',
			PASSWORD_LABEL: 'Password',
			PASSWORD_PLACEHOLDER: 'Password',
			PASSWORD_HELPER: 'Leave empty to auto-generate',
			CANCEL: 'Cancel',
			CREATE: 'Create User',
			CREATING: 'Creating...'
		},
		EDIT: {
			TITLE: 'Edit User',
			NAME_LABEL: 'Name',
			NAME_PLACEHOLDER: 'Full name',
			EMAIL_LABEL: 'Email',
			EMAIL_PLACEHOLDER: 'email@example.com',
			CANCEL: 'Cancel',
			UPDATE: 'Update User',
			UPDATING: 'Updating...'
		},
		DELETE: {
			TITLE: 'Delete User',
			MESSAGE: 'Are you sure you want to delete user',
			WARNING: 'This action cannot be undone.',
			CANCEL: 'Cancel',
			DELETE: 'Delete',
			DELETING: 'Deleting...'
		}
	},
	FORM: {
		NAME_LABEL: 'Name',
		NAME_PLACEHOLDER: 'Name',
		NAME_REQUIRED: 'Name is required',
		EMAIL_LABEL: 'Email',
		EMAIL_PLACEHOLDER: 'Email',
		EMAIL_REQUIRED: 'Invalid email address',
		ROLE_LABEL: 'Role',
		ROLE_REQUIRED: 'Role is required',
		PASSWORD_LABEL: 'Password',
		PASSWORD_PLACEHOLDER: 'Password',
		PASSWORD_HELPER: 'Leave empty to auto-generate',
		DELETE: 'Delete',
		CANCEL: 'Cancel',
		SAVE: 'Save'
	},
	VIEW: {
		DELETE: 'Delete',
		EDIT: 'Edit',
		EMAIL_VERIFIED: 'Email Verified',
		EMAIL_NOT_VERIFIED: 'Email Not Verified',
		USER_SETTINGS: 'User Settings'
	},
	MESSAGES: {
		CREATE_SUCCESS: 'User created successfully',
		CREATE_ERROR: 'Failed to create user',
		UPDATE_SUCCESS: 'User updated successfully',
		UPDATE_ERROR: 'Failed to update user',
		DELETE_SUCCESS: 'User deleted successfully',
		DELETE_ERROR: 'Failed to delete user',
		NOT_FOUND: 'User not found'
	}
};

export default locale;
