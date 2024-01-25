import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="flex mt-36 w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
      <div color="blue-gray" className="font-normal pr-3">
        &copy; 2023 IEM-Awab Saif
      </div>
      <ul className="flex flex-wrap items-center gap-y-2 gap-x-8 pl-3">
        <li>
          <Link
            to="#"
            color="blue-gray"
            className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            About us
          </Link>
        </li>

        <li>
          <Link
            to="#"
            color="blue-gray"
            className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            Policies
          </Link>
        </li>
        <li>
          <Link
            to="/contactus"
            color="blue-gray"
            className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
          >
            Contact us
          </Link>
        </li>
      </ul>
    </footer>
  );
};
