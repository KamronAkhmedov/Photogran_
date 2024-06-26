import { useUserContext } from '@/context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext()

  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <>
          <section className='flex flex-1 justify-center items-center felx-col py-10 px-5 lg:px-0'>
            <Outlet />
          </section>

          <img
            src='/assets/images/side-img.jpg'
            alt='side-img'
            className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat'
          />
        </>
      )}
    </>
  )
}

export default AuthLayout
