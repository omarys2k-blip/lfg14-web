import MealPlanPage from '../components/MealPlanPage'
import { HOME_COOKED_PLAN } from '../data/mealPlans'

export default function HomeCookedPage() {
  return <MealPlanPage mealPlan={HOME_COOKED_PLAN} showCook={true} />
}
