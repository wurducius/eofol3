const fs = require("fs")
const { resolve } = require("path")
const { DIRNAME_EOFOL_INTERNAL, PATH_SRC } = require("../constants/paths")
const { PATH_CWD } = require("../constants")
const mergeDeep = require("../util/merge-deep")

const append = (name, value) => `\n@${name}: ${value};`

const compileTheme = () => {
  const Theme = require(resolve(PATH_SRC, "theme.js"))
  const DefaultTheme = require(resolve(PATH_CWD, DIRNAME_EOFOL_INTERNAL, "styles", "default-theme.js"))

  const ThemeImpl = mergeDeep(DefaultTheme, Theme)

  const content = [
    append("breakpoint-sm", `${ThemeImpl.breakpoints[0].maxWidth}px`),
    append("breakpoint-md", `${ThemeImpl.breakpoints[1].maxWidth}px`),
    append("breakpoint-sm-min", `${0}px`),
    append("breakpoint-md-min", `${ThemeImpl.breakpoints[0].maxWidth + 1}px`),
    append("breakpoint-lg-min", `${ThemeImpl.breakpoints[1].maxWidth + 1}px`),
    append("breakpoint-sm-name", ThemeImpl.breakpoints[0].name),
    append("breakpoint-md-name", ThemeImpl.breakpoints[1].name),
    append("breakpoint-lg-name", ThemeImpl.breakpoints[2].name),
    "\n",
    append("color-primary", ThemeImpl.color.primary.base),
    append("color-primary-dark", ThemeImpl.color.primary.dark),
    append("color-primary-light", ThemeImpl.color.primary.light),
    "\n",
    append("color-secondary", ThemeImpl.color.secondary.base),
    append("color-secondary-dark", ThemeImpl.color.secondary.dark),
    append("color-secondary-light", ThemeImpl.color.secondary.light),
    "\n",
    append("color-bg", ThemeImpl.color.bg.base),
    append("color-bg-dark", ThemeImpl.color.bg.dark),
    append("color-bg-light", ThemeImpl.color.bg.light),
    "\n",
    append("color-form", ThemeImpl.color.form.base),
    "\n",
    append("color-font", ThemeImpl.color.typography),
    append("typography-default-font-family", ThemeImpl.typography.default.fontFamily),
    append("typography-default-font-size", ThemeImpl.typography.default.fontSize),
    append("typography-default-font-weight", ThemeImpl.typography.default.fontWeight),
    "\n",
    append("typography-default-h1-font-size", ThemeImpl.typography.default.h1.fontSize),
    append("typography-default-h1-font-weight", ThemeImpl.typography.default.h1.fontWeight),
    append("typography-default-h2-font-size", ThemeImpl.typography.default.h2.fontSize),
    append("typography-default-h2-font-weight", ThemeImpl.typography.default.h2.fontWeight),
    append("typography-default-h3-font-size", ThemeImpl.typography.default.h3.fontSize),
    append("typography-default-h3-font-weight", ThemeImpl.typography.default.h3.fontWeight),
    append("typography-default-h4-font-size", ThemeImpl.typography.default.h4.fontSize),
    append("typography-default-h4-font-weight", ThemeImpl.typography.default.h4.fontWeight),
    append("typography-default-h5-font-size", ThemeImpl.typography.default.h5.fontSize),
    append("typography-default-h5-font-weight", ThemeImpl.typography.default.h5.fontWeight),
    append("typography-default-h6-font-size", ThemeImpl.typography.default.h6.fontSize),
    append("typography-default-h6-font-weight", ThemeImpl.typography.default.h6.fontWeight),
    append("typography-default-p-font-size", ThemeImpl.typography.default.p.fontSize),
    append("typography-default-p-font-weight", ThemeImpl.typography.default.p.fontWeight),
    "\n",
    append("typography-button-font-size", ThemeImpl.typography.button.fontSize),
    append("typography-button-font-weight", ThemeImpl.typography.button.fontWeight),
    "\n",
    append("color-link", ThemeImpl.color.link.base),
    append("color-link-hover", ThemeImpl.color.link.dark),
    append("color-link-active", ThemeImpl.color.link.light),
    append("typography-link-font-size", ThemeImpl.typography.link.fontSize),
    append("typography-link-font-weight", ThemeImpl.typography.link.fontWeight),
    "\n",
    append("spacing-xs", ThemeImpl.spacing.xs),
    append("spacing-sm", ThemeImpl.spacing.sm),
    append("spacing-md", ThemeImpl.spacing.md),
    append("spacing-lg", ThemeImpl.spacing.lg),
    append("spacing-xl", ThemeImpl.spacing.xl),
    append("spacing-xxl", ThemeImpl.spacing.xxl),
    "\n",
    append("border-radius", ThemeImpl.borderRadius.borderRadius),
  ].reduce((acc, next) => acc + next, "")

  fs.writeFileSync(resolve(PATH_CWD, DIRNAME_EOFOL_INTERNAL, "styles", "theme.less"), content)
}

module.exports = compileTheme
