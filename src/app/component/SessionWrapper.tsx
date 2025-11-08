"use client"

import React, { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"

interface SessionWrapperProps {
  children: ReactNode
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default SessionWrapper
