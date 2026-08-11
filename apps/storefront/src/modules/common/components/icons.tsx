import type { SVGProps } from "react"

export type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
})

export function SearchIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.2 4.2" /></svg>
}

export function HeartIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.5Z" /></svg>
}

export function SunIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v2M12 19.5v2M4.7 4.7l1.4 1.4M17.9 17.9l1.4 1.4M2.5 12h2M19.5 12h2M4.7 19.3l1.4-1.4M17.9 6.1l1.4-1.4" /></svg>
}

export function MoonIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M20.3 15.3A8 8 0 0 1 8.7 3.7 8.5 8.5 0 1 0 20.3 15.3Z" /></svg>
}

export function SparkleIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m12 2 1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></svg>
}

export function SlidersIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" /><circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" /></svg>
}

export function CheckIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m5 12 4.2 4.2L19 6.5" /></svg>
}

export function ArrowIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M5 12h13M13 6l6 6-6 6" /></svg>
}

export function BellIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
}

export function XIcon({ size = 18, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>
}
