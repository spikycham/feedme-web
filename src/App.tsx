import { RouterProvider } from 'react-router'
import { router } from '@/route'

import Cover from '@/view/cover/Cover'
import Message from '@/component/message/Message'

if (navigator.serviceWorker) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
    })
}

export default function App() {
    return (
        <>
            <Cover />
            <Message />
            <RouterProvider router={router} />
        </>
    )
}
