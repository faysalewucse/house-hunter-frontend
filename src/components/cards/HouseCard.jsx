import { BiCopy } from "react-icons/bi";
import Button from "../Shared/Button";

const HouseCard = ({ house, onClickEvent, alreadyBooked }) => {
  const {
    image,
    houseName,
    address,
    bedrooms,
    bathrooms,
    roomSize,
    city,
    phoneNumber,
    rentPerMonth,
    availabilityDate,
  } = house;
  return (
    <div onClick={onClickEvent} className="bg-white shadow-lg rounded-xl p-5">
      <img className="rounded-lg h-40 object-cover w-full" src={image} alt="" />
      <div className="flex justify-between mt-2">
        <h1 className="font-bold text-lg">{houseName}</h1>
        <h1 className="font-semibold text-md">Rent:{rentPerMonth}TK</h1>
      </div>
      <h1 className="font-bold text-lg">({city})</h1>
      <h1 className="text-sm text-secondary">{address}</h1>
      <div className="flex justify-between">
        <h1 className="text-sm">Bed Rooms: {bedrooms}</h1>
        <h1 className=" text-sm">Bath Rooms: {bathrooms}</h1>
      </div>
      <h1 className="text-sm">Room Size: {roomSize}</h1>
      <h1 className="flex items-center gap-2 text-sm">
        Phone Number: {phoneNumber} <span></span>
        <BiCopy color="green" className="hover:text-secondary cursor-pointer" />
      </h1>
      <h1 className="text-sm">Availability Date: {availabilityDate}</h1>
      <p className="underline text-sm mt-2 mb-5">See Details...</p>
      <Button disable={alreadyBooked} rounded="md" width="100%">
        {alreadyBooked ? "Already Booked" : "Book Now"}
      </Button>
    </div>
  );
};

export default HouseCard;
