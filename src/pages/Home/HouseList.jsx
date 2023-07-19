import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import HouseCard from "../../components/cards/HouseCard";
import { Container } from "../../components/Container";
import { Loading } from "@nextui-org/react";

const HouseList = () => {
  const { currentUser } = useAuth();
  const [axiosSecure] = useAxiosSecure();

  const { isLoading, data: houses = [] } = useQuery({
    queryKey: ["houses"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `${import.meta.env.VITE_BASE_API_URL}/houses/${
          JSON.parse(currentUser)?.email
        }`
      );
      return data;
    },
  });

  return (
    <div className="p-10 bg-gray-50">
      <Container>
        {!isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {houses.map((house) => (
              <HouseCard key={house?._id} house={house} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Loading size="large" />
          </div>
        )}
      </Container>
    </div>
  );
};

export default HouseList;
