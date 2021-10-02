import { asContainer } from 'components'
import Image from 'next/image'
import Link from 'next/link'

export const Header = () => (
  <header className="bg-primary-600 relative shadow py-2">
    <div className={asContainer('flex')}>
      <Link href="/">
        <a className="flex py-1">
          <Image
            src="/logo-reverse.png"
            alt="PlateZero"
            width={100}
            height={22}
          />
        </a>
      </Link>
    </div>
  </header>
)
