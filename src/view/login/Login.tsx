import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import net, { NetworkError } from '@/network/network'
import { message } from '@/component/message/Message'
import { Loader } from 'lucide-react'
import './index.css'
import { fetchLogin } from '@/network/login.api'
import { setRefreshToken, setToken } from '@/util/token'

export default function Login() {
    // TODO: navigate to the home when token is valid.
    const navigate = useNavigate()
    useEffect(() => {
        // Navigate to home screen if logged in.
    }, [])

    const [loading, setLoading] = useState(false)
    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (loading) return

        const form = e.currentTarget as HTMLFormElement
        const formdata = new FormData(form)

        const account = formdata.get('account')
        const password = formdata.get('password')
        if (!account) {
            message.warning('Please enter account')
            return
        }
        if (!password) {
            message.warning('Please enter password')
            return
        }

        try {
            setLoading(true)
            const data = await fetchLogin({
                account: account.toString(),
                password: password.toString(),
            })

            // Set tokens and user store after login successfully.
            setToken(data.token.access_token)
            setRefreshToken(data.token.refresh_token)
            console.log(data)
        } catch (err) {
            if (err instanceof NetworkError) {
                message.failed('Incorrect account or password')
                return
            }
            message.internal()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login">
            <section className="header">
                <h1>Log in</h1>
                <p>Welcome back, please enter login credentials to continue</p>
            </section>

            <section>
                <form className="form" onSubmit={login}>
                    <input name="account" placeholder="Enter Account" />
                    <input name="password" placeholder="Password" type="password" />

                    <button className={'submit ' + (loading ? 'loading' : '')} type="submit">
                        {loading && <Loader className="loader" />}
                        <span>Log in</span>
                    </button>
                </form>
            </section>
        </div>
    )
}
