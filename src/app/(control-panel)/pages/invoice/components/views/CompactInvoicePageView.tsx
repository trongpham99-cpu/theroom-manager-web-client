'use client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { useInvoice } from 'src/app/(control-panel)/apps/invoices/api/hooks/useInvoice';
import FuseLoading from '@fuse/core/FuseLoading';
import { format } from 'date-fns/format';
import { useMemo } from 'react';

/**
 * The compact invoice page.
 */
function CompactInvoicePageView() {
	const invoiceId = useMemo(() => {
		const params = new URLSearchParams(window.location.search);
		return params.get('id') || '';
	}, []);

	const { data: invoice, isLoading, isError } = useInvoice(invoiceId);

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError || !invoice) {
		return (
			<Box className="flex h-full items-center justify-center p-8">
				<Typography variant="h6" color="error">
					Invoice not found
				</Typography>
			</Box>
		);
	}
	return (
		<div className="inline-block w-full overflow-auto p-6 text-left sm:p-10 print:p-0">
			<motion.div
				initial={{ opacity: 0, y: 200 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ bounceDamping: 0 }}
			>
				<Card className="mx-auto w-3xl rounded-xl p-16 shadow-sm print:w-auto print:rounded-none print:bg-transparent print:shadow-none">
					<CardContent>
						<div className="flex items-start justify-between">
							<div className="grid grid-cols-2 gap-x-4 gap-y-0.25">
								<Typography
									className="text-4xl tracking-tight mb-4"
									color="text.secondary"
								>
									HÓA ĐƠN
								</Typography>
								<Typography className="text-4xl mb-4"></Typography>
								<Typography
									className="font-medium tracking-tight"
									color="text.secondary"
								>
									KỲ THÁNG
								</Typography>
								<Typography className="font-medium">
									{invoice.month}/{invoice.year}
								</Typography>
								<Typography
									className="font-medium tracking-tight"
									color="text.secondary"
								>
									NGÀY TẠO
								</Typography>
								<Typography className="font-medium">
									{format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
								</Typography>
								<Typography
									className="font-medium tracking-tight"
									color="text.secondary"
								>
									TỔNG TIỀN
								</Typography>
								<Typography className="font-medium">
									{invoice.total_amount?.toLocaleString('vi-VN')} VNĐ
								</Typography>
							</div>

							<Box
								sx={(theme) => ({
									backgroundColor: theme.vars.palette.primary.dark,
									color: theme.palette.getContrastText(theme.palette.primary.dark)
								})}
								className="-mr-16 grid auto-cols-max grid-flow-col gap-x-8 rounded-l-2xl px-8 py-6"
							>
								<div className="w-24 place-self-center">
									<img
										className="w-24"
										src="/assets/images/logo/logo.png"
										alt="logo"
									/>
								</div>
								<Box
									className="text-md border-l pl-10"
									sx={{
										borderColor: (theme) =>
											alpha(theme.palette.getContrastText(theme.palette.primary.dark), 0.25)
									}}
								>
									<Typography className="font-medium">The Room Manager</Typography>
									<Typography>Quản lý phòng trọ</Typography>
									<Typography>Hà Nội, Việt Nam</Typography>
									<Typography>+84 123 456 789</Typography>
									<Typography>contact@theroom.vn</Typography>
									<Typography>www.theroom.vn</Typography>
								</Box>
							</Box>
						</div>

						<div className="text-md">
							<Typography className="text-xl font-medium mb-4">Thông tin khách hàng</Typography>
							<div className="grid grid-cols-12 gap-x-1">
								<Typography
									className="col-span-10 font-medium tracking-tight"
									color="text.secondary"
								>
									TÊN KHÁCH HÀNG
								</Typography>
								<Typography className="col-span-2 text-right font-medium">
									{invoice.customer_name || '-'}
								</Typography>
								<Typography
									className="col-span-10 font-medium tracking-tight"
									color="text.secondary"
								>
									SỐ ĐIỆN THOẠI
								</Typography>
								<Typography className="col-span-2 text-right font-medium">
									{invoice.phone || '-'}
								</Typography>
								<Typography
									className="col-span-10 font-medium tracking-tight"
									color="text.secondary"
								>
									MÃ PHÒNG
								</Typography>
								<Typography className="col-span-2 text-right font-medium">
									{invoice.room_code || '-'}
								</Typography>
							</div>
						</div>

						<div className="mt-12 grid grid-cols-12 gap-x-1">
							<div
								className="text-md col-span-10 font-medium"
								color="text.secondary"
							>
								DỊCH VỤ
							</div>
							<div
								className="text-md col-span-2 text-right font-medium"
								color="text.secondary"
							>
								THÀNH TIỀN
							</div>

							<div className="col-span-12 my-4 border-b" />

							{/* Tiền phòng */}
							{invoice.actual_room_fee > 0 && (
								<>
									<Typography className="col-span-10 text-lg font-medium">
										Tiền phòng
									</Typography>
									<Typography className="col-span-2 self-center text-right">
										{invoice.actual_room_fee?.toLocaleString('vi-VN')} VNĐ
									</Typography>
									<div className="col-span-12 my-2 border-b border-dashed" />
								</>
							)}

							{/* Tiền điện */}
							{invoice.electricity?.price > 0 && (
								<>
									<Typography className="col-span-10 text-lg font-medium">
										Tiền điện
									</Typography>
									<Typography className="col-span-2 self-center text-right">
										{invoice.electricity.price?.toLocaleString('vi-VN')} VNĐ
									</Typography>
									<div className="col-span-12 my-2 border-b border-dashed" />
								</>
							)}

							{/* Tiền nước */}
							{invoice.water_fee > 0 && (
								<>
									<Typography className="col-span-10 text-lg font-medium">
										Tiền nước
									</Typography>
									<Typography className="col-span-2 self-center text-right">
										{invoice.water_fee?.toLocaleString('vi-VN')} VNĐ
									</Typography>
									<div className="col-span-12 my-2 border-b border-dashed" />
								</>
							)}

							{/* Phí quản lý */}
							{invoice.management_fee > 0 && (
								<>
									<Typography className="col-span-10 text-lg font-medium">Phí quản lý</Typography>
									<Typography className="col-span-2 self-center text-right">
										{invoice.management_fee?.toLocaleString('vi-VN')} VNĐ
									</Typography>
									<div className="col-span-12 my-2 border-b border-dashed" />
								</>
							)}

							{/* Nợ cũ */}
							{invoice.old_debt > 0 && (
								<>
									<Typography className="col-span-10 text-lg font-medium">Nợ cũ</Typography>
									<Typography className="col-span-2 self-center text-right">
										{invoice.old_debt?.toLocaleString('vi-VN')} VNĐ
									</Typography>
									<div className="col-span-12 my-2 border-b border-dashed" />
								</>
							)}

							{/* Giảm trừ */}
							{invoice.deduction > 0 && (
								<>
									<Typography className="col-span-10 text-lg font-medium text-error">Giảm trừ</Typography>
									<Typography className="col-span-2 self-center text-right text-error">
										-{invoice.deduction?.toLocaleString('vi-VN')} VNĐ
									</Typography>
									<div className="col-span-12 my-2 border-b border-dashed" />
								</>
							)}

							<div className="col-span-12 mt-8" />

							<Typography
								className="col-span-10 self-center text-2xl font-medium tracking-tight"
								color="text.secondary"
							>
								TỔNG CỘNG
							</Typography>
							<div className="col-span-2 text-right text-2xl font-medium">{invoice.total_amount?.toLocaleString('vi-VN')} VNĐ</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}

export default CompactInvoicePageView;

/**

 Use the following elements to add breaks to your pages. This will make sure that the section in between
 these elements will be printed on a new page. The following two elements must be used before and after the
 page content that you want to show as a new page. So, you have to wrap your content with them.

 Elements:
 ---------
 <div className="page-break-after"></div>
 <div className="page-break-before"></div>

 Example:
 --------

 Initial page content!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>

 This is the second page!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>

 This is the third page!

 <div className="page-break-after"></div>
 <div className="page-break-before"></div>
 * */
