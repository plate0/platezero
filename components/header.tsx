import Image from 'next/image'
import Link from 'next/link'

export const Header = () => (
  <header className="bg-primary-600 py-2">
    <Link href="/">
      <a className="navbar-brand py-0 d-none d-md-block">
        <Image
          src="/static/logo-reverse.png"
          alt="PlateZero"
          className="w-28"
        />
      </a>
    </Link>
  </header>
)
