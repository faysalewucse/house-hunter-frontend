import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../context/AuthContext";
import { Loading, Modal, Text } from "@nextui-org/react";
import { SectionHeader } from "../../components/Shared/SectionHeader";
import { BsTrash } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
import Button from "../../components/Shared/Button";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const ManageHouses = () => {
  const { currentUser, setOpen, setIsOpen } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [axiosSecure] = useAxiosSecure();
  const [editHouse, setEditHouse] = useState("");
  // const [houseImage, setHouseImage] = useState("");
  // const inputStyle =
  //   "w-full px-4 py-2 rounded focus:outline-none text-gray-800 font-bold";

  const {
    isLoading,
    data: houses = [],
    refetch,
  } = useQuery({
    queryKey: ["houses", currentUser?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `${import.meta.env.VITE_BASE_API_URL}/houses/${currentUser?.email}`
      );
      return data;
    },
  });

  useEffect(() => {
    setOpen(false);
    setIsOpen(false);
  }, [setIsOpen, setOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const openModal = (houseData) => {
    setEditHouse(houseData);
    reset(houseData);
    setVisible(true);
  };

  const closeModal = () => {
    setEditHouse(null);
    setVisible(false);
  };

  const onSubmit = async (data) => {
    try {
      const {
        _id,
        image,
        houseName,
        address,
        bedrooms,
        bathrooms,
        roomSize,
        phoneNumber,
        rentPerMonth,
        availabilityDate,
        description,
      } = data;
      // const photo = data.image[0];
      // const formdata = new FormData();
      // formdata.append("image", photo);

      // setLoading(true);

      // const response = await axios.post(
      //   `https://api.imgbb.com/1/upload?key=${
      //     import.meta.env.VITE_IMAGE_UPLOAD_API
      //   }`,
      //   formdata
      // );

      // if (response.status === 200) {
      //   const photoURL = response.data.data.display_url;
      setLoading(true);
      axiosSecure
        .patch(`/houses/${_id}`, {
          houseName,
          image,
          address,
          bedrooms,
          bathrooms,
          roomSize,
          phoneNumber,
          rentPerMonth,
          availabilityDate,
          description,
        })
        .then((res) => {
          if (res.status === 200) {
            refetch().then(() => {
              setLoading(false);
              closeModal();
              toast.success("House Updated Successfully");
            });
          }
        });
      // }
    } catch (error) {
      closeModal();
      setLoading(false);
      Swal.fire("Opps!", error.message, "error");
    }
  };

  const deleteHouse = (houseId) => {
    axiosSecure.delete(`/houses/${houseId}`).then((res) => {
      if (res.status === 200) {
        refetch();
        toast.success("House Deleted Successfully");
      }
    });
  };

  return (
    <div className="dark:bg-slate-900 min-h-[90vh] dark:text-white py-5 text-slate-800">
      {!isLoading ? (
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeader title={"My Houses"} />
          {houses?.houses?.length > 0 ? (
            <table className="w-full bg-transparent border-collapse my-5 text-center">
              <thead className="text-center dark:bg-gray-200 bg-slate-800 dark:text-slate-800 text-white">
                <tr className="border-b dark:border-gray-700">
                  <th className="py-2">Image</th>
                  <th>House Name</th>
                  <th>Address</th>
                  <th>Bedrooms</th>
                  <th>Bathrooms</th>
                  <th>Room Size</th>
                  <th>Mobile</th>
                  <th>Rent/Month</th>
                  <th>Available at</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {houses?.houses?.map((house) => {
                  const {
                    _id,
                    image,
                    houseName,
                    address,
                    bedrooms,
                    bathrooms,
                    roomSize,
                    phoneNumber,
                    rentPerMonth,
                    availabilityDate,
                    description,
                  } = house;
                  return (
                    <tr key={_id} className="border-b dark:border-gray-700">
                      <td className="py-1">
                        <img
                          src={image}
                          alt="Class"
                          className="w-20 h-12 mx-auto object-cover"
                        />
                      </td>
                      <td>{houseName}</td>
                      <td>{address}</td>
                      <td>{bedrooms}</td>
                      <td>{bathrooms}</td>
                      <td>{roomSize}</td>
                      <td>{phoneNumber}</td>
                      <td>{rentPerMonth}</td>
                      <td>{availabilityDate}</td>
                      <td>{description}</td>

                      <td>
                        <div className="flex space-x-4 justify-center">
                          <button
                            onClick={() => {
                              openModal(house);
                            }}
                            className="dark:text-green-300 text-green-600 hover:text-green-700 dark:hover:text-green-400 hover:scale-105 transition-all duration-150"
                          >
                            <BiSolidEdit className="inline-block w-5 h-5" />
                            <span className="ml-1">Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              deleteHouse(house._id);
                            }}
                            className="text-red-400 hover:text-red-500 hover:scale-105 transition-all duration-150"
                          >
                            <BsTrash className="inline-block w-5 h-5" />
                            <span className="ml-1">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <h1 className="border p-5 mt-20 border-primary text-xl text-center">
              No House Added yet.
            </h1>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="lg" color={"success"} />
        </div>
      )}
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeModal}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text b size={25}>
              Update Your Beautiful House
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-x-5"
          >
            <div className="mb-4">
              <label htmlFor="houseName" className="block mb-2 font-semibold ">
                House Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="houseName"
                defaultValue={editHouse?.houseName}
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
              <label htmlFor="address" className="block mb-2 font-semibold ">
                Address <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="address"
                defaultValue={editHouse?.address}
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
              <input
                type="text"
                id="city"
                defaultValue={editHouse?.city}
                {...register("city", { required: true })}
                className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                  errors.city ? "ring-2 ring-red-500" : ""
                }`}
              />
              {errors.city && (
                <span className="text-red-500 text-sm">City is required</span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="bedrooms" className="block mb-2 font-semibold ">
                Bedrooms <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                id="bedrooms"
                defaultValue={editHouse?.bedrooms}
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
              <label htmlFor="bathrooms" className="block mb-2 font-semibold ">
                Bathrooms <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                id="bathrooms"
                defaultValue={editHouse?.bathrooms}
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
              <label htmlFor="roomSize" className="block mb-2 font-semibold ">
                Room Size <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="roomSize"
                defaultValue={editHouse?.roomSize}
                {...register("roomSize", { required: true })}
                className={`border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                  errors.roomSize ? "ring-2 ring-red-500" : ""
                }`}
              />
              {errors.roomSize && (
                <span className="text-red-500 text-sm">
                  Room Size is required
                </span>
              )}
            </div>
            {/* <div className="relative mb-4">
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
              </div>
              {errors.houseImage && (
                <span className="text-red-500">
                  {errors.houseImage.message}
                </span>
              )}
            </div> */}
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
                defaultValue={editHouse?.availabilityDate}
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
                defaultValue={editHouse?.rentPerMonth}
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
                defaultValue={editHouse?.phoneNumber}
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
                defaultValue={editHouse?.description}
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
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageHouses;
