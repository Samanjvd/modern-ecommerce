import { Button } from '@/components/ui/Button';
import { ShoppingCart } from 'lucide-react';

type AddToCartProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export function AddToCart({ disabled = false, onClick }: AddToCartProps) {
  return (
    <Button
      type="button"
      variant="primary"
      disabled={disabled}
      onClick={onClick}
      className="h-12 w-full px-5 text-sm font-bold"
    >
      <ShoppingCart size={19} />

      {disabled ? 'ناموجود' : 'افزودن به سبد خرید'}
    </Button>
  );
}
