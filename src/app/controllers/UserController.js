import * as Yup from 'yup';
import { setLocale } from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // Validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error.' });
    }

    // Verifica se já existe usuário com o mesmo email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists)
      return res.status(400).json({ error: 'User already exists.' });

    const { name, email, provider } = await User.create(req.body);

    return res.json({ name, email, provider });
  }

  async update(req, res) {
    // ************************************************** VALIDAÇÕES ***************************************************

    // Validação com mensagens específicas
    setLocale({
      mixed: { default: 'Não é válido' },
      string: { min: 'Deve ser maior que ${min}.', email: 'Email inválido.' },
    });

    // Validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        // Indica que quando houver algum valor em oldPassword, o campo password será required
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),

      confirmPassword: Yup.string().when('password', (password, field) =>
        // Verifica se existe valor para password. Se sim, o campo fica obrigatório e verifica se é igual.
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    schema.validate(req.body).catch(function (err) {
      return res.status(400).json({ error: err.errors[0] });
    });

    // *****************************************************************************************************************
    // ************************************************** FUNCIONALIDADE ***********************************************
    // *****************************************************************************************************************

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Caso seja mandado o email, verifica se o email já existe
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists)
        return res.status(400).json({ error: 'Email already taken.' });
    }

    // Caso seja mandado o oldPassword, checa se é correto
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
