import React, { useState } from 'react'
import { HamburgerMenuIcon } from '../atoms/Icons'
import { Login } from '../atoms/Login'
import cn from 'classnames'
import { useUserStore } from '../../model/state'

export const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  return (
    <div
      className={cn(
        'z-10 overflow-hidden transition-all fixed bottom-0 right-0 opacity-80 bg-black rounded-tl-lg flex flex-col-reverse duration-500',
        {
          'h-28': !menuOpen,
          'h-screen': menuOpen,
          'w-28': !menuOpen,
          'lg:w-3/5': menuOpen,
          'w-11/12': menuOpen,
        }
      )}
    >
      <button className="p-4 self-end" onClick={() => setMenuOpen(!menuOpen)}>
        <HamburgerMenuIcon className="h-20 fill-white" />
      </button>
      <ul className="text-white text-xl p-4">
        <li>
          {user ? (
            <button
              className="text-white"
              onClick={() => {
                fetch('http://localhost:3000/api/v1/users/token', {
                  method: 'DELETE',
                })
                  .then((response) => {
                    setUser(null)
                  })
                  .catch((err) => {
                    console.error(err)
                  })
              }}
            >
              logout
            </button>
          ) : (
            <Login />
          )}
        </li>
      </ul>
    </div>
  )
}
