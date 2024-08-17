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
                <Image src="/put logo source in here" alt="Logo" width={80} height={80} />
                <h3>website name</h3>
                <p>placeholderidk</p>
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
                        <li><Link href='/'>Quizzes</Link></li>
                        <li><Link href='/'>ChatBot</Link></li>
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
