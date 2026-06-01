import { ApiContractError } from '../../types/api'

export function getApiErrorMessage(caughtError: unknown, fallbackMessage: string): string {
  if (caughtError instanceof ApiContractError) {
    return 'There is a problem with the server response.'
  }

  if (caughtError instanceof Error) {
    return caughtError.message
  }

  return fallbackMessage
}
