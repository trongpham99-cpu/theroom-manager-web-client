import Paper from '@mui/material/Paper';
import SignInPageTitle from '../ui/SignInPageTitle';
import SignInPageForm from '../forms/SignInPageForm';

/**
 * The classic sign in page.
 */
function ClassicSignInPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center px-4 py-8 sm:justify-center sm:px-6 sm:py-12">
			<Paper className="mx-auto min-h-full w-full border-0 bg-transparent px-6 py-10 shadow-none sm:min-h-auto sm:max-w-xl sm:rounded-[28px] sm:border sm:border-slate-200/70 sm:bg-white/95 sm:px-12 sm:py-14 sm:shadow-xl sm:backdrop-blur-md dark:sm:border-white/10 dark:sm:bg-slate-900/80">
				<div className="mx-auto flex w-full max-w-lg flex-col gap-10">
					<SignInPageTitle />
					<SignInPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default ClassicSignInPageView;
