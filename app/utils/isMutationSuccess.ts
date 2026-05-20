export const isMutationSuccess = (response: any) => response.ok && response.data?.success !== false

/** DELETE idempotent: 404 = đã không còn trên server, coi như xóa thành công. */
export const isDeleteMutationSuccess = (response: any) =>
  isMutationSuccess(response) || response?.status === 404
