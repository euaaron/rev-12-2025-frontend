import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import { ICar } from "../types/ICar";
import { sanitizeHttpUrl } from "../utils/safeInput";

type Props = {
	car: ICar;
	imageUrl?: string;
	isFooterCollapsed?: boolean;
	onToggleFooterCollapsed?: () => void;
};

export function Car({
	car,
	imageUrl,
	isFooterCollapsed = false,
	onToggleFooterCollapsed,
}: Props) {
	const title = `${car.make ?? ""} ${car.model ?? ""}`.trim();
	const subtitleParts = [car.year ? String(car.year) : "", car.color ?? ""].filter(
		Boolean
	);
	const safeImageUrl = imageUrl ? sanitizeHttpUrl(imageUrl) : undefined;
	const hasImage = Boolean(safeImageUrl);
	const canToggleFooter = hasImage && Boolean(onToggleFooterCollapsed);

	return (
		<Card
			sx={
				hasImage
					? {
						position: "relative",
						overflow: "hidden",
						width: "100%",
						aspectRatio: "3 / 2",
					}
					: {
						width: "100%",
						aspectRatio: "3 / 2",
					}
			}
		>
			{safeImageUrl ? (
				<CardMedia
					component="img"
					image={safeImageUrl}
					alt={title ? `${title} car` : "Car"}
					onClick={canToggleFooter ? onToggleFooterCollapsed : undefined}
					sx={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						cursor: canToggleFooter ? "pointer" : undefined,
					}}
				/>
			) : null}

			<CardContent
				sx={
					hasImage
						? (theme) => ({
							position: "absolute",
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 1,
							backgroundColor: alpha(theme.palette.common.black, 0.35),
							backdropFilter: "blur(10px)",
							borderTop: `1px solid ${alpha(theme.palette.common.white, 0.22)}`,
							overflow: "hidden",
							transition: theme.transitions.create(
								["max-height", "opacity", "padding-top", "padding-bottom"],
								{
									duration: theme.transitions.duration.shorter,
									easing: theme.transitions.easing.easeInOut,
								}
							),
							maxHeight: isFooterCollapsed ? 0 : 120,
							opacity: isFooterCollapsed ? 0 : 1,
							paddingTop: isFooterCollapsed ? 0 : undefined,
							paddingBottom: isFooterCollapsed ? 0 : undefined,
							pointerEvents: isFooterCollapsed ? "none" : "auto",
						})
						: undefined
				}
			>
				<Stack spacing={0.5}>
					<Typography
						variant="h6"
						component="div"
						sx={
							hasImage
								? (theme) => ({ color: theme.palette.common.white })
								: undefined
						}
					>
						{title || "Car"}
					</Typography>
					{subtitleParts.length ? (
						<Typography
							variant="body2"
							color={hasImage ? undefined : "text.secondary"}
							sx={
								hasImage
									? (theme) => ({ color: alpha(theme.palette.common.white, 0.8) })
									: undefined
							}
						>
							{subtitleParts.join(" • ")}
						</Typography>
					) : null}
				</Stack>
			</CardContent>
		</Card>
	);
}
