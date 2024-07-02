import React, { useState, useEffect, ChangeEvent } from 'react';
import { fetchExercises, Exercise } from '../utils/exerciseService';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Menu,
  MenuItem as MenuItemOption,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { SelectChangeEvent } from '@mui/material';

interface Set {
  weight: number;
  reps: number;
  logged: boolean;
}

type ExerciseMap = Map<string, Set[]>;

const CurrentWorkout: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<ExerciseMap>(() => {
    const savedExercises = localStorage.getItem('workoutExercises');
    return savedExercises ? new Map(JSON.parse(savedExercises)) : new Map();
  });
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('workoutNotes');
    return savedNotes ? savedNotes : '';
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      const data: Exercise[] = await fetchExercises();
      setExercises(data);
    };
    loadExercises();
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutExercises', JSON.stringify(Array.from(workoutExercises.entries())));
  }, [workoutExercises]);

  useEffect(() => {
    localStorage.setItem('workoutNotes', notes);
  }, [notes]);

  const handleAddSet = (exerciseName: string) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = [...(updated.get(exerciseName) || [])];
      const lastSet = sets[sets.length - 1] || { weight: 0, reps: 0, logged: false };
      sets.push({ weight: lastSet.weight, reps: lastSet.reps, logged: false });
      updated.set(exerciseName, sets);
      return updated;
    });
  };

  const handleRemoveSet = (exerciseName: string, setIndex: number) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = updated.get(exerciseName) || [];
      sets.splice(setIndex, 1);
      if (sets.length === 0) {
        updated.delete(exerciseName);
      } else {
        updated.set(exerciseName, sets);
      }
      return updated;
    });
  };

  const handleInputChange = (exerciseName: string, setIndex: number, field: keyof Set, value: string) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = updated.get(exerciseName) || [];
      sets[setIndex] = { ...sets[setIndex], [field]: Number(value) };
      updated.set(exerciseName, sets);
      return updated;
    });
  };

  const handleLogSet = (exerciseName: string, setIndex: number) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = updated.get(exerciseName) || [];
      sets[setIndex].logged = true;
      updated.set(exerciseName, sets);
      return updated;
    });
  };

  const addWorkoutExercise = (exerciseName: string) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      if (!updated.has(exerciseName)) {
        updated.set(exerciseName, [{ weight: 0, reps: 0, logged: false }]);
      }
      return updated;
    });
  };

  const handleRemoveExercise = (exerciseName: string) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      updated.delete(exerciseName);
      return updated;
    });
  };

  const generateWeightOptions = () => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      options.push(i);
    }
    for (let i = 10.25; i <= 300; i += 0.25) {
      options.push(parseFloat(i.toFixed(2)));
    }
    return options;
  };

  const generateRepsOptions = (max: number) => {
    return Array.from({ length: max }, (_, i) => i + 1);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, exerciseName: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedExercise(exerciseName);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExercise(null);
  };

  const handleMenuItemClick = (option: string) => {
    if (selectedExercise) {
      switch (option) {
        case 'addSet':
          handleAddSet(selectedExercise);
          break;
        case 'removeSet':
          handleRemoveSet(selectedExercise, workoutExercises.get(selectedExercise)!.length - 1);
          break;
        case 'removeExercise':
          handleRemoveExercise(selectedExercise);
          break;
        default:
          break;
      }
    }
    handleMenuClose();
  };

  const allExercises = [...exercises, ...customExercises];
  const weightOptions = generateWeightOptions();
  const repsOptions = generateRepsOptions(50); // Assuming a maximum of 50 reps

  return (
    <Box className="min-h-screen flex flex-col text-black bg-gray-200 p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5">WEEK 1 DAY 1 Monday</Typography>
        <Button variant="outlined" color="primary">Minimize Calendar</Button>
      </Box>
      <Box className="mb-4">
        <FormControl fullWidth>
          <InputLabel>Add Exercise</InputLabel>
          <Select
            onChange={(e: SelectChangeEvent) => addWorkoutExercise(e.target.value as string)}
            label="Add Exercise"
          >
            <MenuItem value="">
              <em>Select an exercise</em>
            </MenuItem>
            {allExercises.map((exercise, index) => (
              <MenuItem key={index} value={exercise.name}>
                {exercise.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {Array.from(workoutExercises.entries()).map(([exerciseName, sets], exerciseIndex) => (
        <Box key={exerciseIndex} className="mb-6 p-4 bg-white rounded" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">{exerciseName}</Typography>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(event) => handleMenuClick(event, exerciseName)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItemOption onClick={() => handleMenuItemClick('addSet')}>Add Set</MenuItemOption>
              <MenuItemOption onClick={() => handleMenuItemClick('removeSet')}>Remove Set</MenuItemOption>
              <MenuItemOption onClick={() => handleMenuItemClick('removeExercise')}>Remove Exercise</MenuItemOption>
            </Menu>
          </Box>
          {sets && sets.length > 0 ? (
            <>
              <Box className="grid grid-cols-4 gap-4 items-center justify-items-center uppercase" sx={{ fontWeight: 'bold', mb: 1 }}>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>Set</Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>Weight (kg)</Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>Reps</Typography>
                <Box></Box>
              </Box>
              <Box className="flex flex-col">
                {sets.map((set, setIndex) => (
                  <Box key={setIndex} className="grid grid-cols-4 items-center justify-items-center text-center" sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography>{setIndex + 1}</Typography>
                    <FormControl fullWidth sx={{ mr: 1 }}>
                      <Select
                        value={set.weight === 0 ? '' : String(set.weight)}
                        onChange={(e: SelectChangeEvent) => handleInputChange(exerciseName, setIndex, 'weight', e.target.value)}
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected === '') {
                            return <p>ENTER</p>;
                          }
                          return selected;
                        }}
                      >
                        {weightOptions.map((option, idx) => (
                          <MenuItem key={idx} value={String(option)}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <Select
                        value={set.reps === 0 ? '' : String(set.reps)}
                        onChange={(e: SelectChangeEvent) => handleInputChange(exerciseName, setIndex, 'reps', e.target.value)}
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected === '') {
                            return <p>ENTER</p>;
                          }
                          return selected;
                        }}
                      >
                        {repsOptions.map((option, idx) => (
                          <MenuItem key={idx} value={String(option)}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box className="flex items-center justify-center">
                      {set.logged ? (
                        <CheckIcon color="primary" />
                      ) : (
                        <Button
                          onClick={() => handleLogSet(exerciseName, setIndex)}
                          variant="contained"
                          color="primary"
                        >
                          Log Set
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Typography>No sets available.</Typography>
          )}
        </Box>
      ))}
      <Box className="mt-4">
        <Typography className="block mb-2">Notes</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={notes}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default CurrentWorkout;