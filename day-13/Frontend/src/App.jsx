import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.route.jsx';
import { AuthProvider } from './features/auth/auth.context.jsx';
import { SongContextProvider } from './features/home/song.context.jsx';
const App = () => {
  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>
  )
}

export default App
