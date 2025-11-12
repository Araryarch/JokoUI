'use client'

import DefaultNavbar from './ui/Default'
import GlassNavbar from './ui/Glass'

export type BaseNavbarProps = {
  title?: string
  content?: React.ReactNode
  links?: { label: string; href: string }[]
}

const NAVBAR_MAP = {
  default: DefaultNavbar,
  glass: GlassNavbar,
}

type NavbarType = keyof typeof NAVBAR_MAP

export type NavbarProps = BaseNavbarProps & {
  type?: NavbarType
}

export default function Navbar({ type = 'default', ...props }: NavbarProps) {
  const SelectedNavbar = NAVBAR_MAP[type] || DefaultNavbar
  return <SelectedNavbar {...props} />
}
