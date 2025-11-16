import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useAuthStore from '@/user/store'
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import type { Chat } from './interface'
import BubbleChat from '@/components/bubblechat/BubbleChat'
import useUserStore from '@/user/userStore'
import { AutoComplete } from '@/components/autocomplete/AutoComplete'
import { mapUserOptions } from '@/utility/mapUserOptions'
import debounce from 'lodash/debounce'
import type { User } from '@/user/interface'
import { useNavigate } from 'react-router-dom'
import useMessageStore from '@/message/store'
import isEmpty from 'lodash/isEmpty'

const Room = () => {
  const { auth, getMyData, myData } = useAuthStore()
  const { getAllUsers, users } = useUserStore()
  const { messages, getAllMessages } = useMessageStore()
  const navigate = useNavigate()
  const { userId, token } = auth
  const [message, setMessage] = useState('')
  const [allMessage, setAllMessage] = useState<Chat[]>([])
  const [currentTarget, setCurrentTarget] = useState<User>()
  const [isSelectNewTarget, setIsSelectNewTarget] = useState(false)
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `ws://localhost:8080/ws/chat?userId=${userId}`
  )

  useEffect(() => {
    if (lastJsonMessage) {
      setAllMessage((prev) => prev.concat(lastJsonMessage as Chat))
    }
  }, [lastJsonMessage])

  useEffect(() => {
    if (userId) {
      getMyData(Number(userId))
    }
  }, [userId])

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  useEffect(() => {
    if (!isEmpty(messages) && isSelectNewTarget) {
      setAllMessage(messages)
    }
  }, [messages, isSelectNewTarget])

  const onClickHandler = () => {
    if (!message) return
    if (!currentTarget) return
    sendJsonMessage({
      message,
      receiverId: currentTarget.id,
      senderId: Number(auth.userId),
    })
    setMessage('')
  }

  const debounceSearchUser = debounce(
    (search: string) => getAllUsers({ search }),
    500
  )
  const handleSearchUser = (name: string) => {
    if (name) {
      debounceSearchUser(name)
    }
  }

  const renderChat = () => {
    if (!currentTarget) return null
    const filteredMessages = allMessage.filter(
      (dt) =>
        (dt.sender_id === Number(userId) &&
          dt.receiver_id === currentTarget.id) ||
        (dt.sender_id === currentTarget.id && dt.receiver_id === Number(userId))
    )
    return filteredMessages.map((dt, key) => {
      const { sender_id, message } = dt
      const isMe = sender_id === Number(userId)
      const sender =
        (isMe ? myData.name : users.find((dt) => dt.id === sender_id)?.name) ||
        ''
      return (
        <div key={key}>
          <BubbleChat sender={sender} message={message} time={''} isMe={isMe} />
        </div>
      )
    })
  }

  const handleSelect = (val: string) => {
    const selected = users.find((dt) => dt.id === Number(val))
    setCurrentTarget(selected)
    if (selected) {
      getAllMessages({
        id: Number(userId),
        targetId: selected.id,
      })
      setIsSelectNewTarget(true)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-2 h-full">
      <div className="w-full flex justify-center">
        <AutoComplete
          onSearch={handleSearchUser}
          onSelect={handleSelect}
          items={mapUserOptions(users)}
        />
      </div>
      <Card className="flex flex-row h-full">
        <CardContent className="w-1/4">
          <div>Username: {currentTarget?.username || ''}</div>
          <div>Name: {currentTarget?.name || ''}</div>
        </CardContent>
        <CardContent className="w-full">
          <div className="w-full h-full bg-gray-300 top-0 right-0 p-8 flex flex-col justify-end">
            <div className="flex flex-col overflow-y-auto mb-4 gap-2">
              {renderChat()}
            </div>
            <div className="flex flex-row justify-between gap-4 items-center">
              <Input
                placeholder="Kirim Pesan..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <div
                className="h-full flex items-center"
                onClick={onClickHandler}
              >
                <Button>Send</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { Room }
