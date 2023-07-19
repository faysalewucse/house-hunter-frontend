import { Loading } from "@nextui-org/react";

const Button = ({
  children,
  sm,
  loading,
  onClickEvent,
  width,
  type,
  disable,
  rounded = "full",
}) => {
  return (
    <button
      disabled={disable}
      onClick={onClickEvent}
      type={type}
      style={{
        width: width,
      }}
      className={`${
        sm && "text-sm"
      } text-center bg-primary hover:bg-green-900 py-2 px-6 text-white rounded-${rounded}`}
    >
      {loading ? <Loading color="white" type="spinner" /> : children}
    </button>
  );
};

export default Button;
