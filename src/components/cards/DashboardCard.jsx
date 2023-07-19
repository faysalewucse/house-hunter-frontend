export const DashboardCard = ({ number, title, extraStyle }) => {
  return (
    <div
      className={`bg-sky-200 shadow-xl bg-opacity-80 px-8 py-3 text-center text-primary rounded ${extraStyle}`}
    >
      <h1 className="font-bold text-7xl">{number}</h1>
      <h1 className="font-semibold text-xl">{title}</h1>
    </div>
  );
};
