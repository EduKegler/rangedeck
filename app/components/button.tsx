import { cn } from '../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

interface ButtonProps extends ButtonOwnProps, React.ComponentPropsWithRef<'button'> {}

const BASE = 'inline-flex items-center justify-center rounded-lg font-medium transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn-gradient text-white font-bold',
  secondary: 'bg-white/5 border border-white/8 text-white hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.1)]',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  danger: 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 text-white font-bold',
  warning: 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 text-white font-bold',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-1.5',
  lg: 'h-11 px-6 text-sm gap-1.5',
};

const ICON_ONLY_SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'size-7',
  sm: 'size-8',
  md: 'size-9',
  lg: 'size-11',
};

export function buttonVariants({
  variant = 'ghost',
  size = 'md',
  iconOnly = false,
  fullWidth = false,
}: ButtonOwnProps = {}): string {
  return cn(
    BASE,
    VARIANT_CLASSES[variant],
    iconOnly ? ICON_ONLY_SIZE_CLASSES[size] : SIZE_CLASSES[size],
    fullWidth && 'w-full',
  );
}

export default function Button({
  variant = 'ghost',
  size = 'md',
  iconOnly = false,
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cn(buttonVariants({ variant, size, iconOnly, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
