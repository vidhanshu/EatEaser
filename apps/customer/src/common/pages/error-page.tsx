import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();

  if (error?.statusText === "Not Found")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            404 - Page Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Sorry, the page you are looking for could not be found.
          </p>
          <p className="text-gray-600">
            Please check the URL in the address bar and try again.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-red-600 mb-6">Error</h2>
        <p className="text-gray-600 mb-4">Something went wrong!</p>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
