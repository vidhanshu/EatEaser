import { useParams } from "react-router-dom";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  return <main className="pt-8 px-4">RestaurantDetailsPage:{id}</main>;
};

export default RestaurantDetailsPage;
