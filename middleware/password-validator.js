const PasswordValidator = require('password-validator')
const passwordValidator = new PasswordValidator()

passwordValidator
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces()
    .is().not().oneOf(['Password123', 'Passw0rd', 'P@ssw0rd'])

module.exports = (req, res, next) => {
    if (passwordValidator.validate(req.body.password)) {
        next()
    } else {
        return res.status(400).json({ error: `Le mot de passe choisit n'est pas assez fort ${passwordSchema.validate('req.body.password', { list: true })}` })
    }
}