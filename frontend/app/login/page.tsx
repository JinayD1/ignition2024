"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { login } from '@/actions'
import "./login.css"

const Page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  return (
    <div className="container">
      <h4>Login</h4>
      <p>Have an account?</p>
      <form onSubmit={(e) => {
        e.preventDefault()
        login(email, password)
      }}>
        <input type="email" placeholder='Username' value={email} onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
        <input type="submit" value="SIGN IN"/>
        <div className="remember-forgot">
          <label><input type="checkbox"/> Remember Me</label>
          <a href="#">Forgot Password</a>
        </div>
      </form>
      {message && <h6>{message}</h6>}
      <p>— Or Sign In With —</p>
      <div className="social-login">
        <button>Facebook</button>
        <button>Google</button>
      </div>
      <p>Don't have an account? <Link href='/sign_up' className="signup-link">Sign up!</Link></p>
    </div>
  )
}

export default Page
