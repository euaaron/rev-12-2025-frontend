import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";


import { appTheme } from "./theme";

describe("appTheme", () => {
  it("defines core palette/shape/typography", () => {
    expect(appTheme.palette.mode).toBe("dark");
    expect(appTheme.palette.primary.main).toBe("#006ddaff");
    expect(appTheme.palette.background.default).toBe("#0B0D10");

    // alpha() produces an rgba() string.
    expect(appTheme.palette.background.paper).toMatch(/^rgba\(/);

    expect(appTheme.shape.borderRadius).toBe(18);
    expect(appTheme.typography.button?.textTransform).toBe("none");
  });

  it("executes component styleOverrides functions", () => {
    type StyleFnArgs = { theme: typeof appTheme };

    // CssBaseline style override is a function of the theme.
    const cssBaseline = appTheme.components?.MuiCssBaseline?.styleOverrides;
    expect(typeof cssBaseline).toBe("function");
    const css = (cssBaseline as unknown as (t: typeof appTheme) => {
      body: {
        backgroundColor?: string;
        backgroundImage?: string;
      };
    })(appTheme);
    expect(css.body.backgroundColor).toBe(appTheme.palette.background.default);
    expect(css.body.backgroundImage).toContain("radial-gradient");

    const paper = appTheme.components?.MuiPaper?.styleOverrides;
    expect(typeof paper?.root).toBe("function");
    expect(typeof paper?.outlined).toBe("function");

    const paperRoot = (paper!.root as unknown as (args: StyleFnArgs) => {
      backgroundImage?: string;
    })({ theme: appTheme });
    expect(paperRoot.backgroundImage).toBe("none");

    const paperOutlined = (paper!.outlined as unknown as (args: StyleFnArgs) => {
      backdropFilter?: string;
    })({ theme: appTheme });
    expect(paperOutlined.backdropFilter).toContain("blur");

    const cardRoot = appTheme.components?.MuiCard?.styleOverrides?.root;
    expect(typeof cardRoot).toBe("function");
    const cardRootStyles = (cardRoot as unknown as (args: StyleFnArgs) => {
      backdropFilter?: string;
    })({ theme: appTheme });
    expect(cardRootStyles.backdropFilter).toContain("blur");

    const dialogPaper = appTheme.components?.MuiDialog?.styleOverrides?.paper;
    expect(typeof dialogPaper).toBe("function");

    // Number borderRadius branch.
    const dialogPaperStyles = (dialogPaper as unknown as (args: StyleFnArgs) => {
      borderRadius?: unknown;
    })({ theme: appTheme });
    expect(dialogPaperStyles.borderRadius).toBe(
      (appTheme.shape.borderRadius as number) + 6
    );

    // Non-number borderRadius branch.
    const weirdTheme = createTheme({ shape: { borderRadius: 20 } }) as Theme;
    (weirdTheme.shape as unknown as { borderRadius: unknown }).borderRadius = "20px";
    weirdTheme.palette = appTheme.palette;
    weirdTheme.spacing = appTheme.spacing;
    weirdTheme.transitions = appTheme.transitions;

    const dialogPaperStyles2 = (dialogPaper as unknown as (args: { theme: Theme }) => {
      borderRadius?: unknown;
    })({ theme: weirdTheme });
    expect(dialogPaperStyles2.borderRadius).toBe("20px");

    const buttonRoot = appTheme.components?.MuiButton?.styleOverrides?.root;
    expect(typeof buttonRoot).toBe("function");
    expect(
      (buttonRoot as unknown as (args: StyleFnArgs) => { borderRadius?: number })({
        theme: appTheme,
      }).borderRadius
    ).toBe(999);

    const iconButtonRoot = appTheme.components?.MuiIconButton?.styleOverrides?.root;
    expect(typeof iconButtonRoot).toBe("function");
    expect(
      (
        iconButtonRoot as unknown as (args: StyleFnArgs) => { borderRadius?: number }
      )({ theme: appTheme }).borderRadius
    ).toBe(12);

    const outlinedInputRoot =
      appTheme.components?.MuiOutlinedInput?.styleOverrides?.root;
    const outlinedInputNotched =
      appTheme.components?.MuiOutlinedInput?.styleOverrides?.notchedOutline;

    expect(typeof outlinedInputRoot).toBe("function");
    expect(typeof outlinedInputNotched).toBe("function");

    expect(
      (
        outlinedInputRoot as unknown as (args: StyleFnArgs) => { borderRadius?: number }
      )({ theme: appTheme }).borderRadius
    ).toBe(14);
    expect(
      (
        outlinedInputNotched as unknown as (args: StyleFnArgs) => { borderColor?: string }
      )({ theme: appTheme }).borderColor
    ).toMatch(/^rgba\(/);

    const selectStyles = appTheme.components?.MuiSelect?.styleOverrides;
    expect(typeof selectStyles?.select).toBe("function");
    expect(typeof selectStyles?.icon).toBe("function");
    expect(
      (selectStyles!.select as unknown as () => { backgroundColor?: string })()
        .backgroundColor
    ).toBe("transparent");
    expect((selectStyles!.icon as unknown as () => { opacity?: number })().opacity).toBe(
      1
    );

    const textFieldRoot = appTheme.components?.MuiTextField?.styleOverrides?.root;
    expect(typeof textFieldRoot).toBe("function");
    expect((textFieldRoot as unknown as () => { borderRadius?: number })().borderRadius).toBe(
      14
    );

    const menuPaper = appTheme.components?.MuiMenu?.styleOverrides?.paper;
    const menuList = appTheme.components?.MuiMenu?.styleOverrides?.list;
    expect(typeof menuPaper).toBe("function");
    expect(menuList).toEqual({ paddingTop: 0, paddingBottom: 0 });
    expect(
      (menuPaper as unknown as (args: StyleFnArgs) => { backdropFilter?: string })({
        theme: appTheme,
      }).backdropFilter
    ).toContain("blur");

    const menuItemRoot = appTheme.components?.MuiMenuItem?.styleOverrides?.root;
    expect(typeof menuItemRoot).toBe("function");
    expect(
      (menuItemRoot as unknown as (args: StyleFnArgs) => { borderBottom?: string })({
        theme: appTheme,
      }).borderBottom
    ).toContain("1px");
  });
});
