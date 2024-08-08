const getBreakpoint = () => {
  let breakpoint
  if (window.matchMedia("(max-width: 720px)").matches) {
    breakpoint = "sm"
  } else if (window.matchMedia("(min-width: 721px) and (max-width: 1280px)").matches) {
    breakpoint = "md"
  } else {
    breakpoint = "lg"
  }
  return breakpoint
}

export default { getBreakpoint }
