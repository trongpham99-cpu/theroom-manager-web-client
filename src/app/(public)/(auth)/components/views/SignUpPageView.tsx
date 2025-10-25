import Paper from '@mui/material/Paper';
import SignUpPageTitle from '../ui/SignUpPageTitle';
import AuthPagesMessageSection from '../ui/AuthPagesMessageSection';
import JwtSignUpTab from '../tabs/sign-up/JwSignUpTab';

function SignUpPageView() {
	return (
		<div className="relative flex min-h-screen min-w-0 flex-auto flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
			<div className="pointer-events-none absolute inset-0">
				<div className="bg-primary/20 absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl sm:-top-20 sm:-left-14 sm:h-80 sm:w-80" />
				<div className="bg-secondary/25 absolute right-[-14%] bottom-[-18%] h-72 w-72 rounded-full blur-[120px] sm:h-96 sm:w-96" />
			</div>

			<div className="relative z-10 flex flex-1 flex-col gap-12 px-6 py-12 sm:px-10 md:px-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-20 xl:px-28">
				<Paper className="mx-auto flex w-full max-w-md flex-col gap-10 rounded-[28px] border border-slate-200/70 bg-white/95 px-6 py-8 shadow-xl backdrop-blur-md transition-shadow duration-200 hover:shadow-2xl sm:max-w-lg sm:px-10 sm:py-10 lg:col-span-5 lg:mx-0 lg:max-w-none lg:p-12 dark:border-white/10 dark:bg-slate-900/80 dark:text-white">
					<SignUpPageTitle />
					<JwtSignUpTab />
				</Paper>

				<AuthPagesMessageSection />
			</div>
		</div>
	);
}

export default SignUpPageView;
