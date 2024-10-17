import { Alert } from "antd";

const ErrorMovies = () => {
  return (
    <Alert
      style={{ margin: "20px 0" }}
      message="Warning"
      description="No movies found"
      type="warning"
      showIcon
      closable
    />
  );
};

export default ErrorMovies;
