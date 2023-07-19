import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import HouseCard from "../../components/cards/HouseCard";
import { Container } from "../../components/Container";
import { Input, Loading, Pagination } from "@nextui-org/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Shared/Button";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { debounce } from "lodash";

const HouseList = () => {
  const { currentUser } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [searching, setSearching] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [bedroomsFilter, setBedroomsFilter] = useState("");
  const [bathroomsFilter, setBathroomsFilter] = useState("");
  const [roomSizeFilter, setRoomSizeFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [rentFilter, setRentFilter] = useState("");

  const navigate = useNavigate();

  const {
    isLoading,
    data: houses = [],
    refetch,
  } = useQuery({
    queryKey: ["houses"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `${
          import.meta.env.VITE_BASE_API_URL
        }/houses?page=${pageNumber}&city=${cityFilter}&bedrooms=${bedroomsFilter}&bathrooms=${bathroomsFilter}&roomSize=${roomSizeFilter}&availabilityDate=${availabilityFilter}&rentPerMonth=${rentFilter}&houseName=${searchFilter}`
      );
      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [pageNumber, refetch]);

  const filterHouses = () => {
    refetch();
  };

  const bookTheHouse = () => {
    if (!currentUser) {
      Swal.fire({
        title: "Opps!",
        text: "You need to login for booking houses",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/sign-in");
        }
      });
    } else if (currentUser?.role === "houseOwner") {
      Swal.fire("Opps!", "As a house owner you can't book houses", "error");
    }
  };

  const debounceDelay = 500;

  const debouncedHandleSearch = debounce((value) => {
    setSearching(true);
    setSearchFilter(value);
    refetch().then(() => {
      setSearching(false);
    });
  }, debounceDelay);

  const handleSearch = (e) => {
    const value = e.target.value;
    debouncedHandleSearch(value.toLowerCase());
  };

  const inputStyle = "bg-white p-2 rounded mb-2 focus:outline-primary";
  return (
    <div className="md:p-20 p-10 bg-gray-200 min-h-[80vh]">
      <Container>
        <div className="md:flex gap-5">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">Find your best fit</h1>
            <p className="text-sm text-secondary mb-5">Filter Houses By</p>
            <input
              type="text"
              placeholder="Enter city"
              value={cityFilter}
              className={`${inputStyle}`}
              onChange={(e) => setCityFilter(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter bedrooms"
              value={bedroomsFilter}
              className={`${inputStyle}`}
              onChange={(e) => setBedroomsFilter(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter bathrooms"
              value={bathroomsFilter}
              className={`${inputStyle}`}
              onChange={(e) => setBathroomsFilter(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter room size"
              value={roomSizeFilter}
              className={`${inputStyle}`}
              onChange={(e) => setRoomSizeFilter(e.target.value)}
            />

            <input
              type="date"
              placeholder="Enter availability Date"
              value={availabilityFilter}
              className={`${inputStyle}`}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter rent <="
              value={rentFilter}
              className={`${inputStyle}`}
              onChange={(e) => setRentFilter(e.target.value)}
            />
            <Button onClickEvent={filterHouses} rounded="md">
              Filter
            </Button>
          </div>
          {isLoading ? (
            <div>
              <Loading size="lg" />
            </div>
          ) : (
            <div className="md:w-3/4 flex-grow ">
              <div className="mb-5">
                <Input
                  onChange={handleSearch}
                  width="100%"
                  className="mt-5 md:mt-0"
                  labelPlaceholder="Search With Name"
                  contentRight={
                    !searching ? (
                      <BiSearchAlt />
                    ) : (
                      <Loading color="success" className="mr-3" size="sm" />
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {houses?.data?.map((house) => (
                  <HouseCard
                    key={house?._id}
                    house={house}
                    onClickEvent={bookTheHouse}
                    userRole={currentUser?.role}
                  />
                ))}
              </div>
              <Pagination
                color="success"
                onChange={(page) => setPageNumber(page)}
                total={Math.ceil(houses?.totalHouse / 10)}
                initialPage={1}
                className="mt-5"
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default HouseList;
