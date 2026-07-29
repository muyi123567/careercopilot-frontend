import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

/* ===== EvidWay business badge components ===== */

export function PathTypeChip({ type }: { type: string }) {
  const map: Record<string, string> = {
    same_industry: '本行业',
    adjacent: '邻近迁移',
    cross_industry: '跨行业',
  };
  return <Badge variant="secondary">{map[type] ?? type}</Badge>;
}

export function EvidenceGradeBadge({ grade }: { grade: string }) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    strong: { label: '强证据', variant: 'default' },
    moderate: { label: '中等', variant: 'secondary' },
    weak: { label: '弱证据', variant: 'outline' },
    insufficient: { label: '不足', variant: 'destructive' },
  };
  const item = map[grade] ?? { label: grade, variant: 'outline' as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function ClassificationTag({ kind }: { kind: string }) {
  const map: Record<string, string> = {
    fact: '事实',
    inference: '推断',
    recommendation: '建议',
  };
  return <Badge variant="outline">{map[kind] ?? kind}</Badge>;
}

export function UncertaintyPill({ level }: { level: string }) {
  const map: Record<string, string> = {
    low: '低不确定',
    medium: '中不确定',
    high: '高不确定',
    unknown: '未知',
  };
  return <Badge variant="ghost">{map[level] ?? level}</Badge>;
}
