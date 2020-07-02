import User from '../models/User';
import { storeSchema, updateSchema } from '../schemas/UserSchemas';

class UserController {
  async store(req, res) {
    // Validação de input
    if (!(await storeSchema.isValid(req.body))) {
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
    // Validação de input
    updateSchema.validate(req.body).catch(function (err) {
      return res.status(400).json({ error: err.errors[0] });
    });

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
