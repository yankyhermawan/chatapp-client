import { toast } from 'sonner'

type Response = {
    status: number
    errorMessage?: string
    message?: string
}

export const notification = (res: Response) => {
    const { status, errorMessage, message } = res

    const statusPrefix = Number(String(status)[0])
    if ([1, 2, 3].includes(statusPrefix) && !!message) {
        return toast(message, { duration: 1000 })
    } else if ([4, 5].includes(statusPrefix) && !!errorMessage) {
        return toast.error(status, { description: errorMessage, duration: 1000 })
    }
}