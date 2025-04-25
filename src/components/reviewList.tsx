import { Reviews } from "@/types";



type Props = {
  reviews: Reviews[];
};

const ReviewList = ({ reviews }: Props) => {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Reviews</h3>
      {reviews.map((review) => (
        <div key={review._id} className="border p-4 rounded-lg shadow my-2">
          <h4 className="font-semibold">{review.user.name}</h4>
          <p>{'⭐'.repeat(review.rating)}</p>
          <p>{review.comment}</p>
          <p>{new Date(review.createdAt.toString()).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
