import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslation } from 'react-i18next';

type Props = {
  onChange: (value: string) => void;
  sortOption: string;
};

const SortOptionDropdown = ({ onChange, sortOption }: Props) => {
  const { t } = useTranslation();
  
  const SORT_OPTIONS = [
    {
      label: t('search.sortOptions.bestMatch'),
      value: "bestMatch",
    },
    {
      label: t('search.sortOptions.deliveryPrice'),
      value: "deliveryPrice",
    },
    {
      label: t('search.sortOptions.estimatedDeliveryTime'),
      value: "estimatedDeliveryTime",
    },
  ];

  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortOption)?.label ||
    SORT_OPTIONS[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="outline" className="w-full">
          {t('search.sortOptions.sortBy')}, { selectedSortLabel }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortOptionDropdown;