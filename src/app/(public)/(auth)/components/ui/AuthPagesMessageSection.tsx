import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const highlights = [
	{
		title: 'Smart scheduling',
		description: 'Coordinate bookings and avoid clashes with live availability across every space.'
	},
	{
		title: 'Realtime collaboration',
		description: 'Share updates, approvals, and checklists that stay in sync on any device.'
	},
	{
		title: 'Insightful analytics',
		description: 'Monitor utilisation trends and act fast with digestible dashboards.'
	},
	{
		title: 'Automated workflows',
		description: 'Trigger reminders and handovers the moment a booking changes.'
	}
];

function AuthPagesMessageSection() {
	return (
		<Box
			className="relative z-0 mt-6 flex w-full flex-1 flex-col items-stretch justify-center overflow-hidden rounded-3xl border border-white/15 px-8 py-12 text-center shadow-[0_32px_80px_-32px_rgba(15,23,42,0.65)] backdrop-blur-md md:px-14 md:py-16 lg:col-span-7 lg:mt-0 lg:h-full lg:items-start lg:rounded-[36px] lg:border-0 lg:px-20 lg:py-24 lg:text-left"
			sx={(theme) => ({
				backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.92)} 45%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
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
				className="pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"
			/>
			<Box
				component="span"
				className="pointer-events-none absolute bottom-[-6rem] -left-16 h-80 w-80 rounded-full bg-white/20 blur-3xl lg:left-10 lg:h-96 lg:w-96"
			/>

			<div className="relative z-10 flex w-full flex-col gap-10">
				<div className="space-y-6">
					<div className="text-4xl leading-tight font-semibold text-white sm:text-5xl md:text-6xl md:leading-[1.1]">
						Reimagine how your team manages every room.
					</div>
					<div className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 lg:mx-0">
						Take the guesswork out of scheduling, track real-time availability, and keep everyone aligned
						with a beautifully responsive workspace.
					</div>
				</div>

				<div className="grid gap-4 text-left sm:grid-cols-2">
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

export default AuthPagesMessageSection;
