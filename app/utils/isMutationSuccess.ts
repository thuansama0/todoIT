export const isMutationSuccess = (response: any) =>
  response.ok && response.data?.success !== false
