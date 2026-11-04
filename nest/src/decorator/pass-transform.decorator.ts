import { SetMetadata } from '@nestjs/common'

export const PASS_TRANSFORM_KEY = Symbol('__pass_transform_key__')

export function PassTransform() {
  return SetMetadata(PASS_TRANSFORM_KEY, true)
}