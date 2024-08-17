"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { login } from '@/actions'

const page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  return (
    <>
        <h4>Log In</h4>
        <form onSubmit={(e) => {
          e.preventDefault()
          login(email, password)
          }}>
            <input type="email" placeholder='email' value={email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)}/>
            <input type="submit" name='Submit'/>
            <h6>{message}</h6>
        </form>
        <p>Don't have an account?&nbsp;</p><Link href='/sign_up'>Sign up!</Link>
    </>
  )
}

export default page