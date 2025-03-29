import { loadHeaderFooter } from "./utils.mjs"
import LoginValidation from "./LoginValidation.mjs"

loadHeaderFooter()
const loginValidation = new LoginValidation("login-form", "validation-message")
