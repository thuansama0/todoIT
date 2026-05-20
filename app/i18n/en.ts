const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  profileScreen: {
    newPassword: "New password",
    newPasswordPlaceholder: "Min {{min}} characters — leave blank to keep current",
    passwordInvalidTitle: "Invalid password",
    passwordInvalidMessage: "Password must be at least {{min}} characters.",
    imageUploadTitle: "Upload error",
    imageUploadFailed: "Could not upload the image. Please try again.",
    imageUploadAuthError: "Session expired or invalid. Please sign out and sign in again, then try uploading.",
    imageUploadBadRequest:
      "The server could not read the image file. Try another photo or sign in again.",
  },
}

export default en
export type Translations = typeof en
