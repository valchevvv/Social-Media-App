import { IconType } from 'react-icons';
import { Link, useLocation } from 'react-router-dom';

const NavigationMenuItem = ({
  page,
  big = false,
  Icon,
}: {
  page: string;
  big?: boolean;
  Icon: IconType;
}) => {
  const location = useLocation();
  const isActive =
    location.pathname == page || (page == '/profile' && location.pathname.includes('profile'));

  return (
    <Link
      to={page}
      className={`flex flex-col gap-1 justify-center items-center text-white w-full ${isActive ? 'bg-gray-200 ' : ''} bg-opacity-10 rounded-full`}
    >
      <Icon className={`${big ? 'text-4xl' : 'text-3xl'} ${isActive ? 'text-blue-400' : ''}`} />
    </Link>
  );
};

export default NavigationMenuItem;
