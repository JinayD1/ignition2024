"use client"
import React, { useState } from 'react'
import Link from 'next/link'

const page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const sign_up = async () => {
    const reqJson = await fetch('http://192.168.2.66:5000/sign_up', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })})
    .then(reqJson => reqJson.json())
    .then(resdata => setMessage(resdata.message))
  }

  return (
    <>
        <h4>Sign Up</h4>
        <form onSubmit={(e) => {
          e.preventDefault()
          sign_up()
          }}>
            <input type="email" placeholder='email' value={email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)}/>
            <input type="submit" name='Submit'/>
            <h6>{message}</h6>
        </form>
        <p>Already have an account?&nbsp;</p><Link href='/login'>Log in!</Link>
    </>
  )
}

export default page
