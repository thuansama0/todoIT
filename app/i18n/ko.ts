import en, { Translations } from "./en"

/** Mirror en keys; override strings here when Korean copy is ready. */
const ko: Translations = JSON.parse(JSON.stringify(en)) as Translations

export default ko
