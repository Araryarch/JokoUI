import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

interface Link {
  href: string
  label: string
}

interface NavbarProps {
  title?: string
  content?: React.ReactNode
  links?: Link[]
}

const useAnimation = (isActive: boolean, delay = 0) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: 'translateY(20px)',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setStyle({
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      })
    }, 50)

    return () => clearTimeout(timer)
  }, [isActive, delay])

  return style
}

const StaggeredText: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <span className="inline-block">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
            transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * 0.03}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

const GlassNavbar: React.FC<NavbarProps> = ({ title, content, links }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const navbarStyle = useAnimation(isLoaded, 0)

  return (
    <>
      <nav
        className={`w-full h-16 bg-white/10 text-white flex items-center justify-between px-6 fixed top-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-white/20 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
        style={{
          ...navbarStyle,
          transform: isLoaded ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <h1 className="text-2xl font-bold tracking-tight cursor-pointer relative group overflow-hidden">
          <StaggeredText text={title || 'Navbar'} delay={0.3} />
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/50 transition-all duration-500 ease-out group-hover:w-full"></span>
        </h1>

        <div className="hidden md:flex items-center gap-8">
          {links?.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium tracking-wide uppercase transition-all duration-300 group"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {link.label}
              <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-white/50 transition-all duration-500 ease-out group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {content && (
          <div
            className="hidden md:block ml-6"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.6s ease 0.8s',
            }}
          >
            {content}
          </div>
        )}

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
          onClick={toggleSidebar}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease 0.6s',
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: isSidebarOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {isSidebarOpen ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Menu size={24} strokeWidth={1.5} />
            )}
          </div>
        </button>
      </nav>

      <div
        className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white/10 text-white z-40 border-r border-white/20 overflow-y-auto md:hidden backdrop-blur-md`}
        style={{
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex flex-col gap-6 p-6">
          {links?.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="text-lg font-semibold flex items-center gap-3 py-2 border-b border-white/10 last:border-b-0 relative overflow-hidden group"
              onClick={toggleSidebar}
              style={{
                opacity: isSidebarOpen ? 1 : 0,
                transform: isSidebarOpen
                  ? 'translateX(0)'
                  : 'translateX(-30px)',
                transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${isSidebarOpen ? i * 0.1 : 0}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)'
                e.currentTarget.style.color = '#e5e7eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)'
                e.currentTarget.style.color = ''
              }}
            >
              <span className="absolute left-0 w-1 h-0 bg-white/50 transition-all duration-300 group-hover:h-full"></span>
              {link.label}
            </a>
          ))}
          {content && (
            <div
              className="mt-4 border-t border-white/10 pt-4"
              style={{
                opacity: isSidebarOpen ? 1 : 0,
                transform: isSidebarOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
              }}
            >
              {content}
            </div>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black z-30 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
          style={{
            opacity: isSidebarOpen ? 0.2 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </>
  )
}

export default GlassNavbar
