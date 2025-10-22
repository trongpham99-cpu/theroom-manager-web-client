import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import Box from '@mui/material/Box';

function SignInPageTitle() {
	return (
		<div className="w-full">
			<Box
				component="img"
				src="/assets/images/logo/logo.png"
				alt="logo"
				sx={{
					width: '64px',
					'@media (min-width: 700px) and (max-width: 1210px)': {
						display: 'none'
					}
				}}
			/>

			<Typography className="mt-8 text-5xl leading-[1.25] font-extrabold tracking-tight">Sign in</Typography>
			<div className="mt-2 flex items-baseline font-medium text-lg">
				<Typography className="text-lg">Don't have an account?</Typography>
				<Link
					className="ml-1 text-lg"
					to="/sign-up"
				>
					Sign up
				</Link>
			</div>
		</div>
	);
}

export default SignInPageTitle;
