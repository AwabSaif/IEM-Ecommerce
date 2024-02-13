// Importing the useState hook from the 'react' library
import { useState } from 'react';
// Importing the custom hook useEffectOnUpdate
import useEffectOnUpdate from "./useEffectOnUpdate";

// Custom hook definition
export default function UseToggle(
    // Setting default initial value to false if not provided
    initialValue = false,
    // Setting default onToggle function to an empty function if not provided
    onToggle = () => { }
) {
    // Using the useState hook to create state for the toggle
    const [on, setOn] = useState(initialValue);

    // Function to toggle the state
    function toggle() {
        // Updating the state using the previous state value
        setOn(prevOn => !prevOn);
    }
    
    // Using the custom useEffectOnUpdate hook to trigger the onToggle function whenever the 'on' state changes
    useEffectOnUpdate(onToggle, [on]);

    // Returning the current state value and the toggle function
    return [on, toggle];
}
