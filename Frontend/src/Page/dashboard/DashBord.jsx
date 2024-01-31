import useAuth from "../../hooks/useAuth";
import { DashboardItems } from "../../components/dashboard/DashboardItems";

function Dashbord() {
  const { auth } = useAuth();
  const name = auth.name;

  return (
    <>
      <div className="p-4">
        <div
          className={`text-fuchsia-400 text-xl  origin-left font-medium  duration-200 ${
            !open && "duration-200  hidden "
          }`}
        >
          Hello {name}
        </div>
        <DashboardItems />
      </div>
    </>
  );
}

export default Dashbord;
