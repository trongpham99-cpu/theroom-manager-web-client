import Typography from '@mui/material/Typography';

function SignInPageTitle() {
	return (
		<div className="w-full">
			<div className="flex items-center gap-4">
				<img
					className="h-12 w-auto"
					src="/assets/images/logo/logo.png"
					alt="logo"
				/>

				<div className="flex flex-col">
					<Typography className="text-primary/80 dark:text-primary/60 text-xs font-semibold tracking-[0.4em] uppercase">
						Theroom Manager
					</Typography>
					<Typography className="text-sm text-slate-500 dark:text-slate-400">
						Manage your Apartments on every device
					</Typography>
				</div>
			</div>

			<div className="mt-8 space-y-4">
				<Typography className="text-4xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
					Sign in to your dashboard
				</Typography>
			</div>
		</div>
	);
}

export default SignInPageTitle;
