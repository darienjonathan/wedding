/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseString } from '~/types/model/parse'

export type User = {
  username: string
  roleUid: string
}

export const parseUser = (data: any): User => ({
  username: parseString(data.username),
  roleUid: parseString(data.roleUid),
})

export type UserInfo = {
  email: string
}

export const parseUserInfo = (data: any): UserInfo => ({
  email: parseString(data.email),
})
