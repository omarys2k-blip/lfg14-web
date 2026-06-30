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

export const VEGETARIAN_PLAN = {
  title: 'Vegetarian Meals',
  glance: {
    sections: {
      Breakfast: '340–510',
      Lunch:     '520–535',
      Dinner:    '470–490',
      Snack:     '150–240',
    },
    totalKcal: '1,480–1,775',
    macros: { P: '76–125', C: '105–214', F: '40–69' },
  },
  sections: [
    {
      name: 'Breakfast',
      meals: [
        {
          option: 'Option 1',
          name: 'Go-To Daily Breakfast',
          macros: { kcal: 510, P: 35, C: 42, F: 16 },
          ingredients: '3 boiled eggs · 150g Greek yogurt · 2 slices multigrain bread',
          instructions: null,
        },
        {
          option: 'Option 2',
          name: 'Masala Egg Bhurji + Roti',
          macros: { kcal: 405, P: 30, C: 40, F: 14 },
          ingredients: '3 whole eggs scrambled with 1 tsp ghee · ½ onion, 1 tomato, green chilli, cumin seeds · turmeric, salt, fresh coriander · 2 small whole wheat rotis (or 1 large)',
          instructions: null,
        },
        {
          option: 'Option 3',
          name: 'Greek Yogurt Power Bowl',
          macros: { kcal: 340, P: 20, C: 38, F: 12 },
          ingredients: '180g low-fat Greek yogurt · ½ banana sliced + handful of berries · 1 tbsp almond butter · pinch of cardamom or cinnamon',
          instructions: null,
        },
        {
          option: 'Option 4',
          name: 'Paneer Egg Wrap',
          macros: { kcal: 400, P: 31, C: 36, F: 15 },
          ingredients: '2 whole eggs + 1 egg white, scrambled · 50g paneer, crumbled · 1 whole wheat tortilla wrap · sliced cucumber + tomato · chaat masala or za\'atar',
          instructions: null,
        },
      ],
    },
    {
      name: 'Lunch',
      meals: [
        {
          option: 'Option 1',
          name: 'Paneer + Dal Protein Bowl',
          macros: { kcal: 535, P: 43, C: 57, F: 16 },
          ingredients: '150g paneer, grilled or pan-fried with cumin + turmeric · ½ cup cooked masoor or chana dal · ¾ cup cooked basmati rice · side of sliced cucumber, tomato + lemon',
          instructions: null,
        },
        {
          option: 'Option 2',
          name: 'Egg Fried Rice (Indian Style)',
          macros: { kcal: 520, P: 40, C: 54, F: 15 },
          ingredients: '3 eggs scrambled in 1 tsp ghee · 1 cup cooked basmati or jasmine rice · mixed veg: peas, carrots, corn (frozen works) · 1 tsp soy sauce, cumin, spring onion',
          instructions: null,
        },
        {
          option: 'Option 3',
          name: 'Rajma Rice Bowl',
          macros: { kcal: 530, P: 28, C: 78, F: 10 },
          ingredients: '1 can kidney beans (400g drained), cooked with onion, tomato, cumin, garam masala · ¾ cup cooked basmati rice · 1 tbsp Greek yogurt on the side · sliced onion + squeeze of lemon',
          instructions: null,
        },
      ],
    },
    {
      name: 'Dinner',
      meals: [
        {
          option: 'Option 1',
          name: 'Palak Paneer + Rice',
          macros: { kcal: 490, P: 36, C: 40, F: 20 },
          ingredients: '150g paneer, cubed · large handful fresh or frozen spinach (palak) · 1 onion, 2 tomatoes, garlic, ginger, cumin, garam masala · 1 tsp ghee, small dash of cream (optional) · ½ cup basmati rice',
          instructions: null,
        },
        {
          option: 'Option 2',
          name: 'Masala Omelette + Sweet Potato Hash',
          macros: { kcal: 480, P: 34, C: 42, F: 19 },
          ingredients: '4 whole eggs with onion, tomato, green chilli, fresh coriander · 1 medium sweet potato, diced & pan-fried or microwaved 6 min · 1 tsp olive oil or ghee · side salad: cucumber, carrot, lemon',
          instructions: null,
        },
        {
          option: 'Option 3',
          name: 'Dal Tadka + Jeera Rice',
          macros: { kcal: 470, P: 30, C: 58, F: 14 },
          ingredients: '1 cup yellow moong or toor dal, cooked with turmeric and salt · tadka: 1 tsp ghee, cumin seeds, garlic, dried chilli · ½ cup jeera rice (basmati with cumin seeds) · sliced onion + green chilli on the side',
          instructions: null,
        },
      ],
    },
    {
      name: 'Snack',
      meals: [
        {
          option: 'Option 1',
          name: 'Rice Cakes + Nut Butter',
          macros: { kcal: 230, P: 8, C: 22, F: 12 },
          ingredients: '2 rice cakes · 2 tbsp peanut or almond butter',
          instructions: null,
        },
        {
          option: 'Option 2',
          name: 'Greek Yogurt + Berries/Banana',
          macros: { kcal: 160, P: 12, C: 16, F: 5 },
          ingredients: '100g Greek yogurt · ½ cup berries or sliced banana',
          instructions: null,
        },
        {
          option: 'Option 3',
          name: 'Mixed Nuts + Fruit',
          macros: { kcal: 240, P: 6, C: 14, F: 18 },
          ingredients: '30g mixed nuts (plain) · 1 piece fruit (apple or guava)',
          instructions: null,
        },
        {
          option: 'Option 4',
          name: 'Boiled Egg + Cucumber + Hummus',
          macros: { kcal: 200, P: 12, C: 12, F: 11 },
          ingredients: '1 boiled egg · cucumber sticks · 3 tbsp hummus',
          instructions: null,
        },
        {
          option: 'Option 5',
          name: 'Protein Shake',
          macros: { kcal: 150, P: 25, C: 5, F: 3 },
          ingredients: 'Optimum Nutrition Whey protein · water or low-fat milk',
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
