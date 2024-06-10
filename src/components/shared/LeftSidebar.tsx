import { sidebarLinks } from '@/constants'
import { INITIAL_USER, useUserContext } from '@/context/AuthContext'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { INavLink } from '@/types'
import React from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import MyLoader from './ContentLoader'

const LeftSidebar = () => {
  const { user, setIsAuthenticated, setUser, isLoading } = useUserContext()
  const { mutate: signOut } = useSignOutAccount()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault()
    signOut()
    setIsAuthenticated(false)
    setUser(INITIAL_USER)
    navigate('/sign-in')
  }

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className='flex gap-3 items-center'>
          <img src="/assets/images/logo.svg" alt="logo"
            width={170}
            height={36} />
        </Link>

        {isLoading || !user.email ? (
          <MyLoader />
        ) : (
          <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
            <img src={user.imageUrl || '/assets/images/profile.jpg'} alt="profile" className='h-14 w-14 rounded-full object-cover' />

            <div className='flex flex-col'>
              <p className='body-bold'>
                {user.name}
              </p>
              <p className='small-regular text-light-3'>
                @{user.username}
              </p>
            </div>
          </Link>
        )}


        <ul className='flex flex-col gap-3'>
          {sidebarLinks.map((link: INavLink) => (
            <li key={link.label} className={`group leftsidebar-link ${pathname === link.route && 'hover:bg-white/15 bg-white/15  border-dark-4 '}`}>
              <NavLink to={link.route} className='flex gap-4 items-center px-4 py-3'>
                <img src={link.imgURL} alt={link.label} className={` ${pathname === link.route && ''}`}
                  width={32} />

                {link.label}
              </NavLink>

            </li>
          ))}
        </ul>
      </div>

      <Button variant='ghost' className='shad-button_ghost'
        onClick={(e) => handleSignOut(e)}>
        <img src="/assets/icons/logout.svg" alt="logout icon"
          width={30}
        />
        <p className='small-medium lg:base-medium'>Log out</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar