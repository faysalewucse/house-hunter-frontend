import { Container } from "../../components/Container";
import banner from "../../assets/banner.png";
import corner from "../../assets/corner.png";
import Button from "../../components/Shared/Button";

const Banner = () => {
  return (
    <div className="relative dark:bg-slate-950">
      <img
        className="absolute top-0 left-0 md:w-1/3 w-3/4"
        src={corner}
        alt="corner"
      />
      <img
        className="absolute bottom-0 right-0 rotate-180 md:w-1/2 w-3/4"
        src={corner}
        alt="corner"
      />
      <Container>
        <div className="md:flex justify-center items-center p-16 md:p-10 min-h-[90vh]">
          <div className="md:text-left text-center">
            <h1 className="text-primary font-bold md:text-7xl text-4xl">
              House Hunter
            </h1>
            <p className="text-secondary2 my-5 md:w-3/4 mx-auto md:mx-0 text-justify dark:text-white">
              Find your perfect rental home with our convenient house renter web
              app. Discover a wide selection of properties available for rent,
              complete with detailed descriptions, high-quality photos, and
              helpful search filters.
            </p>
            <Button width="80%">Get Started</Button>
          </div>
          <img
            className="md:w-1/2 mx-auto mt-10 md:mt-0"
            src={banner}
            alt="search"
          />
        </div>
      </Container>
    </div>
  );
};

export default Banner;
