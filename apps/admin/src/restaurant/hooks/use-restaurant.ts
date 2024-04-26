import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NSRestaurant } from "@src/types/restaurant.type";
import { toast } from "@ui/components";
import { useNavigate } from "react-router-dom";
import { restaurantService } from "../services/restaurant";
import { APP_ROUTES } from "@src/common/utils/app-routes";

export const useRestaurant = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = React.useState<NSRestaurant.IResturant>();
  const { data, isPending: isFetching } = useQuery({
    queryKey: ["restaurant"],
    queryFn: restaurantService.getMyRestro,
  });
  const { isPending: isUpading, mutate } = useMutation({
    mutationFn: restaurantService.updateRestro,
    onSuccess: ({ data }) => {
      toast.success("Restaurant updated successfully");
      setRestaurant(data);
      navigate(APP_ROUTES.restaurant);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.error ?? "Failed to update restaurant"
        );
      }
    },
  });

  useEffect(() => {
    if (data) {
      setRestaurant(data.data);
    }
  }, [data]);

  const updateRestaurant = async (payload: Partial<NSRestaurant.IResturant>) =>
    mutate(payload);
  return {
    data: restaurant,
    isFetching,
    isUpading,
    updateRestaurant,
  };
};

export default useRestaurant;
