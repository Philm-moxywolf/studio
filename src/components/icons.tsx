import { type SVGProps } from "react"
import { Loader2 } from "lucide-react"

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.1 2.182a10 10 0 0 1 3.8 0" />
      <path d="M18.82 4.044a10 10 0 0 1 2.336 2.336" />
      <path d="M21.818 10.1a10 10 0 0 1 0 3.8" />
      <path d="M21.156 18.82a10 10 0 0 1-2.336 2.336" />
      <path d="M13.9 21.818a10 10 0 0 1-3.8 0" />
      <path d="M5.18 21.156a10 10 0 0 1-2.336-2.336" />
      <path d="M2.182 13.9a10 10 0 0 1 0-3.8" />
      <path d="M4.044 5.18A10 10 0 0 1 6.38 2.844" />
      <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
      <path d="m13.5 15.5 5 5" />
    </svg>
  )
}

export function Loader(props: SVGProps<SVGSVGElement>) {
    return <Loader2 className="h-4 w-4 animate-spin" {...props} />
}
