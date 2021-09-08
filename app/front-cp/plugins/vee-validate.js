import '@/custom-validation/validators';
import { extend, configure, setInteractionMode } from 'vee-validate';
import { required, email, min, length, numeric } from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('min', min);
extend('length', length);
extend('numeric', numeric);

setInteractionMode('eager');

export default function VeeValidatePlugin({ app }) {
  configure({
    defaultMessage: (_, values) =>
      app.i18n.t(`validations.${values._rule_}`, values),
  });
}
