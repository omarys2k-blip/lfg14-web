export const HOME_WORKOUTS = [
  {
    id: 'A',
    title: 'Workout A',
    subtitle: 'Foundational Strength + Engine',
    sections: [
      {
        name: 'Warm Up',
        format: '×2 Rounds',
        rest: null,
        exercises: [
          { name: 'Air Squat', detail: '20s' },
          { name: 'Walk-out to Plank', detail: '20s' },
          { name: 'Alternating Reverse Lunge', detail: '20s' },
        ],
      },
      {
        name: 'Station 1',
        format: '×3 Rounds',
        rest: 'Rest 60s',
        exercises: [
          { name: 'Tempo Squats', detail: '3s down, 1s pause · 10 reps' },
          { name: 'Push-Ups (chest-to-floor)', detail: '8–12 reps' },
        ],
      },
      {
        name: 'Station 2',
        format: '×3 Rounds',
        rest: 'Rest 45s',
        exercises: [
          { name: 'Burpees', detail: '5–10 reps' },
          { name: 'Reverse Lunges', detail: '20 reps' },
          { name: 'Squat Jumps', detail: '15–20 reps' },
        ],
      },
      {
        name: 'Station 3',
        format: '×2 Rounds',
        rest: 'Rest 30s',
        exercises: [
          { name: 'Deadbug', detail: '12/side' },
          { name: 'Side Plank', detail: '20s/side' },
        ],
      },
      {
        name: 'Finisher',
        format: '×3 Rounds',
        rest: null,
        exercises: [
          { name: 'High Knees', detail: '20s' },
          { name: 'Rest', detail: '20s' },
        ],
      },
    ],
  },
  {
    id: 'B',
    title: 'Workout B',
    subtitle: 'Single Leg Strength + Fat Loss',
    sections: [
      {
        name: 'Warm Up',
        format: '×3 Rounds',
        rest: null,
        exercises: [
          { name: 'Jog in Place', detail: '20s' },
          { name: 'Hip Hinge Walk-outs', detail: '10 reps' },
          { name: 'Overhead Squats', detail: '10 reps' },
        ],
      },
      {
        name: 'Station 1',
        format: '×3 Rounds',
        rest: 'Rest 60s',
        exercises: [
          { name: 'Split Squats', detail: '3s lowering · 10 reps/leg' },
          { name: 'Glute Bridge', detail: '2s squeeze · 15 reps' },
          { name: 'Pike/Knee Push-Ups', detail: '6–10 reps' },
        ],
      },
      {
        name: 'Station 2',
        format: '4 min AMRAP',
        rest: 'Rest 60s',
        exercises: [
          { name: 'Burpees', detail: '5–10 reps' },
          { name: 'Squats', detail: '20 reps' },
          { name: 'Mountain Climbers', detail: '15–20 reps' },
        ],
      },
      {
        name: 'Station 3',
        format: '×2 Rounds',
        rest: 'Rest 30s',
        exercises: [
          { name: 'Plank with Shoulder Taps', detail: '20 taps' },
          { name: 'Hollow Hold', detail: '20s' },
        ],
      },
      {
        name: 'Finisher',
        format: '×3 Rounds',
        rest: null,
        exercises: [
          { name: 'Jumping/Reverse Lunges', detail: '20s' },
          { name: 'Rest', detail: '20s' },
        ],
      },
    ],
  },
  {
    id: 'C',
    title: 'Workout C',
    subtitle: 'Upper/Lower Strength + Athletic Power',
    sections: [
      {
        name: 'Warm Up',
        format: '×3 Rounds',
        rest: null,
        exercises: [
          { name: 'Lunges', detail: '10 reps' },
          { name: 'Butt Kicks', detail: '20s' },
          { name: 'Hip Circles', detail: '20s' },
        ],
      },
      {
        name: 'Station 1',
        format: '×3 Rounds',
        rest: 'Rest 60s',
        exercises: [
          { name: 'Single Leg RDL', detail: '10 reps/leg' },
          { name: 'Iso-Hold Push-Ups', detail: '2s pause · 6–10 reps' },
        ],
      },
      {
        name: 'Station 2',
        format: '×3 Rounds',
        rest: 'Rest 45s',
        exercises: [
          { name: 'Plank with Shoulder Taps', detail: '12 taps' },
          { name: 'Fast Bodyweight Squats', detail: '15 reps' },
          { name: 'Push-Up/Knee Push-Ups', detail: '10 reps' },
        ],
      },
      {
        name: 'Station 3',
        format: '×2 Rounds',
        rest: 'Rest 30s',
        exercises: [
          { name: 'Deadbug', detail: '12/side' },
          { name: 'Reverse Crunch', detail: '12–15 reps' },
        ],
      },
      {
        name: 'Finisher',
        format: '×3 Rounds',
        rest: null,
        exercises: [
          { name: 'AMRAP Burpees', detail: '20s' },
          { name: 'Rest', detail: '20s' },
        ],
      },
    ],
  },
]

export const PROGRESSION_GUIDE = {
  tempo: [
    { week: 1, label: '2s eccentric (lower slowly for 2 counts)' },
    { week: 2, label: '3s eccentric (slower, more control)' },
    { week: 3, label: 'Add 1s pause at the bottom' },
    { week: 4, label: 'Combine — 3s down, 1s pause, explode up' },
  ],
  reps: 'Hit 12 reps with clean tempo → restart at 8 reps using a harder variation.',
  variations: [
    {
      category: 'Lower Body',
      chain: 'Squat → Narrow Squat → Single-Leg Squat',
    },
    {
      category: 'Push-Ups',
      chain: 'Incline → Standard → Decline → Diamond',
    },
    {
      category: 'Core',
      chain: 'Plank → Shoulder Tap → Hollow Hold → Hollow Rocks',
    },
  ],
  density: 'Same AMRAP window each week — aim for more rounds as you get fitter.',
  intensity: [
    '20s on / 40s off',
    '30s on / 30s off',
    '40s on / 20s off',
  ],
}
