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
      className={`${sm && "text-sm"} text-center ${
        disable
          ? "bg-gray-500 cursor-not-allowed text-gray-400"
          : "bg-primary text-white hover:bg-green-900"
      } py-2 px-6 rounded-${rounded}`}
    >
      {loading ? <Loading color="white" type="spinner" /> : children}
    </button>
  );
};

export default Button;
