import { useState } from 'react'
import { MessageProps, Position } from '.'

type MessageList = {
	top: MessageProps[]
	bottom: MessageProps[]
}

const initialState = {
	top: [],
	bottom: [],
}

let count = 1
export function getId(messageProps: MessageProps) {
	if (messageProps.id) {
		return messageProps.id
	}
	count += 1
	return count
}

export function getMessagePosition(messageList: MessageList, id: number) {
	for (const [position, list] of Object.entries(messageList)) {
		if (list.find((item) => item.id === id)) {
			return position as Position
		}
	}
}

export function findMessage(messageList: MessageList, id: number) {
	const position = getMessagePosition(messageList, id)

	const index = position
		? messageList[position].findIndex((message) => message.id === id)
		: -1

	return {
		position,
		index,
	}
}

function useStore(defaultPosition: Position) {
	const [messageList, setMessageList] = useState<MessageList>({
		...initialState,
	})

	return {
		messageList,
		add: (messageProps: MessageProps) => {
			const id = getId(messageProps)
			setMessageList((prevState) => {
				if (messageProps?.id) {
					const position = getMessagePosition(prevState, messageProps.id)
					if (position) return prevState
				}

				const position = messageProps.position || defaultPosition
				const isTop = position.includes('top')
				const messages = isTop
					? [{ ...messageProps, id }, ...(prevState[position] ?? [])]
					: [...(prevState[position] ?? []), { ...messageProps, id }]

				return {
					...prevState,
					[position]: messages,
				}
			})
			return id
		},
		update: (id: number, messageProps: MessageProps) => {
			if (!id) return

			setMessageList((prevState) => {
				const nextState = { ...prevState }
				const { position, index } = findMessage(prevState, id)

				if (position && index !== -1) {
					nextState[position][index] = {
						...nextState[position][index],
						...messageProps,
					}
				}
				return nextState
			})
		},
		remove: (id: number) => {
			setMessageList((prevState) => {
				const position = getMessagePosition(prevState, id)
				if (!position) return prevState

				return {
					...prevState,
					[position]: prevState[position].filter(
						(message) => message.id !== id,
					),
				}
			})
		},
		clearAll: () => {
			setMessageList({ ...initialState })
		},
	}
}
export default useStore
