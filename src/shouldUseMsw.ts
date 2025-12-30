export function shouldUseMsw(
  override: unknown,
  env: { DEV?: boolean; VITE_USE_MSW?: string }
) {
  return typeof override === "boolean"
    ? override
    : Boolean(env.DEV) || env.VITE_USE_MSW === "true";
}
