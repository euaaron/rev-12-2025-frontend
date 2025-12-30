import type { ICar } from "../types/ICar";

import { sanitizeHttpUrl } from "./safeInput";

export type DeviceKind = "mobile" | "tablet" | "desktop";

export function getCarImage(car: ICar, device: DeviceKind) {
  const selected =
    device === "mobile"
      ? car.mobile || car.tablet || car.desktop || ""
      : device === "tablet"
        ? car.tablet || car.desktop || car.mobile || ""
        : car.desktop || car.tablet || car.mobile || "";

  return sanitizeHttpUrl(selected) ?? "";
}
