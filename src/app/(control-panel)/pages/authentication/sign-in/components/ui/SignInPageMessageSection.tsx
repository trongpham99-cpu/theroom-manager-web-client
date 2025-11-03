import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const highlights = [
	{
		title: 'Smart scheduling',
		description: 'Surface real-time room availability and prevent double bookings automatically.'
	},
	{
		title: 'Team alignment',
		description: 'Share approvals, notes, and reminders that update across every device instantly.'
	},
	{
		title: 'Actionable insights',
		description: 'Monitor utilisation trends to plan ahead with confidence.'
	}
];

function SignInPageMessageSection() {
	return (
		<Box
			className="relative hidden h-full flex-auto items-center justify-center overflow-hidden rounded-[30px] border border-white/10 px-14 py-16 text-left shadow-[0_28px_80px_-40px_rgba(15,23,42,0.65)] backdrop-blur-md md:flex xl:px-24"
			sx={(theme) => ({
				backgroundImage: `linear-gradient(140deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.9)} 45%, ${alpha(theme.palette.secondary.main, 0.88)} 100%)`,
				color: theme.palette.primary.contrastText
			})}
		>
			<svg
				className="pointer-events-none absolute inset-0 opacity-40"
				viewBox="0 0 960 540"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMax slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Box
					component="g"
					className="opacity-30"
					fill="none"
					stroke="currentColor"
					strokeWidth="120"
				>
					<circle
						r="234"
						cx="196"
						cy="23"
					/>
					<circle
						r="234"
						cx="790"
						cy="491"
					/>
				</Box>
			</svg>

			<Box
				component="span"
				className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"
			/>
			<Box
				component="span"
				className="pointer-events-none absolute bottom-[-8rem] -left-12 h-80 w-80 rounded-full bg-white/20 blur-3xl"
			/>

			<div className="relative z-10 flex w-full max-w-3xl flex-col gap-10">
				<div className="space-y-6">
					<div className="text-4xl leading-tight font-semibold text-white lg:text-5xl lg:leading-[1.1]">
						A responsive command centre for every booking.
					</div>
					<div className="max-w-2xl text-base leading-relaxed text-white/80">
						Streamline operations, automate handovers, and keep every team member in the loop with a clean,
						responsive interface.
					</div>
				</div>

				<div className="grid gap-4 text-left lg:grid-cols-2">
					{highlights.map((item) => (
						<div
							key={item.title}
							className="flex h-full items-start gap-3 rounded-2xl bg-white/10 p-5 shadow-inner shadow-black/10 backdrop-blur transition-all duration-200 hover:bg-white/15"
						>
							<FuseSvgIcon className="mt-1 h-5 w-5 text-emerald-200">
								heroicons-outline:check-circle
							</FuseSvgIcon>
							<div className="space-y-1">
								<div className="text-sm font-semibold text-white">{item.title}</div>
								<div className="text-sm text-white/80">{item.description}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</Box>
	);
}

export default SignInPageMessageSection;
