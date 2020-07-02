import * as Yup from 'yup';
import { setLocale } from 'yup';

setLocale({
  mixed: { default: 'Não é válido' },
  string: { min: 'Deve ser maior que ${min}.', email: 'Email inválido.' },
});

export const storeSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().min(6),
});

export const updateSchema = Yup.object().shape({
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
