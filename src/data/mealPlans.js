export const HOME_COOKED_PLAN = {
  title: 'Home Cooked Meals',
  glance: {
    sections: {
      Breakfast: '572–604',
      Lunch:     '560–587',
      Dinner:    '555–587',
      Snack:     '296–332',
    },
    totalKcal: '1,983–2,110',
    macros: { P: '141–183', C: '129–285', F: '14–112' },
  },
  sections: [
    {
      name: 'Breakfast',
      meals: [
        {
          option: 'Option 1',
          name: 'Oatmeal with Blueberries & Banana',
          macros: { kcal: 604, P: 40, C: 79, F: 11 },
          ingredients: '55g oats · 100g blueberries · 1 banana · 200ml fat-free milk · protein powder (optional)',
          instructions: 'Cook oats with milk over medium heat for 5–7 minutes, stirring occasionally. Top with blueberries, banana slices, and protein powder if using.',
        },
        {
          option: 'Option 2',
          name: 'Steak & Eggs with Sliced Avocado',
          macros: { kcal: 572, P: 61, C: 2, F: 34 },
          ingredients: '2 eggs · 160g lean steak · ½ avocado',
          instructions: 'Season steak and cook in a hot pan 2–3 minutes per side to preferred doneness. Remove and rest. Fry eggs in the same pan. Serve with sliced avocado.',
        },
      ],
    },
    {
      name: 'Lunch',
      meals: [
        {
          option: 'Option 1',
          name: 'Garlic Chicken Pasta',
          macros: { kcal: 587, P: 67, C: 49, F: 11 },
          ingredients: '170g pasta · 160g chicken breast · 25g pasta sauce · 50g cottage cheese · 15g Nando\'s peri-peri sauce',
          instructions: 'Boil pasta until al dente. In a separate pan, sauté garlic with spices, then add evaporated milk, cream cheese, and parmesan to form a sauce. Add pasta sauce and peri-peri. Toss cooked pasta and sliced chicken through the sauce until well coated.',
        },
        {
          option: 'Option 2',
          name: 'Salmon & Asparagus',
          macros: { kcal: 560, P: 48, C: 27, F: 29 },
          ingredients: '150g asparagus · 200g salmon fillet · 160g mashed potato · 2 tsp olive oil',
          instructions: 'Preheat oven to 200°C. Toss asparagus in olive oil, season, and roast 12–15 minutes. Place salmon skin-down on a lined tray, season, and bake for 10 minutes. Switch to broil/grill for a final 2–3 minutes. Serve with mashed potato.',
        },
      ],
    },
    {
      name: 'Dinner',
      meals: [
        {
          option: 'Option 1',
          name: 'Tuna Rice',
          macros: { kcal: 555, P: 50, C: 80, F: 1 },
          ingredients: '1 can white tuna (drained) · 260g cooked basmati rice · 2 tsp Tabasco sauce',
          instructions: 'Drain tuna well. Heat rice in the microwave or on the stovetop. Combine tuna and rice in a bowl, mix in Tabasco to taste, and serve immediately.',
        },
        {
          option: 'Option 2',
          name: 'Beef & Rice Bowl',
          macros: { kcal: 587, P: 51, C: 57, F: 14 },
          ingredients: '200g lean beef mince · 200g cooked white rice',
          instructions: 'Brown beef mince in a pan over medium-high heat for 2–3 minutes, breaking it up as it cooks. Season to taste. Heat rice separately. Combine in a bowl and serve.',
        },
      ],
    },
    {
      name: 'Snack',
      meals: [
        {
          option: 'Option 1',
          name: 'Fruit Salad',
          macros: { kcal: 332, P: 4, C: 77, F: 1 },
          ingredients: '1 apple · 1 banana · 1 orange · 1 cup grapes',
          instructions: 'Dice apple and orange, slice banana, halve grapes. Toss together and serve fresh.',
        },
        {
          option: 'Option 2',
          name: 'Banana & Dark Chocolate',
          macros: { kcal: 296, P: 3, C: 43, F: 35 },
          ingredients: '1 banana · 35g dark chocolate (70%+)',
          instructions: null,
        },
      ],
    },
  ],
}

export const SPINNEYS_PLAN = {
  title: 'Spinneys Meal Plan',
  glance: {
    sections: {
      Breakfast: '~320',
      Lunch:     '655–673',
      Dinner:    '616–720',
      Snack:     '158–260',
    },
    totalKcal: '~1,749–1,973',
    macros: { P: '—', C: '—', F: '—' },
  },
  sections: [
    {
      name: 'Breakfast',
      meals: [
        {
          option: 'Option 1',
          name: 'Oatful Pack',
          macros: { kcal: 320, P: 22, C: 42, F: 8 },
          ingredients: 'Oatful Peanut Butter Protein Porridge pack',
          instructions: null,
        },
        {
          option: 'Option 2',
          name: 'Granola Pot + Greek Yogurt Drink',
          macros: { kcal: 461, P: 38, C: 55, F: 8 },
          ingredients: 'Granola pot (Mango / Blueberry / Strawberry flavour) · Greek yogurt protein drink',
          instructions: null,
        },
      ],
    },
    {
      name: 'Lunch',
      meals: [
        {
          option: 'Option 1',
          name: 'Rice & Chicken Bowl',
          macros: { kcal: 673, P: 82, C: 89, F: 11 },
          ingredients: '160g rice · 120g chicken · 160g vegetables',
          instructions: null,
        },
        {
          option: 'Option 2',
          name: 'Pasta Bowl',
          macros: { kcal: 655, P: 51, C: 17, F: 43 },
          ingredients: '160g pesto pasta · 100g Norwegian salmon',
          instructions: null,
        },
      ],
    },
    {
      name: 'Dinner',
      meals: [
        {
          option: 'Option 1',
          name: 'Baked Salmon Plate',
          macros: { kcal: 720, P: 31, C: 31, F: 29 },
          ingredients: '100g salmon · 150g sweet potato · 120g vegetables',
          instructions: null,
        },
        {
          option: 'Option 2',
          name: 'Healthy Chicken Wrap',
          macros: { kcal: 645, P: 65, C: 34, F: 25 },
          ingredients: '2 gluten-free wraps · 150g shredded chicken · 100g coleslaw',
          instructions: null,
        },
        {
          option: 'Option 3',
          name: 'Beef & Potato Plate',
          macros: { kcal: 616, P: 67, C: 34, F: 20 },
          ingredients: '4 Teriyaki Sesame Beef skewers · 150g sweet potato · 160g vegetables',
          instructions: null,
        },
      ],
    },
    {
      name: 'Snack',
      meals: [
        {
          option: 'Option 1',
          name: 'Grahams Stracciatella Protein 22',
          macros: { kcal: 158, P: 22, C: 12, F: 3 },
          ingredients: 'Grahams Stracciatella Protein 22 bar',
          instructions: null,
        },
        {
          option: 'Option 2',
          name: 'Almonds & Apple',
          macros: { kcal: 260, P: 7, C: 31, F: 14 },
          ingredients: '28g almonds · 1 apple',
          instructions: null,
        },
      ],
    },
  ],
}
