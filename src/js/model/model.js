//Storing workout instances.
export let workoutArr = [];

//Increment click for the selected workout.
export const incrementClick = function (clickedWorkout) {
  const updateWorkout = workoutArr.find(function (eachWorkout) {
    if (eachWorkout.id === clickedWorkout.id) {
      return eachWorkout;
    }
  });
  updateWorkout.clicks++;
};
