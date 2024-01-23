import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <section className="flex items-center h-screen p-16 bg-gray-50 dark:bg-gray-700">
      <div className="container flex flex-col items-center ">
        <div className="flex flex-col gap-6 max-w-md text-center">
          <h2 className="font-extrabold text-4xl text-gray-600">
            <span className="sr-only">Error</span>Unauthorized
          </h2>
          <p className="text-2xl md:text-3xl dark:text-gray-400">
            You do not have access to requested page.
          </p>
          <button
            onClick={goBack}
            className="px-8 py-4 text-xl font-semibold rounded bg-fuchsia-500 hover:bg-fuchsia-700 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};
