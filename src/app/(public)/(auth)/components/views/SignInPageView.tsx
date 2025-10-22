import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import _ from 'lodash';
import { lighten } from '@mui/material/styles';
import JwtLoginTab from '../tabs/sign-in/JwtSignInTab';
// import FirebaseSignInTab from '../tabs/sign-in/FirebaseSignInTab';
// import AwsSignInTab from '../tabs/sign-in/AwsSignInTab';
import SignInPageTitle from '../ui/SignInPageTitle';
import AuthPagesMessageSection from '../ui/AuthPagesMessageSection';

// Tabs for multiple providers are disabled for a simplified Sign In page.
// const tabs = [...];

/**
 * The sign in page.
 */
function SignInPageView() {
    // Single provider only (JWT). Tabs are removed.

	return (
        <Box
			sx={{
				backgroundColor: '#2F4F4F',
				minHeight: '100vh',
				height: '100vh',
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'space-around',
				padding: { xs: 2, sm: 4, md: 6 },
				paddingTop: { xs: 4, sm: 6, md: 10 },
				gap: 4,
				overflow: 'hidden',
				'@media (max-width: 700px)': {
					justifyContent: 'center',
					alignItems: 'center',
					paddingTop: 2,
					flexDirection: 'column',
					backgroundColor: '#224040'
				},
				'@media (min-width: 700px) and (max-width: 1210px)': {
					justifyContent: 'flex-start',
					alignItems: 'center',
					paddingTop: 0,
					flexDirection: 'column',
					backgroundColor: '#224040'
				}
			}}
		>
			{/* Logo The Room phía trên - chỉ hiện ở mode vừa */}
			<Box
				component="img"
				src="/assets/images/logo/ver2.jpg"
				alt="The Room Logo"
				sx={{
					display: 'none',
					'@media (min-width: 700px) and (max-width: 1210px)': {
						display: 'block',
						width: '400px',
						height: '400px',
						objectFit: 'contain',
						marginTop: '-2.5rem',
						marginBottom: '0',
						border: 'none',
						boxShadow: 'none',
						backgroundColor: 'transparent'
					}
				}}
			/>

            {/* Sign In dialog (floating modal) - bên trái */}
            <Box
				sx={{
					backgroundColor: 'background.paper',
					borderRadius: 2,
					p: { xs: 5, sm: 6, md: 8 },
					py: { xs: 10, sm: 14, md: 20 },
					'@media (min-width: 700px) and (max-width: 1210px)': {
						py: 5
					},
					boxShadow: 3,
					width: '100%',
					maxWidth: 700,
					ml: { xs: 0 },
					'@media (min-width: 1211px)': {
						ml: 4
					},
					zIndex: 10,
					position: 'relative',
					'@media (max-width: 1210px)': {
						ml: 0,
						maxWidth: '500px'
					},
					'& .MuiTextField-root': {
						'& input': {
							fontSize: '1.25rem',
							padding: '16px 18px'
						},
						'& label': {
							fontSize: '1.125rem'
						}
					},
					'& .MuiButton-root': {
						fontSize: '1.25rem',
						padding: '14px 28px',
						minHeight: '58px'
					}
				}}
			>
				<div className="flex w-full flex-col gap-12">
					<SignInPageTitle />
					<div style={{ fontSize: '1.125rem' }}>
						{/* Simplified: show only JWT Sign In, remove provider tabs */}
						<JwtLoginTab />
					</div>
				</div>
			</Box>

            {/* Logo + Welcome section - bên phải - Chỉ hiện từ 1211px trở lên */}
            <Box sx={{ 
				flex: 1, 
				display: { xs: 'none', sm: 'none', md: 'flex' }, 
				'@media (max-width: 1210px)': {
					display: 'none !important'
				},
				'@media (min-width: 1211px)': {
					display: 'flex',
					transform: 'scale(1.15)',
					transformOrigin: 'top center'
				},
				justifyContent: 'center'
			}}>
                <AuthPagesMessageSection />
            </Box>
		</Box>
	);
}

export default SignInPageView;
