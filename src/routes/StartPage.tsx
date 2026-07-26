import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAppStore, type Timeframe } from '@/shared/store/app-store'

const startFormSchema = z.object({
  occupation: z.string().min(1, '请输入职业'),
  region: z.string().optional(),
  experience: z
    .number()
    .min(0, '经验年限不能小于 0')
    .max(50, '经验年限不能大于 50')
    .optional()
    .or(z.literal(0)),
  timeframe: z
    .enum(['3months', '6months', '1year', '2years'] as const)
    .optional(),
})

type StartFormValues = z.infer<typeof startFormSchema>

const timeframeLabels: Record<Timeframe, string> = {
  '3months': '3 个月内',
  '6months': '6 个月内',
  '1year': '1 年内',
  '2years': '2 年内',
}

export function StartPage() {
  const navigate = useNavigate()
  const setStartData = useAppStore((s) => s.setStartData)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StartFormValues>({
    resolver: zodResolver(startFormSchema),
    defaultValues: {
      occupation: '',
      region: '',
      experience: undefined,
      timeframe: undefined,
    },
  })

  const onSubmit = (data: StartFormValues) => {
    setStartData({
      occupation: data.occupation,
      region: data.region || undefined,
      experience: data.experience,
      timeframe: data.timeframe,
    })
    navigate('/map')
  }

  return (
    <div className="mx-auto max-w-[480px] space-y-6">
      <h1 className="text-2xl font-bold text-(--ink)">你的当前职业和决策</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-(--ink)">
            当前/最近职业 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('occupation')}
            placeholder="如：软件工程师、会计、教师"
            className="w-full rounded-[10px] border border-(--border) px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none"
          />
          {errors.occupation && (
            <p className="mt-1 text-xs text-red-500">{errors.occupation.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-(--ink)">
            城市/地域
          </label>
          <input
            type="text"
            {...register('region')}
            placeholder="如：上海、北京、深圳"
            className="w-full rounded-[10px] border border-(--border) px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-(--ink)">
            经验年限
          </label>
          <input
            type="number"
            {...register('experience', { valueAsNumber: true })}
            placeholder="如：5"
            min={0}
            max={50}
            className="w-full rounded-[10px] border border-(--border) px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none"
          />
          {errors.experience && (
            <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-(--ink)">
            决策时限
          </label>
          <select
            {...register('timeframe')}
            className="w-full rounded-[10px] border border-(--border) px-4 py-2.5 text-sm focus:border-(--primary) focus:outline-none"
          >
            <option value="">请选择</option>
            {(Object.keys(timeframeLabels) as Timeframe[]).map((key) => (
              <option key={key} value={key}>
                {timeframeLabels[key]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-[10px] bg-(--primary) px-6 py-3 text-sm font-medium text-white hover:bg-(--primary-hover) disabled:opacity-50"
        >
          查看职业轨迹
        </button>
      </form>
    </div>
  )
}
