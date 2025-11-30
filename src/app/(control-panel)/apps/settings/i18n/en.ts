const locale = {
	TITLE: 'Settings',
	NAVIGATION: {
		ACCOUNT: {
			TITLE: 'Account',
			SUBTITLE: 'Manage your public profile and private information'
		},
		SECURITY: {
			TITLE: 'Security',
			SUBTITLE: 'Manage your password and 2-step verification preferences'
		},
		PLAN_BILLING: {
			TITLE: 'Plan & Billing',
			SUBTITLE: 'Manage your subscription plan, payment method and billing information'
		},
		NOTIFICATIONS: {
			TITLE: 'Notifications',
			SUBTITLE: "Manage when you'll be notified on which channels"
		},
		TEAM: {
			TITLE: 'Team',
			SUBTITLE: 'Manage your existing team and change roles/permissions'
		}
	},
	ACCOUNT: {
		PROFILE_TITLE: 'Profile',
		PROFILE_SUBTITLE: 'Following information is publicly displayed, be careful!',
		PERSONAL_INFO_TITLE: 'Personal Information',
		PERSONAL_INFO_SUBTITLE: 'Communication details in case we want to connect with you. These will be kept private.',
		NAME: 'Name',
		USERNAME: 'Username',
		TITLE: 'Title',
		JOB_TITLE: 'Job title',
		COMPANY: 'Company',
		NOTES: 'Notes',
		NOTES_HELPER: 'Brief description for your profile. Basic HTML and Emoji are allowed.',
		EMAIL: 'Email',
		PHONE: 'Phone Number',
		COUNTRY: 'Country',
		COUNTY: 'County',
		LANGUAGE: 'Language',
		SAVE: 'Save',
		CANCEL: 'Cancel'
	},
	SECURITY: {
		PASSWORD_TITLE: 'Change your password',
		PASSWORD_SUBTITLE: 'You can only change your password twice within 24 hours!',
		SECURITY_PREF_TITLE: 'Security preferences',
		SECURITY_PREF_SUBTITLE: 'Keep your account more secure with following preferences.',
		CURRENT_PASSWORD: 'Current password (default:changeme)',
		NEW_PASSWORD: 'New password',
		TWO_STEP_VERIFICATION: 'Enable 2-step authentication',
		TWO_STEP_HELPER: 'Protects you against password theft by requesting an authentication code via SMS on every login.',
		ASK_PASSWORD_CHANGE: 'Ask to change password on every 6 months',
		ASK_PASSWORD_HELPER: 'A simple but an effective way to be protected against data leaks and password theft.',
		SAVE: 'Save',
		CANCEL: 'Cancel'
	},
	PLAN_BILLING: {
		CHANGE_PLAN_TITLE: 'Change your plan',
		CHANGE_PLAN_SUBTITLE: 'Upgrade or downgrade your current plan.',
		CHANGE_PLAN_ALERT: 'Changing the plan will take effect immediately. You will be charged for the rest of the current month.',
		PAYMENT_DETAILS_TITLE: 'Payment Details',
		PAYMENT_DETAILS_SUBTITLE: 'Update your billing information. Make sure to set your location correctly as it could affect your tax rates.',
		PLAN_BASIC: 'Basic',
		PLAN_BASIC_DESC: 'Starter plan for individuals.',
		PLAN_TEAM: 'Team',
		PLAN_TEAM_DESC: 'Collaborate up to 10 people.',
		PLAN_ENTERPRISE: 'Enterprise',
		PLAN_ENTERPRISE_DESC: 'For bigger businesses.',
		PER_MONTH: '/ month',
		CARD_HOLDER: 'Card holder',
		CARD_NUMBER: 'Card number',
		EXPIRATION_DATE: 'Expiration date',
		CVC: 'CVC / CVC2',
		COUNTRY: 'Country',
		COUNTY: 'County',
		ZIP_POSTAL: 'ZIP / Postal code',
		SAVE: 'Save',
		CANCEL: 'Cancel'
	},
	NOTIFICATIONS: {
		ALERTS_TITLE: 'Alerts',
		ACCOUNT_ACTIVITY_TITLE: 'Account Activity',
		EMAIL_ME_WHEN: 'Email me when:',
		COMMUNICATION: 'Communication',
		COMMUNICATION_HELPER: 'Get news, announcements, and product updates.',
		SECURITY: 'Security',
		SECURITY_HELPER: 'Get important notifications about your account security.',
		MEETUPS: 'Meetups',
		MEETUPS_HELPER: 'Get an email when a Meetup is posted close to my location.',
		COMMENTS: 'Someone comments on one of my items',
		MENTION: 'Someone mentions me',
		FOLLOW: 'Someone follows me',
		INQUIRY: 'Someone replies to my job posting',
		SAVE: 'Save',
		CANCEL: 'Cancel'
	},
	TEAM: {
		ADD_MEMBER: 'Add team member',
		ENTER_EMAIL: 'Enter email',
		NO_MEMBERS: 'No team members found.',
		ROLE_READ: 'Read',
		ROLE_READ_DESC: 'Can read and clone this repository. Can also open and comment on issues and pull requests.',
		ROLE_WRITE: 'Write',
		ROLE_WRITE_DESC: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.',
		ROLE_ADMIN: 'Admin',
		ROLE_ADMIN_DESC: 'Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.'
	}
};

export default locale;
