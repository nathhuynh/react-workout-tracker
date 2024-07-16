Page Structure
- Current workout (Today's workout + Calendar for viewing others)
- Mesocycles (Create new mesocycle / Mesocycle History)
- Custom exercises (Add / remove custom exercises)

1) Current Workout Page
=> Set # / Weight / Rep Count -+ / RIR ✓
=> Add/remove sets -+ ✓
=> Weight / Reps / RIR Dropdown lists ✓
=> Autofill the rest of the sets after the first set ✓
- Notes section at the bottom of each session ✓
=> "Tick Done" button for each Set ✓
=> Move Remove Exercise, Add/Remove Set, Add/Remove Dropset, etc to dropdown list (more clean) ✓
=> Drag exercises to change ordering ✓
=> Add/remove dropsets -+ ✓
=> Add Custom Exercise and have it save to JSON exercise list ✓
=> Functional minimizable calendar ✓
=> Left-side vertical side bar ✓

TODO
=> Nice side bar "tailwind collapsible sidebar react"
=> Supersets (group exercises together visually)

2) Create custom exercise page ✓

TODO:
=> Add Exercise Button fixed at the top right of page
=> Add Exercise pops the section in front of everything else (Foreground)
=> Same styling as CurrentWorkout (Width, Separating Lines, 3 dots dropdown)
=> Each custom exercise needs Name, Equipment, Muscles, Category displayed
=> Manage Exercise pops the section in front of everything else

3) Mesocycle Creation
- Pick weekly frequency ✓
- Plan weekly schedule on one page ✓
- Autofill a Mesocycle (4/5/6 week duration), (2 RIR, 1 RIR, 0 RIR, Deload for a 4 week mesocycle) ✓
=> Fix exercise loading for react-select lists ✓
=> Move Templates to a separate JSON / file ✓
=> Autofill 'Current Workout' pages for corresponding dates ✓
=> Fix exercise loading for react-select lists ✓
=> Move Templates to a separate JSON / file ✓
=> Create Mesocycle button saves to list of mesocycles ✓

TODO:
=> Copy a Day's exercise selections into another day (Maybe the User needs a sudden Rest Day) (Shift Days down?)
=> Sets per muscle group calcs
=> Extend mesocycle loading to automatically load Set numbers
=> Automatic deload at the end of the Mesocycle (Last week)
=> Recommended Progression (Add a set / Increment weight)
=> Drag to delete exercise box

4) Templates page
TODO:
=> User can create / remove templates
=> API for this?

5) Later features:
- Progression Charts for each exercise
- Rest timer (Needs to be on Current Workout page, you don't want to have to switch tabs)

6) Profile / Sign in / Database