import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import Button from "../../components/Shared/Button";
import { Loading, Modal, Text } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { MdFileUpload } from "react-icons/md";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { DashboardCard } from "../../components/cards/DashboardCard";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { currentUser, setIsOpen, setOpen } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [axiosSecure] = useAxiosSecure();
  const [houseImage, setHouseImage] = useState("");
  const inputStyle =
    "w-full px-4 py-2 rounded focus:outline-none text-gray-800 font-bold";

  useEffect(() => {
    setOpen(false);
    setIsOpen(false);
  }, [setIsOpen, setOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const openModal = () => setVisible(true);

  const closeModal = () => {
    setVisible(false);
  };

  const onSubmit = async (data) => {
    try {
      const photo = data.image[0];
      const formdata = new FormData();
      formdata.append("image", photo);

      setLoading(true);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_UPLOAD_API
        }`,
        formdata
      );

      if (response.status === 200) {
        const photoURL = response.data.data.display_url;

        axiosSecure
          .post("/house", {
            ...data,
            houseOwner: currentUser?.email,
            image: photoURL,
          })
          .then((res) => {
            if (res.status === 200) {
              refetch();
              closeModal();
              setLoading(false);
              toast.success("House Added Successfully");
            }
          });
      }
    } catch (error) {
      Swal.fire("Opps!", error.message, "error");
      setLoading(false);
      toast.error(error.message);
    }
  };

  const {
    isLoading,
    data: userData = [],
    refetch,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `${import.meta.env.VITE_BASE_API_URL}/${
          currentUser?.role === "houseOwner"
            ? `houses/${currentUser?.email}`
            : `bookings/${currentUser?.email}`
        }`
      );
      return data;
    },
  });

  return (
    <div className="min-h-[80vh] p-20 dark:bg-gray-900">
      {!isLoading ? (
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-20">
            {currentUser?.role === "houseOwner" && (
              <DashboardCard number={userData?.totalHouse} title="Houses" />
            )}
            {currentUser?.role === "houseRenter" && (
              <DashboardCard number={userData?.totalBooked} title="Booked" />
            )}
          </div>
          {currentUser?.role === "houseOwner" && (
            <Button onClickEvent={openModal}>Add House +</Button>
          )}
          <Modal
            width="600px"
            closeButton
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeModal}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                <Text b size={25}>
                  Add Your Beautiful House
                </Text>
              </Text>
            </Modal.Header>
            <Modal.Body>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="md:grid grid-cols-2 gap-x-5"
              >
                <div className="mb-4">
                  <label
                    htmlFor="houseName"
                    className="block mb-2 font-semibold "
                  >
                    House Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="houseName"
                    {...register("houseName", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.houseName ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.houseName && (
                    <span className="text-red-500 text-sm">
                      House Name is required
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block mb-2 font-semibold "
                  >
                    Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    {...register("address", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.address ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm">
                      Address is required
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="city" className="block mb-2 font-semibold ">
                    City <span className="text-primary">*</span>
                  </label>

                  <select
                    id="city"
                    name="city"
                    {...register("city", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.city ? "ring-2 ring-red-500" : ""
                    }`}
                  >
                    <option value="">Select a city</option>
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
                  {errors.city && (
                    <span className="text-red-500 text-sm">
                      City is required
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="bedrooms"
                    className="block mb-2 font-semibold "
                  >
                    Bedrooms <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    {...register("bedrooms", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.bedrooms ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.bedrooms && (
                    <span className="text-red-500 text-sm">
                      Number of bedrooms is required
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="bathrooms"
                    className="block mb-2 font-semibold "
                  >
                    Bathrooms <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    {...register("bathrooms", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.bathrooms ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.bathrooms && (
                    <span className="text-red-500 text-sm">
                      Number of bathrooms is required
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="roomSize"
                    className="block mb-2 font-semibold "
                  >
                    Room Size <span className="text-primary">*</span>
                  </label>

                  <select
                    name="roomSize"
                    id="roomSize"
                    {...register("roomSize", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.roomSize ? "ring-2 ring-red-500" : ""
                    }`}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra Large">Extra Large</option>
                  </select>
                  {errors.roomSize && (
                    <span className="text-red-500 text-sm">
                      Room Size is required
                    </span>
                  )}
                </div>
                <div className="relative mb-4">
                  <label htmlFor="image" className="block mb-2 font-semibold">
                    House Image <span className="text-primary">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      accept=".jpg, .png, .jpeg"
                      type="file"
                      id="image"
                      {...register("image", {
                        required: "House Image is required",
                      })}
                      className={`${inputStyle} opacity-0 z-10`}
                      onChange={(e) => {
                        setHouseImage(e.target.files[0].name);
                      }}
                    />
                    <span className="absolute flex items-center w-fit gap-1 hover:bg-secondary justify-center bg-primary p-2 rounded text-white">
                      <MdFileUpload className="text-xl" />
                      Upload Photo
                    </span>
                    <span className="mr-5">{houseImage && houseImage}</span>
                  </div>
                  {errors.houseImage && (
                    <span className="text-red-500">
                      {errors.houseImage.message}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="availabilityDate"
                    className="block mb-2 font-semibold "
                  >
                    Availability Date <span className="text-primary">*</span>
                  </label>
                  <input
                    type="date"
                    id="availabilityDate"
                    {...register("availabilityDate", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.availabilityDate ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.availabilityDate && (
                    <span className="text-red-500 text-sm">
                      Availability Date is required
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="rentPerMonth"
                    className="block mb-2 font-semibold "
                  >
                    Rent per Month <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    id="rentPerMonth"
                    {...register("rentPerMonth", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.rentPerMonth ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.rentPerMonth && (
                    <span className="text-red-500 text-sm">
                      Rent per Month is required
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-2 font-semibold "
                  >
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    {...register("phoneNumber", {
                      required: true,
                      pattern: /^(\+?88)?01[3-9]\d{8}$/,
                    })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                      errors.phoneNumber ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500 text-sm">
                      Phone number is required and should be a valid Bangladeshi
                      number
                    </span>
                  )}
                </div>
                <div className="mb-4 col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 font-semibold "
                  >
                    Description <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="description"
                    {...register("description", { required: true })}
                    className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full h-24 resize-none ${
                      errors.description ? "ring-2 ring-red-500" : ""
                    }`}
                  ></textarea>
                  {errors.description && (
                    <span className="text-red-500 text-sm">
                      Description is required
                    </span>
                  )}
                </div>

                <div className="col-span-2 mt-5">
                  <Button
                    loading={loading}
                    disable={loading}
                    type="submit"
                    width="100%"
                  >
                    Add
                  </Button>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </Container>
      ) : (
        <div className="flex items-center justify-center">
          <Loading size="lg" color="success" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
