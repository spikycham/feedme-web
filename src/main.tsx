import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from '@/route'

import Cover from './view/cover/Cover'
import Message from './component/message/Message'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Cover />
        <Message />
        <RouterProvider router={router} />
    </StrictMode>,
)
