import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { Loading } from "@nextui-org/react";
import { SectionHeader } from "../../components/Shared/SectionHeader";
import { BsTrash } from "react-icons/bs";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageBooking = () => {
  const { currentUser } = useAuth();
  const [axiosSecure] = useAxiosSecure();

  const {
    isLoading,
    data: bookings = [],
    refetch,
  } = useQuery({
    queryKey: [`bookings/${currentUser?.email}`],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `${import.meta.env.VITE_BASE_API_URL}/bookings/${currentUser?.email}`
      );
      return data;
    },
  });

  const deleteBookigs = (bookedId) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/bookings/${bookedId}`).then((res) => {
          Swal.showLoading();
          if (res.status === 200) {
            refetch().then(() => {
              Swal.hideLoading();
              toast.success("House Deleted Successfully");
            });
          }
        });
      }
    });
  };

  return (
    <div className="dark:bg-slate-900 min-h-[90vh] dark:text-white py-10 text-slate-800">
      {!isLoading ? (
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeader title={"My Houses"} />
          {bookings.booked?.length > 0 ? (
            <table className="w-full bg-transparent border-collapse my-10 text-center">
              <thead className="text-center dark:bg-gray-200 bg-slate-800 dark:text-slate-800 text-white">
                <tr className="border-b dark:border-gray-700">
                  <th className="py-2">Serial</th>
                  <th>House Info</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings?.booked?.map((booking) => {
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
                  } = booking.houseInfo[0];
                  return (
                    <tr key={_id} className="border-b dark:border-gray-700">
                      <td className="py-1">
                        <img
                          src={image}
                          alt="Class"
                          className="w-20 h-12 mx-auto object-cover"
                        />
                      </td>
                      <td className="grid grid-cols-4">
                        <p>
                          <span className="font-semibold">House Name: </span>
                          {houseName}
                        </p>
                        <p>
                          <span className="font-semibold">Address: </span>
                          {address}
                        </p>
                        <p>
                          <span className="font-semibold">Bedrooms:</span>
                          {bedrooms}
                        </p>
                        <p>
                          <span className="font-semibold">Bathrooms: </span>
                          {bathrooms}
                        </p>
                        <p>
                          <span className="font-semibold">Room Size: </span>
                          {roomSize}
                        </p>
                        <p>
                          <span className="font-semibold">Phone Number: </span>
                          {phoneNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Rent: </span>
                          {rentPerMonth}
                        </p>
                        <p>
                          <span className="font-semibold">Available Date:</span>
                          {availabilityDate}
                        </p>
                        <p>
                          <span className="font-semibold">Description: </span>
                          {description}
                        </p>
                      </td>

                      <td>
                        <button
                          onClick={() => {
                            deleteBookigs(booking._id);
                          }}
                          className="text-red-400 hover:text-red-500 hover:scale-105 transition-all duration-150"
                        >
                          <BsTrash className="inline-block w-5 h-5" />
                          <span className="ml-1">Delete</span>
                        </button>
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
    </div>
  );
};

export default ManageBooking;
