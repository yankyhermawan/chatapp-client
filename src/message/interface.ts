export interface GetAllMessageParams {
  id: number
  targetId: number
}

export interface Message {
  receiver_id: number
  sender_id: number
  message: string
}

export interface MessageState {
  isLoading: boolean
  isError: boolean
  messages: Message[]

  getAllMessages: (params: GetAllMessageParams) => void
}
