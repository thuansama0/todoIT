import en, { Translations } from "./en"

/** Mirror en keys; override strings here when Arabic copy is ready. */
const ar: Translations = JSON.parse(JSON.stringify(en)) as Translations
ar.common.ok = "نعم"
ar.common.cancel = "حذف"
ar.common.back = "خلف"

export default ar
