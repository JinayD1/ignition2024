"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import "./signup.css"
import { login } from '@/actions'

const Page = () => {
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
    .then(() => login(email, password))
  }

  return (
    <div className="container">
      <h4>Sign Up</h4>
      <p>Create an account</p>
      <form onSubmit={(e) => {
        e.preventDefault()
        sign_up()
      }}>
        <input type="email" placeholder='Username' value={email} onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
        <input type="submit" value="SIGN UP"/>
        <div className="terms-of-service">
          <a href="https://docs.google.com/document/d/1Hnuz5L6raMIMWcWMIUZffffKm1vs0NEPrgEaKNrz6Cw/edit?usp=sharing">Terms of Service</a>
        </div>
      </form>
      {message && <h6>{message}</h6>}
      <p>Already have an account? <Link href='/login' className="login-link">Log in!</Link></p>
    </div>
  )
}

export default Page
