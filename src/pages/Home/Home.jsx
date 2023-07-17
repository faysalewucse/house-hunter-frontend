import { Container } from "../../components/Container";
import { useAuth } from "../../context/AuthContext";

export const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <Container> {currentUser || "Guest"}</Container>
    </div>
  );
};
