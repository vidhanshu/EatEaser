import { Progress, Typography } from "@ui/components";
import { FaStar, FaStarHalf } from "react-icons/fa6";
import { NSRestaurant } from "../types/restaurant.type";

const StartProgressRating = ({ ratingDetails }: { ratingDetails?: NSRestaurant.IResturant["ratingDetails"] }) => {
  const { counts = [], rating = 0, noOfReviews = 0 } = ratingDetails ?? {};

  return (
    <section className="grid grid-cols-5 items-center">
      <div className="col-span-2 space-y-2">
        <Typography className="text-4xl font-semibold text-center">{rating}</Typography>
        <StarRating stars={rating!} />
        <Typography variant="muted" className="text-center text-xs">
          ({noOfReviews > 1000000 ? `${noOfReviews / 1000000}M` : `${noOfReviews / 1000}k`} reviews)
        </Typography>
      </div>
      <div className="col-span-3 border-l-2 pl-4">
        {counts?.map(({ count, stars }) => (
          <div className="flex gap-x-2 items-center">
            <span className="w-4">{stars}</span> <Progress className="h-2" value={count} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default StartProgressRating;

// Stars
export const StarRating = ({ stars }: { stars: number }) => {
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 !== 0;

  return (
    <div className="flex items-center gap-x-2 w-fit mx-auto">
      {[...Array(fullStars)].map((_, idx) => (
        <FaStar key={idx} className="text-yellow-500" />
      ))}
      {hasHalfStar && <FaStarHalf className="text-yellow-500" />}
    </div>
  );
};
