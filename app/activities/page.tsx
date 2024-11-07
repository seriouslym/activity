'use client'
import { RootState } from "@/store"
import { useSelector } from "react-redux"

export default function Activities () {
  const activityCompleteInfos = useSelector((state: RootState) => state.activityCompleteInfoState.activityCompleteInfos)
  console.log(activityCompleteInfos)
  return <>
    <h1>Activities</h1>
  </>
}