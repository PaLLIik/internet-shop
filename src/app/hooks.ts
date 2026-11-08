// Типизированные версии хуков react-redux: тип состояния и dispatch выводятся сами, писать RootState в каждом компоненте не нужно
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// Отправка действий с правильным типом
export const useAppDispatch = () => useDispatch<AppDispatch>()
// Чтение состояния с правильным типом
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
