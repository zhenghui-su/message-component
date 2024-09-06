import { useEffect, useRef } from 'react'

export interface UseTimerProps {
	id: number
	duration: number
	remove: (id: number) => void
}

export const useTimer = (props: UseTimerProps) => {
	const { id, duration = 2000, remove } = props

	const timer = useRef<number | null>(null)

	const startTimer = () => {
		timer.current = window.setTimeout(() => {
			remove(id)
			removeTimer()
		}, duration)
	}

	const removeTimer = () => {
		if (timer.current) {
			window.clearTimeout(timer.current)
			timer.current = null
		}
	}
	useEffect(() => {
		startTimer()
		return () => removeTimer()
	}, [])

	const onMouseEnter = () => {
		removeTimer()
	}
	const onMouseLeave = () => {
		startTimer()
	}

	return {
		onMouseEnter,
		onMouseLeave,
	}
}
