import { useQuery } from "@tanstack/react-query";
import { restaurantService } from "../services/restaurant";

export interface IListRestaurantFilters {
  includeTables?: boolean;
}
export const useRestaurant = ({ id, filters = {} }: { id?: string; filters?: IListRestaurantFilters }) => {
  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ["restaurant", filters],
    queryFn: () => restaurantService.getRestroById(id, filters),
  });

  return {
    restaurant,
    isLoadingRestaurant,
  };
};

export default useRestaurant;
