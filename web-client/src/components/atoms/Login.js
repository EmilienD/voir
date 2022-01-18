import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { useUserStore } from '../../model/state'

export const Login = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const setUser = useUserStore((state) => state.setUser)
  useEffect(() => {}, [])
  return (
    <Tabs onSelect={(i) => setTabIndex(i)}>
      <TabList className="flex flex-row">
        <Tab
          className={classNames('flex-1 px-4 py-2 text-center round-t-sm', {
            'bg-white opacity-80 text-black': tabIndex === 0,
          })}
        >
          <h2>Login</h2>
        </Tab>
        <Tab
          className={classNames('flex-1 px-4 py-2 text-center rounded-t-sm', {
            'bg-white opacity-80 text-black': tabIndex === 1,
          })}
        >
          <h2>Sign up</h2>
        </Tab>
      </TabList>
      <TabPanel>
        <section className="bg-white opacity-80 rounded-b-sm px-4 py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              fetch('http://localhost:3000/api/v1/users/token', {
                method: 'POST',
                body: JSON.stringify({
                  email: document.querySelector('#email').value,
                  password: document.querySelector('#password').value,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((res) => (res.status === 200 ? res.json() : null))
                .then((res) => {
                  setUser(res?.user)
                })
                .catch((err) => {
                  console.log(err)
                })
            }}
            method="POST"
            className="text-black grid gap-4 grid-cols-1 md:grid-cols-2 max-w-lg m-h-auto"
          >
            <label className="md:justify-self-end" htmlFor="email">
              Email:
            </label>
            <input className="border-2" id="email" type="text" />
            <label className="md:justify-self-end" htmlFor="password">
              Password:
            </label>
            <input className="border-2" id="password" type="password" />
            <button type="submit" className="md:col-start-2">
              Login
            </button>
          </form>
        </section>
      </TabPanel>
      <TabPanel>
        <section className="bg-white opacity-80 rounded-b-sm px-4 py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              fetch('http://localhost:3000/api/v1/users', {
                method: 'POST',
                body: JSON.stringify({
                  email: document.querySelector('#email').value,
                  password: document.querySelector('#password').value,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((res) => (res.status === 200 ? res.json() : null))
                .then((res) => {
                  setUser(res?.user)
                })
                .catch((err) => {
                  console.log(err)
                })
            }}
            method="POST"
            className="text-black grid gap-4 grid-cols-1 md:grid-cols-2 max-w-lg m-h-auto"
          >
            <label className="md:justify-self-end" htmlFor="email">
              Email:
            </label>
            <input className="border-2" id="email" type="text" />
            <label className="md:justify-self-end" htmlFor="password">
              Password:
            </label>
            <input className="border-2" id="password" type="password" />
            <button type="submit" className="md:col-start-2">
              Sign up
            </button>
          </form>
        </section>
      </TabPanel>
    </Tabs>
  )
}
