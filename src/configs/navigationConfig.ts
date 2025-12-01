import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import en from './navigation-i18n/en';
import vi from './navigation-i18n/vi';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('vi', 'navigation', vi);

/**
 * MINIMAL Navigation Config - Tắt hết, chỉ giữ dashboard cơ bản
 * Bạn có thể bật lại từng phần dần dần
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboards',
		title: 'Dashboards',
		subtitle: 'View monthly income & expense overview',
		type: 'group',
		icon: 'lucide:layout-dashboard',
		translate: 'DASHBOARDS',
		children: [
			{
				id: 'dashboards.project',
				title: 'Overview',
				translate: 'PROJECT_OVERVIEW',
				type: 'item',
				icon: 'lucide:clipboard-check',
				url: '/dashboards/project'
			},
			{
				id: 'dashboards.finance',
				title: 'Finance',
				type: 'item',
				icon: 'lucide:chart-area',
				url: '/dashboards/finance'
			}
		]
	},
	{
		id: 'apps',
		title: 'Applications',
		type: 'group',
		icon: 'lucide:box',
		children: [
			{
				id: 'apps.calendar',
				title: 'Calendar',
				type: 'item',
				icon: 'lucide:calendar',
				url: '/apps/calendar'
			},
			{
				id: 'apps.messenger',
				title: 'Messages',
				type: 'item',
				icon: 'lucide:message-circle',
				url: '/apps/messenger'
			},
			{
				id: 'apps.notifications',
				title: 'Notifications',
				type: 'item',
				icon: 'lucide:bell',
				url: '/apps/notifications'
			},
			{
				id: 'apps.room-management',
				title: 'Management',
				type: 'item',
				icon: 'lucide:building-2',
				url: '/apps/room-management'
			},
			{
				id: 'apps.customers',
				title: 'Customers',
				type: 'item',
				icon: 'lucide:users',
				url: '/apps/customers'
			},
			{
				id: 'apps.invoices',
				title: 'Invoices',
				type: 'item',
				icon: 'lucide:file-text',
				url: '/apps/invoices'
			},
			{
				id: 'apps.invoice',
				title: 'Invoice',
				type: 'item',
				icon: 'lucide:file-text',
				url: '/pages/invoice'
			},
			{
				id: 'apps.file-manager',
				title: 'File Manager',
				type: 'item',
				icon: 'lucide:folder',
				url: '/apps/file-manager'
			},
			{
				id: 'apps.users',
				title: 'Users',
				type: 'item',
				icon: 'lucide:users',
				url: '/apps/users'
			},
			{
				id: 'apps.settings',
				title: 'Settings',
				type: 'item',
				icon: 'lucide:settings',
				url: '/apps/settings'
			}
		]
	}
	// ========================================
	// CÁC PHẦN SAU ĐÂY ĐÃ BỊ TẮT - BẠN CÓ THỂ BẬT LẠI DẦN DẦN:
	// ========================================

	// 📊 THÊM DASHBOARDS KHÁC:
	// {
	// 	id: 'dashboards.analytics',
	// 	title: 'Analytics',
	// 	type: 'item',
	// 	icon: 'lucide:chart-pie',
	// 	url: '/dashboards/analytics'
	// },

	// 🎯 THÊM APPLICATIONS:
	// {
	// 	id: 'apps',
	// 	title: 'Applications',
	// 	type: 'group',
	// 	icon: 'lucide:box',
	// 	children: [
	// 		{
	// 			id: 'apps.profile',
	// 			title: 'Profile',
	// 			type: 'item',
	// 			icon: 'lucide:circle-user',
	// 			url: '/apps/profile'
	// 		},
	// 		{
	// 			id: 'apps.notifications',
	// 			title: 'Notifications',
	// 			type: 'item',
	// 			icon: 'lucide:bell',
	// 			url: '/apps/notifications'
	// 		}
	// 	]
	// },

	// 🔐 THÊM AUTHENTICATION:
	// {
	// 	id: 'pages',
	// 	title: 'Pages',
	// 	type: 'group',
	// 	icon: 'lucide:file-text',
	// 	children: [
	// 		{
	// 			id: 'pages.authentication',
	// 			title: 'Authentication',
	// 			type: 'collapse',
	// 			icon: 'lucide:lock',
	// 			children: [
	// 				{
	// 					id: 'pages.authentication.sign-in',
	// 					title: 'Sign in',
	// 					type: 'item',
	// 					icon: 'lucide:log-in',
	// 					url: '/pages/authentication/sign-in/modern'
	// 				}
	// 			]
	// 		}
	// 	]
	// }
];

export default navigationConfig;
