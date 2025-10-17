import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

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
				title: 'Project',
				type: 'item',
				icon: 'lucide:clipboard-check',
				url: '/dashboards/project'
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