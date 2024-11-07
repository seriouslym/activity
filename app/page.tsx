'use client'
import Activity from "@/components/activity"
import store from "@/store"
import { Provider } from "react-redux"

export default function Home() {
  return (
    <div>
      <Provider store={store}>
        <Activity/>
      </Provider>    
    </div>
  )
}
