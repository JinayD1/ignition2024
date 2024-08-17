import React from 'react'
import Link from 'next/link'
import { getSession } from '@/actions'
import LogoutForm from './LogoutButton'

const Navbar = async () => {
    const session = await getSession()
    console.log(session)
    console.log(session.logged_in)
    return (
        <nav>
            <Link href='/'>Home</Link>
            {
                !session.logged_in && 
                <>
                    <Link href='/sign_up'>Sign Up</Link>
                    <Link href='/login'>Log In</Link>
                </>
            }
            {session.logged_in && 
            <>  
                <Link href='/'>Home</Link>
                <Link href='/'>Quizzes</Link>
                <Link href='/'> ChatBot </Link>
                <LogoutForm/>
            </>
            }
        </nav>
    )
  }

export default Navbar