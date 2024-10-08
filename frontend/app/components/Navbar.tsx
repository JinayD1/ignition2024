import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSession } from '@/actions'
import LogoutForm from './LogoutButton'
import "./Navbar.css"

const Navbar = async () => {
    const session = await getSession()
    console.log(session)
    console.log(session.logged_in)
    return (
        <nav className="navbar">
            <div className="logo">
                <h3>UpNote.ai</h3>
            </div>
            <ul className="nav-links">
                <li><Link href='/'>Home</Link></li>
                {!session.logged_in && 
                    <>
                        <li><Link href='/sign_up'>Sign Up</Link></li>
                        <li><Link href='/login'>Log In</Link></li>
                    </>
                }
                {session.logged_in && 
                    <>  
                         <li><Link href='/note_session'>Note Sessions</Link></li>
                        <li><Link href='/quizzes'>Quizzes</Link></li>
                        <li><Link href='/chatbot'>ChatBot</Link></li>
                    </>
                }
            </ul>
            {session.logged_in && 
                <div className="logout-button">
                    <LogoutForm />
                </div>
            }
        </nav>
    )
}

export default Navbar
