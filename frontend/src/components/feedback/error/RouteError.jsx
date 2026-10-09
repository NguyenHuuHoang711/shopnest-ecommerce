import { useRouteError } from "react-router-dom";
import ErrorFallback from "@/components/feedback/error/ErrorFallback";

const RouteError = () => {
  const error = useRouteError();

  console.error(error);

  return <ErrorFallback />;
};

export default RouteError;
