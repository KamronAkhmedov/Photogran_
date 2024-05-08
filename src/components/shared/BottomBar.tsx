import { bottombarLinks } from '@/constants'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const BottomBar = () => {
  const { pathname } = useLocation()

  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route

        return (
          <Link
            key={link.label}
            className={` ${isActive && 'bg-white/15 hover:!bg-white/15 '} rounded-[10px] hover:bg-white/10 flex-center flex-col gap-1 py-2 px-3 transition`}
            to={link.route}
          >
            <img src={link.imgURL} alt={link.label} width={28} height={25} />

            <p className='tiny-medium text-light-2'>{link.label}</p>
          </Link>
        )
      })}
    </section>
  )
}

export default BottomBar