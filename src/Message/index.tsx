import { CSSProperties, FC, forwardRef, ReactNode, useMemo } from 'react'
import useStore from './useStore'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './index.scss'
import { createPortal } from 'react-dom'
import { useTimer } from './useTimer'

export type Position = 'top' | 'bottom'

export interface MessageProps {
	style?: CSSProperties
	className?: string | string[]
	content: ReactNode
	duration?: number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onClose?: (...args: any) => void
	id?: number
	position?: Position
}

const MessageItem: FC<MessageProps> = (item) => {
	const { onMouseEnter, onMouseLeave } = useTimer({
		id: item.id!,
		duration: item.duration!,
		remove: item.onClose!,
	})
	return (
		<div
			className='message-item'
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{item.content}
		</div>
	)
}

export interface MessageRef {
	add: (messageProps: MessageProps) => void
	update: (id: number, messageProps: MessageProps) => void
	remove: (id: number) => void
	clearAll: () => void
}

export const MessageProvider = forwardRef<MessageRef, object>((_props, ref) => {
	const { messageList, add, update, remove, clearAll } = useStore('top')

	if ('current' in ref!) {
		ref.current = {
			add,
			update,
			remove,
			clearAll,
		}
	}

	const positions = Object.keys(messageList) as Position[]

	const messageWrapper = (
		<div className='message-wrapper'>
			{positions.map((direction) => {
				return (
					<TransitionGroup
						className={`message-wrapper-${direction}`}
						key={direction}
					>
						{messageList[direction].map((item) => {
							return (
								<CSSTransition
									key={item.id}
									timeout={1000}
									classNames='message'
								>
									<MessageItem onClose={remove} {...item} />
								</CSSTransition>
							)
						})}
					</TransitionGroup>
				)
			})}
		</div>
	)

	const el = useMemo(() => {
		const el = document.createElement('div')
		el.className = 'wrapper'

		document.body.appendChild(el)
		return el
	}, [])

	return createPortal(messageWrapper, el)
})
