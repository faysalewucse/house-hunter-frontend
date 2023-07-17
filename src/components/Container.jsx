import { Toaster } from "react-hot-toast";

export const Container = ({ children, extraStyle }) => {
  return (
    <div className={`max-w-7xl mx-auto ${extraStyle}`}>
      {children}
      <Toaster />
    </div>
  );
};
