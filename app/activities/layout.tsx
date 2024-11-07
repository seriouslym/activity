'use client'

import store from "@/store"
import { Provider } from "react-redux"


export default function ActivitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store} >
        <body>
          {children}
        </body>   
      </Provider>
    </html>
  )
}
