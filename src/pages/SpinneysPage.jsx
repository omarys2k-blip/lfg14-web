import MealPlanPage from '../components/MealPlanPage'
import { SPINNEYS_PLAN } from '../data/mealPlans'

export default function SpinneysPage() {
  return <MealPlanPage mealPlan={SPINNEYS_PLAN} showCook={false} />
}
