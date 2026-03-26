
import { Link } from 'react-router';

// ----------------------------------------------------------------------

interface RouterLinkProps extends Omit<LinkProps, 'to'> {
  href;
  ref?;
}

export function RouterLink({ href, ref, ...other }) {
  return <Link ref={ref} to={href} {...other} />;
}
