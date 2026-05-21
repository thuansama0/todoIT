import en, { Translations } from "./en"

/** Mirror en keys; override strings here when French copy is ready. */
const fr: Translations = JSON.parse(JSON.stringify(en)) as Translations

export default fr
