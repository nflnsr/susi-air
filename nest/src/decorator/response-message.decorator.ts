import { SetMetadata } from '@nestjs/common'

export const RESPONSE_MESSAGE_KEY = Symbol('__response_message_key__')

export function ResponseMessage(message: string) {
  return SetMetadata(RESPONSE_MESSAGE_KEY, message)
}