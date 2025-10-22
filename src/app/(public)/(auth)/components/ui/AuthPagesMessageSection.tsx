import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

function AuthPagesMessageSection() {
	return (
		<Box
			className="relative hidden h-full flex-auto flex-col items-center overflow-hidden md:flex"
			sx={{
				backgroundColor: '#2F4F4F', // Màu xanh đậm - giữ nguyên cho mode rộng
				color: 'primary.contrastText',
				borderRadius: '6px', // Border radius giống nút đăng nhập
				padding: 0, // Reset padding
				paddingTop: 0, // Không có padding top
				paddingLeft: { md: 8, lg: 14 }, // Padding ngang
				paddingRight: { md: 8, lg: 14 },
				paddingBottom: { md: 6 },
				justifyContent: 'flex-start' // Không căn giữa nữa
			}}
		>
			{/* 2 vòng tròn với z-index thấp để nằm dưới logo */}
			<svg
				className="pointer-events-none absolute inset-0"
				style={{ zIndex: 1 }}
				viewBox="0 0 960 540"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMax slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Box
					component="g"
					className="opacity-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="100"
				>
					<circle
						r="234"
						cx="196"
						cy="450"
					/>
					<circle
						r="234"
						cx="790"
						cy="700"
					/>
				</Box>
			</svg>
			<Box
				component="svg"
				className="absolute -top-16 -right-16 opacity-20"
				sx={{ color: 'primary.light' }}
				viewBox="0 0 220 192"
				width="220px"
				height="192px"
				fill="none"
			>
				<defs>
					<pattern
						id="837c3e70-6c3a-44e6-8854-cc48c737b659"
						x="0"
						y="0"
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
					>
						<rect
							x="0"
							y="0"
							width="4"
							height="4"
							fill="currentColor"
						/>
					</pattern>
				</defs>
				<rect
					width="220"
					height="192"
					fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
				/>
			</Box>

			{/* Logo image ở trên */}
			<div 
				style={{
					width: '550px',
					height: '550px',
					backgroundImage: 'url(/assets/images/logo/z6444283442925_71adb5719ed50228ca8f679571ee3c7f.jpg)',
					backgroundSize: 'contain',
					backgroundPosition: 'top center',
					backgroundRepeat: 'no-repeat',
					marginBottom: '0',
					marginTop: '0'
				}}
			/>

			{/* Đường kẻ ngắn giữa logo và welcome */}
			<div 
				style={{
					width: '80px',
					height: '3px',
					backgroundColor: '#D4AF37',
					marginTop: '-7rem',
					marginBottom: '3rem',
					borderRadius: '2px'
				}}
			/>

			{/* Text welcome ở dưới logo */}
			<div className="relative w-full max-w-4xl text-center" style={{ marginTop: '0' }}>
				<div className="text-8xl leading-none font-bold text-gray-100">
					<div>Welcome to</div>
					<div>THE ROOM</div>
				</div>
				<div className="mt-6 text-xl leading-7 tracking-tight text-gray-400">
				Automated apartment management platform with personalized tools for landlords.
				</div>
				{/* Tắt chỉ phần "More than 17k people joined us" và avatars */}
				{/* <div className="mt-8 flex items-center">
					<AvatarGroup
						sx={{
							'& .MuiAvatar-root': {
								borderColor: 'primary.main'
							}
						}}
					>
						<Avatar src="/assets/images/avatars/female-18.jpg" />
						<Avatar src="/assets/images/avatars/female-11.jpg" />
						<Avatar src="/assets/images/avatars/male-09.jpg" />
						<Avatar src="/assets/images/avatars/male-16.jpg" />
					</AvatarGroup>

					<div className="ml-4 font-medium tracking-tight text-gray-400">
						More than 17k people joined us, it's your turn
					</div>
				</div> */}
			</div>
		</Box>
	);
}

export default AuthPagesMessageSection;
