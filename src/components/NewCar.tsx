import SendIcon from "@mui/icons-material/Send";
import {
	Box,
	Button,
	Stack,
	TextField,
} from "@mui/material";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { useCars } from "../contexts/CarsContext";
import {
	parseCarYear,
	sanitizeDigitsInput,
	sanitizeHttpUrl,
	sanitizeTextInput,
} from "../utils/safeInput";

type CarInput = {
	make: string;
	model: string;
	year: number;
	color: string;
	mobile?: string;
	tablet?: string;
	desktop?: string;
};

export function NewCar({ onSubmitted }: { onSubmitted?: () => void }) {
	const { createCar, creating } = useCars();
	const [make, setMake] = useState("");
	const [model, setModel] = useState("");
	const [year, setYear] = useState("");
	const [color, setColor] = useState("");
	const [mobileImageUrl, setMobileImageUrl] = useState("");
	const [tabletImageUrl, setTabletImageUrl] = useState("");
	const [desktopImageUrl, setDesktopImageUrl] = useState("");

	const canSubmit = useMemo(() => {
		const yearNumber = parseCarYear(year);
		return (
			sanitizeTextInput(make).trim().length > 0 &&
			sanitizeTextInput(model).trim().length > 0 &&
			sanitizeTextInput(color).trim().length > 0 &&
			yearNumber !== undefined
		);
	}, [make, model, year, color]);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!canSubmit) return;

		const parsedYear = parseCarYear(year);
		if (parsedYear === undefined) return;

		const params: CarInput = {
			make: sanitizeTextInput(make).trim(),
			model: sanitizeTextInput(model).trim(),
			year: parsedYear,
			color: sanitizeTextInput(color).trim(),
		};

		const mobile = sanitizeHttpUrl(mobileImageUrl);
		const tablet = sanitizeHttpUrl(tabletImageUrl);
		const desktop = sanitizeHttpUrl(desktopImageUrl);
		if (mobile) params.mobile = mobile;
		if (tablet) params.tablet = tablet;
		if (desktop) params.desktop = desktop;

		await createCar(params);
		setMake("");
		setModel("");
		setYear("");
		setColor("");
		setMobileImageUrl("");
		setTabletImageUrl("");
		setDesktopImageUrl("");
		onSubmitted?.();
	}

	return (
		<Box component="form" onSubmit={handleSubmit}>
			<Stack spacing={2}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
					<TextField
						label="Make"
						value={make}
						onChange={(e) => setMake(sanitizeTextInput(e.target.value))}
						slotProps={{ htmlInput: { maxLength: 64 } }}
						fullWidth
					/>
					<TextField
						label="Model"
						value={model}
						onChange={(e) => setModel(sanitizeTextInput(e.target.value))}
						slotProps={{ htmlInput: { maxLength: 64 } }}
						fullWidth
					/>
				</Stack>

				<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
					<TextField
						label="Year"
						value={year}
						onChange={(e) => setYear(sanitizeDigitsInput(e.target.value, 4))}
						slotProps={{
							htmlInput: {
								inputMode: "numeric",
								maxLength: 4,
								pattern: "\\d{4}",
							},
						}}
						fullWidth
					/>
					<TextField
						label="Color"
						value={color}
						onChange={(e) => setColor(sanitizeTextInput(e.target.value))}
						slotProps={{ htmlInput: { maxLength: 64 } }}
						fullWidth
					/>
				</Stack>

				<Stack spacing={2}>
					<TextField
						label="Mobile image URL"
						value={mobileImageUrl}
						onChange={(e) => setMobileImageUrl(sanitizeTextInput(e.target.value, 2048))}
						slotProps={{ htmlInput: { maxLength: 2048 } }}
						type="url"
						fullWidth
					/>
					<TextField
						label="Tablet image URL"
						value={tabletImageUrl}
						onChange={(e) => setTabletImageUrl(sanitizeTextInput(e.target.value, 2048))}
						slotProps={{ htmlInput: { maxLength: 2048 } }}
						type="url"
						fullWidth
					/>
					<TextField
						label="Desktop image URL"
						value={desktopImageUrl}
						onChange={(e) => setDesktopImageUrl(sanitizeTextInput(e.target.value, 2048))}
						slotProps={{ htmlInput: { maxLength: 2048 } }}
						type="url"
						fullWidth
					/>
				</Stack>

				<Box>
					<Button
						type="submit"
						variant="contained"
						disabled={!canSubmit || creating}
						style={{display: 'flex', gap: "0.25rem", alignItems: 'center', justifyContent: 'center'}}
					>
						{creating ? "Adding…" : (
							<>
								<span style={{display: "flex" }}>Submit</span>
								<SendIcon fontSize="small" />
							</>
						)}
					</Button>
				</Box>
			</Stack>
		</Box>
	);
}
