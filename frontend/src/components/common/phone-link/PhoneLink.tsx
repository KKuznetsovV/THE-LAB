import Ltr from '../ltr/Ltr';
import { displayPhone, telHref } from '../../../utils/site-defaults';

type Props = {
  phone: string;
};

export default function PhoneLink({ phone }: Props) {
  return (
    <a href={telHref(phone)}>
      <Ltr>{displayPhone(phone)}</Ltr>
    </a>
  );
}
