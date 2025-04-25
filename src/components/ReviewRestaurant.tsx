import React, { useState } from 'react';
import { Button} from "@/components/ui/button";
import { Input } from './ui/input';

type Props = {
  onSubmit: (review: { rating: number; comment: string }) => void;
};

const ReviewForm: React.FC<Props> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-2xl font-bold">Leave a Review</h4>
      <div>
        <Input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='How was your services'
          className=" bg-white mt-1 block border border-gray-300 rounded-md shadow-md"
        />
      </div>
      <Button
        type="submit"
        className="bg-blue-500 "
      >
        Submit
      </Button>
    </form>
  );
};

export default ReviewForm;
