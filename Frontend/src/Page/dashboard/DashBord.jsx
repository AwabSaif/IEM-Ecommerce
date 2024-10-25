// Importing the useAuth hook from the specified location
import useAuth from "../../hooks/useAuth";

// Importing the DashboardItems component from the specified location
import {DashboardItems} from "../../components/dashboard/DashboardItems";

// Defining the Dashboard component
export const Dashboard = () => {
  // Using the useAuth hook to access authentication data
  const { auth } = useAuth();
  // Extracting the name from the authentication data
  const name = auth.name;

  // Returning the JSX for rendering
  return (
    <>
      {/* Dashboard Container */}
      <div className="p-4">
        {/* Greeting message with user's name */}
        <div
          className={`text-fuchsia-400 text-xl  origin-left font-medium  duration-200 ${
            // Conditional rendering based on the 'open' state
            !open && "duration-200  hidden "
          }`}
        >
          {/* Displaying the user's name */}
          Hello {name}
        </div>
        {/* Rendering the DashboardItems component */}
        <DashboardItems />
      </div>
    </>
  );
}
