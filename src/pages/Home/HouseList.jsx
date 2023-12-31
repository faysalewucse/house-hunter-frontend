import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import HouseCard from "../../components/cards/HouseCard";
import { Container } from "../../components/Container";
import { Input, Loading, Modal, Pagination, Text } from "@nextui-org/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Shared/Button";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const HouseList = () => {
  const { currentUser, setOpen, setIsOpen } = useAuth();
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
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [houseId, setHouseId] = useState();
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

  const {
    isLoadingBookings,
    data: bookings = [],
    refetch: refetchBookings,
  } = useQuery({
    queryKey: [`bookings/${currentUser?.email}`],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `${import.meta.env.VITE_BASE_API_URL}/bookings/${currentUser?.email}`
      );
      return data;
    },
    enabled: currentUser?.role === "houseRenter" ? true : false,
  });

  useEffect(() => {
    refetch();
  }, [pageNumber, refetch]);

  const filterHouses = () => {
    refetch();
  };

  const bookTheHouse = (houseId) => {
    if (!currentUser) {
      Swal.fire({
        title: "Opps!",
        text: "You need to login for booking houses",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "LOGIN NOW",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/sign-in");
        }
      });
    } else if (currentUser?.role === "houseOwner") {
      Swal.fire("Opps!", "As a house owner you can't book houses", "error");
    } else if (bookings?.booked?.length >= 2) {
      Swal.fire("Opps!", "You can booked only two houses at a time", "error");
    } else if (currentUser?.role === "houseRenter") {
      openModal(houseId);
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

  useEffect(() => {
    setOpen(false);
    setIsOpen(false);
  }, [setIsOpen, setOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const openModal = (houseId) => {
    setHouseId(houseId);
    setVisible(true);
  };

  const closeModal = () => {
    setHouseId();
    setVisible(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axiosSecure.post("/booking", { ...data, houseId });

      if (res.status === 200) {
        refetchBookings().then(() => {
          closeModal();
          toast.success("House booked successfully");
        });
      }
    } catch (error) {
      closeModal;
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    let defaultValues = {};
    defaultValues.userName = currentUser?.userName;
    defaultValues.email = currentUser?.email;
    reset({ ...defaultValues });
  }, [currentUser?.userName, currentUser?.email, reset]);

  return (
    <div className="md:p-20 p-10 bg-gray-200 min-h-[80vh]">
      <Container>
        <div className="md:flex gap-5">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">Find your best fit</h1>
            <p className="text-sm text-secondary mb-5">Filter Houses By</p>

            <select
              name="city"
              id="city"
              className={`${inputStyle}`}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="" disabled selected>
                Select a city
              </option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Khulna">Khulna</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Mymensingh">Mymensingh</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Barisal">Barisal</option>
              <option value="Cumilla">Cumilla</option>
              <option value="Gazipur">Gazipur</option>
              <option value="Narayanganj">Narayanganj</option>
            </select>
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

            <select
              name="roomSize"
              id="roomSize"
              className={`${inputStyle}`}
              onChange={(e) => setRoomSizeFilter(e.target.value)}
            >
              <option value="" disabled selected>
                Enter room size
              </option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra large">Extra Large</option>
            </select>
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
          {isLoading || isLoadingBookings ? (
            <div className="flex flex-grow justify-center items-center">
              <Loading size="lg" color={"success"} />
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
                    alreadyBooked={bookings?.booked?.some(
                      (booking) => booking.houseId === house._id
                    )}
                    onClickEvent={() => bookTheHouse(house._id)}
                    userRole={currentUser?.role}
                  />
                ))}
              </div>
              <div className="mt-5">
                <Pagination
                  color="success"
                  onChange={(page) => setPageNumber(page)}
                  total={Math.ceil(houses?.totalHouse / 10)}
                  initialPage={1}
                />
              </div>
            </div>
          )}
        </div>
      </Container>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeModal}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text b size={25}>
              Book The House
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="userName"
                className="block mb-2 font-semibold dark:text-white"
              >
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="userName"
                disabled
                defaultValue={currentUser?.userName}
                className={`bg-gray-200 text-gray-400 cursor-not-allowed rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full`}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 font-semibold dark:text-white"
              >
                Email <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="email"
                disabled
                defaultValue={currentUser?.email}
                className={`bg-gray-200 text-gray-400 cursor-not-allowed rounded-md py-2 px-3 focus:outline-none focus:ring-2 w-full`}
              />
              {errors.email && errors.email.type === "required" && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <span className="text-red-500 text-sm">
                  Please enter a valid email address
                </span>
              )}
            </div>
            <div className="">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 font-semibold dark:text-white"
              >
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                {...register("phoneNumber", {
                  required: true,
                  pattern: /^\d+$/,
                })}
                className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                  errors.phoneNumber ? "ring-2 ring-red-500" : ""
                }`}
              />
              {errors.phoneNumber && errors.phoneNumber.type === "required" && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
              {errors.phoneNumber && errors.phoneNumber.type === "pattern" && (
                <span className="text-red-500 text-sm">
                  Please enter a valid phone number
                </span>
              )}
            </div>
            <div className="col-span-2 mt-5">
              <Button
                loading={loading}
                disable={loading}
                type="submit"
                width="100%"
                rounded="md"
              >
                Book
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HouseList;
